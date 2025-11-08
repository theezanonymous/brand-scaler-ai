# app/models.py
from __future__ import annotations
from datetime import datetime
from typing import Optional, Any, List

from sqlalchemy import (
    Column, Integer, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

# --------- Brand ---------
class Brand(Base):
    __tablename__ = "brand"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    #null = ok
    owner_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    name: Mapped[str] = mapped_column(Text, nullable=False)
    niche: Mapped[Optional[str]] = mapped_column(Text)
    tone: Mapped[Optional[str]] = mapped_column(Text)
    colors: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    logo_url: Mapped[Optional[str]] = mapped_column(Text)
    social_handles: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    meta: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    sessions: Mapped[List["ChatSession"]] = relationship(back_populates="brand", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Brand id={self.id} name={self.name!r}>"

# --------- ChatSession ---------
class ChatSession(Base):
    __tablename__ = "chat_session"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    brand_id: Mapped[int] = mapped_column(ForeignKey("brand.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    brand: Mapped[Brand] = relationship(back_populates="sessions")
    messages: Mapped[List["ChatMessage"]] = relationship(back_populates="session", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<ChatSession id={self.id} brand_id={self.brand_id} title={self.title!r}>"

# --------- ChatMessage ---------
class ChatMessage(Base):
    __tablename__ = "chat_message"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("chat_session.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(Text, nullable=False)  # 'user' | 'assistant' | 'tool' 등
    text: Mapped[Optional[str]] = mapped_column(Text)
    payload: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    session: Mapped[ChatSession] = relationship(back_populates="messages")

    def __repr__(self) -> str:
        return f"<ChatMessage id={self.id} session_id={self.session_id} role={self.role!r}>"