from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    selected_theme = Column(String(50), default="dark-dungeon", nullable=False)
    personality_house = Column(String(50), default="Blossom Leader", nullable=False)
    character_avatar = Column(String(100), default="warrior_girl", nullable=False)
    
    # RPG Progression Stats
    level = Column(Integer, default=1, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    gold = Column(Integer, default=100, nullable=False)
    streak = Column(Integer, default=1, nullable=False)
    
    # Core RPG Attributes
    intellect = Column(Integer, default=10, nullable=False)
    strength = Column(Integer, default=10, nullable=False)
    vitality = Column(Integer, default=10, nullable=False)
    mind = Column(Integer, default=10, nullable=False)
    
    # House Induction & Avatar Customization Progress
    has_completed_induction = Column(Boolean, default=False, nullable=False)
    avatar_config = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    lounges = relationship("Lounge", back_populates="creator")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    map_location = Column(String(100), default="Town Square", nullable=False)
    difficulty = Column(String(50), default="Medium", nullable=False)
    xp_reward = Column(Integer, default=50, nullable=False)
    gold_reward = Column(Integer, default=20, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="tasks")


class Lounge(Base):
    __tablename__ = "lounges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    is_private = Column(Boolean, default=False, nullable=False)
    invite_code = Column(String(50), unique=True, index=True, nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationship
    creator = relationship("User", back_populates="lounges")
