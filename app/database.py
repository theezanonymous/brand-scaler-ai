# database.py (SQLite-only, no-auth, hackathon-friendly)
"""
Thin convenience layer over SQLAlchemy for simple, method-based access.
- SQLite ONLY (fast demo). Fails fast if DATABASE_URL isn't sqlite://
- Reads DATABASE_URL from .env (defaults to sqlite:///./app.db)
- CRUD for Brand / ChatSession / ChatMessage
- FTS5 search on ChatMessage.text when available (falls back to LIKE)
"""

from __future__ import annotations
from contextlib import contextmanager
from typing import Iterable, Optional, Any, List
from datetime import datetime
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text, select
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import event

#  Adjust this import to wherever your models are defined
from app.models import Base, Brand, ChatSession, ChatMessage  # type: ignore

load_dotenv()

DEFAULT_SQLITE_PATH = "sqlite:///./app.db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_PATH)

# --- Enforce SQLite only ---
if not DATABASE_URL.startswith("sqlite"):
    raise RuntimeError(
        f"This build is SQLite-only. Set DATABASE_URL to sqlite:///... (got: {DATABASE_URL})"
    )

# Optional owner scoping (keep empty if Brand.owner_id is nullable)
DEMO_OWNER_ID = os.getenv("DEMO_OWNER_ID", "")  # e.g., "00000000-0000-0000-0000-000000000000"

# --- Engine / Session ---
engine: Engine = create_engine(
    DATABASE_URL,
    future=True,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False},  # needed for threaded FastAPI + SQLite
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False, future=True)

# --- Helpful PRAGMAs on connect ---
@event.listens_for(engine, "connect")
def _set_sqlite_pragmas(dbapi_connection, connection_record):  # type: ignore[no-redef]
    cur = dbapi_connection.cursor()
    # Foreign keys + WAL for fewer write locks + reasonable durability
    cur.execute("PRAGMA foreign_keys = ON;")
    cur.execute("PRAGMA journal_mode = WAL;")
    cur.execute("PRAGMA synchronous = NORMAL;")
    cur.close()

def _sqlite_supports_fts5() -> bool:
    """
    Try to create a temporary FTS5 table to detect support.
    Some bundled SQLite builds might lack FTS5.
    """
    try:
        with engine.begin() as conn:
            conn.exec_driver_sql("CREATE VIRTUAL TABLE IF NOT EXISTS _fts5_probe USING fts5(x);")
            conn.exec_driver_sql("DROP TABLE IF EXISTS _fts5_probe;")
        return True
    except Exception:
        return False

def _ensure_sqlite_fts() -> bool:
    """
    Create FTS virtual table + triggers for chat_message(text).
    Returns True if FTS5 is active, False otherwise.
    """
    if not _sqlite_supports_fts5():
        return False

    # FTS table stores: text (indexed) + message_id (for joins)
    create_fts = """
    CREATE VIRTUAL TABLE IF NOT EXISTS chat_message_fts
    USING fts5(text, message_id UNINDEXED, tokenize='porter');
    """

    # Keep FTS in sync with base table via triggers
    trg_insert = """
    CREATE TRIGGER IF NOT EXISTS chat_message_ai
    AFTER INSERT ON chat_message
    BEGIN
        INSERT INTO chat_message_fts(text, message_id)
        VALUES (coalesce(new.text, ''), new.id);
    END;
    """
    trg_update = """
    CREATE TRIGGER IF NOT EXISTS chat_message_au
    AFTER UPDATE OF text ON chat_message
    BEGIN
        UPDATE chat_message_fts
           SET text = coalesce(new.text, '')
         WHERE message_id = new.id;
    END;
    """
    trg_delete = """
    CREATE TRIGGER IF NOT EXISTS chat_message_ad
    AFTER DELETE ON chat_message
    BEGIN
        DELETE FROM chat_message_fts WHERE message_id = old.id;
    END;
    """

    with engine.begin() as conn:
        conn.exec_driver_sql(create_fts)
        conn.exec_driver_sql(trg_insert)
        conn.exec_driver_sql(trg_update)
        conn.exec_driver_sql(trg_delete)

        # Build or repair the index from existing data (idempotent)
        conn.exec_driver_sql("""
            INSERT INTO chat_message_fts (rowid, text, message_id)
            SELECT rowid, coalesce(text,''), id FROM chat_message
            WHERE NOT EXISTS (
                SELECT 1 FROM chat_message_fts f WHERE f.message_id = chat_message.id
            );
        """)

    return True

_HAS_FTS5 = False  # set by init_db()

def init_db(create_all_if_empty: bool = True) -> None:
    """
    Call once at startup. Creates ORM tables and FTS index (if supported).
    """
    global _HAS_FTS5
    if create_all_if_empty:
        Base.metadata.create_all(bind=engine)
    _HAS_FTS5 = _ensure_sqlite_fts()

@contextmanager
def session_scope() -> Iterable[Session]:
    """
    Context manager that yields a session and guarantees commit/rollback/close.
    """
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# -------------------------
# High-level DB convenience
# -------------------------
class DB:
    """
    Usage:
        from database import DB, init_db
        init_db()
        db = DB()

        brand = db.create_brand(name="Acme", niche="Tools")
        sess  = db.create_chat_session(brand_id=brand.id, title="Launch ideas")
        db.add_message(session_id=sess.id, role="user", text="Help me go viral!")
        messages = db.list_messages(sess.id, limit=20)
    """

    # ---------- Brands ----------
    def create_brand(
        self,
        *,
        name: str,
        owner_id: Optional[str] = None,
        niche: Optional[str] = None,
        tone: Optional[str] = None,
        colors: Optional[dict[str, Any]] = None,
        logo_url: Optional[str] = None,
        social_handles: Optional[dict[str, Any]] = None,
        meta: Optional[dict[str, Any]] = None,
    ) -> Brand:
        with session_scope() as s:
            _owner = owner_id or (DEMO_OWNER_ID or None)
            b = Brand(
                owner_id=_owner,  # ok if column is NULLable; else set DEMO_OWNER_ID
                name=name,
                niche=niche,
                tone=tone,
                colors=colors,
                logo_url=logo_url,
                social_handles=social_handles,
                meta=meta,
            )
            s.add(b)
            s.flush()
            s.refresh(b)
            return b

    def get_brand(self, brand_id: str) -> Optional[Brand]:
        with session_scope() as s:
            return s.get(Brand, brand_id)

    def list_brands(
        self,
        owner_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Brand]:
        with session_scope() as s:
            stmt = select(Brand).order_by(Brand.created_at.desc())
            if owner_id or DEMO_OWNER_ID:
                _owner = owner_id or (DEMO_OWNER_ID or None)
                if _owner is not None:
                    stmt = stmt.where(Brand.owner_id == _owner)
            stmt = stmt.limit(limit).offset(offset)
            return list(s.execute(stmt).scalars())

    def update_brand_meta(self, brand_id: str, meta_patch: dict[str, Any]) -> Optional[Brand]:
        with session_scope() as s:
            b = s.get(Brand, brand_id)
            if not b:
                return None
            b.meta = {**(b.meta or {}), **meta_patch}
            s.add(b)
            s.flush()
            s.refresh(b)
            return b

    def delete_brand(self, brand_id: str) -> bool:
        with session_scope() as s:
            b = s.get(Brand, brand_id)
            if not b:
                return False
            s.delete(b)
            return True

    # ---------- Chat Sessions ----------
    def create_chat_session(self, *, brand_id: str, title: Optional[str] = None) -> ChatSession:
        with session_scope() as s:
            cs = ChatSession(brand_id=brand_id, title=title)
            s.add(cs)
            s.flush()
            s.refresh(cs)
            return cs

    def list_sessions(
        self,
        brand_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[ChatSession]:
        with session_scope() as s:
            stmt = select(ChatSession).order_by(ChatSession.created_at.desc())
            if brand_id:
                stmt = stmt.where(ChatSession.brand_id == brand_id)
            stmt = stmt.limit(limit).offset(offset)
            return list(s.execute(stmt).scalars())

    # ---------- Chat Messages ----------
    def add_message(
        self,
        *,
        session_id: str,
        role: str,
        text: Optional[str] = None,
        payload: Optional[dict[str, Any]] = None,
    ) -> ChatMessage:
        with session_scope() as s:
            msg = ChatMessage(
                session_id=session_id,
                role=role,
                text=text,
                payload=payload,
            )
            s.add(msg)
            s.flush()
            s.refresh(msg)
            return msg

    def list_messages(
        self,
        session_id: str,
        limit: int = 100,
        before: Optional[datetime] = None,
    ) -> List[ChatMessage]:
        with session_scope() as s:
            stmt = select(ChatMessage).where(ChatMessage.session_id == session_id)
            if before:
                stmt = stmt.where(ChatMessage.created_at < before)
            stmt = stmt.order_by(ChatMessage.created_at.desc()).limit(limit)
            return list(s.execute(stmt).scalars())

    # ---------- Search (FTS5 when available, else LIKE) ----------
    def search_messages(
        self,
        brand_id: str,
        query: str,
        limit: int = 50,
    ) -> List[ChatMessage]:
        """
        SQLite:
          - If FTS5 is active, uses MATCH on chat_message_fts.
          - Otherwise, falls back to LIKE on chat_message.text.
        """
        with session_scope() as s:
            if _HAS_FTS5:
                stmt = text(
                    """
                    SELECT m.*
                      FROM chat_message m
                      JOIN chat_session cs ON cs.id = m.session_id
                      JOIN chat_message_fts f ON f.message_id = m.id
                     WHERE cs.brand_id = :brand_id
                       AND chat_message_fts MATCH :q
                     ORDER BY m.created_at DESC
                     LIMIT :limit
                    """
                )
                rows = s.execute(stmt, {"brand_id": brand_id, "q": query, "limit": limit}).mappings().all()
                ids = [r["id"] for r in rows]
                if not ids:
                    return []
                return list(s.execute(select(ChatMessage).where(ChatMessage.id.in_(ids))).scalars())
            else:
                like_q = f"%{query}%"
                stmt = text(
                    """
                    SELECT m.*
                      FROM chat_message m
                      JOIN chat_session cs ON cs.id = m.session_id
                     WHERE cs.brand_id = :brand_id
                       AND m.text LIKE :like_q
                     ORDER BY m.created_at DESC
                     LIMIT :limit
                    """
                )
                rows = s.execute(stmt, {"brand_id": brand_id, "like_q": like_q, "limit": limit}).mappings().all()
                ids = [r["id"] for r in rows]
                if not ids:
                    return []
                return list(s.execute(select(ChatMessage).where(ChatMessage.id.in_(ids))).scalars())


# Optional: instantiate a shared helper (import and use directly)
db = DB()