# database.py (no-auth, hackathon-friendly)
"""
Thin convenience layer over SQLAlchemy for simple, method-based access.
- Reads DATABASE_URL from .env
- Provides a DB() class with simple CRUD for Brand/Session/Message
- No user/auth dependencies
- Works with SQLite (dev) and Postgres (prod)
"""

from __future__ import annotations
from contextlib import contextmanager
from typing import Iterable, Optional, Any, List
from datetime import datetime

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, select, func
from sqlalchemy.orm import sessionmaker, Session

# 👇 Adjust this import to wherever your models are defined
# NOTE: We intentionally do NOT import User here.
from app.models import Base, Brand, ChatSession, ChatMessage  # type: ignore

load_dotenv()

DEFAULT_SQLITE_PATH = "sqlite:///./app.db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_PATH)

IS_SQLITE = DATABASE_URL.startswith("sqlite")

# If your Brand.owner_id is NOT NULL, set a fixed demo owner id here (UUID string).
# Leave empty if Brand.owner_id is nullable.
DEMO_OWNER_ID = os.getenv("DEMO_OWNER_ID", "")  # e.g., "00000000-0000-0000-0000-000000000000"

# Engine / Session
engine_kwargs: dict[str, Any] = {
    "future": True,
    "pool_pre_ping": True,
}

if IS_SQLITE:
    # SQLite requires this when the ORM is used from different threads.
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    **engine_kwargs,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False, future=True)

def init_db(create_all_if_empty: bool = True) -> None:
    """
    Call once at startup. In dev/SQLite you can create tables if they don't exist.
    In prod (Postgres), rely on Alembic migrations instead.
    """
    if create_all_if_empty and DATABASE_URL.startswith("sqlite"):
        Base.metadata.create_all(bind=engine)

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
            # If your schema requires owner_id, fall back to DEMO_OWNER_ID.
            _owner = owner_id or (DEMO_OWNER_ID or None)
            b = Brand(
                owner_id=_owner,  # okay if column is nullable; otherwise set DEMO_OWNER_ID env
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
            # If you kept owner scoping, filter when provided
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

    # ---------- Search (simple & Postgres-aware) ----------
    def search_messages(
        self,
        brand_id: str,
        query: str,
        limit: int = 50,
    ) -> List[ChatMessage]:
        """
        - On Postgres: uses to_tsvector (english).
        - On SQLite: falls back to LIKE.
        """
        with session_scope() as s:
            if DATABASE_URL.startswith("postgres"):
                stmt = text(
                    """
                    SELECT m.*
                    FROM chat_message m
                    JOIN chat_session cs ON cs.id = m.session_id
                    WHERE cs.brand_id = :brand_id
                      AND to_tsvector('english', coalesce(m.text, '')) @@ plainto_tsquery('english', :q)
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
                stmt = (
                    select(ChatMessage)
                    .join(ChatSession, ChatSession.id == ChatMessage.session_id)
                    .where(ChatSession.brand_id == brand_id)
                    .where(ChatMessage.text.ilike(f"%{query}%") if hasattr(func, "ilike") else ChatMessage.text.like(f"%{query}%"))
                    .order_by(ChatMessage.created_at.desc())
                    .limit(limit)
                )
                return list(s.execute(stmt).scalars())


# Optional: instantiate a shared helper (import and use directly)
db = DB()
