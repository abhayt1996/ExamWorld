import uuid
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Text,
    ForeignKey,
    DateTime,
    JSON
)
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


def generate_uuid() -> str:
    """Helper to generate random string UUID primary keys."""
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    role = Column(String(20), nullable=False, default="student")  # 'admin' or 'student'
    name = Column(String(120), nullable=False)
    username = Column(String(60), unique=True, index=True, nullable=False)
    mobile = Column(String(20), nullable=True)
    current_class = Column(String(10), nullable=False, default="10")  # '6', '7', ..., '12'
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    test_attempts = relationship("TestAttempt", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, username={self.username}, role={self.role}, class={self.current_class})>"


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    class_id = Column(String(10), nullable=False, index=True)  # '6', '7', '8', '9', '10', '11', '12'
    name = Column(String(150), nullable=False)
    code = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan", order_by="Topic.chapter_number")

    def __repr__(self):
        return f"<Subject(id={self.id}, class_id={self.class_id}, name={self.name})>"


class Topic(Base):
    __tablename__ = "topics"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    subject_id = Column(String(64), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    chapter_number = Column(Integer, nullable=False, default=1)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    subject = relationship("Subject", back_populates="topics")
    tests = relationship("Test", back_populates="topic", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Topic(id={self.id}, chapter={self.chapter_number}, title={self.title})>"


class Test(Base):
    __tablename__ = "tests"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    topic_id = Column(String(64), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=15)
    marks = Column(Integer, nullable=False, default=20)
    difficulty = Column(String(20), nullable=False, default="Medium")  # 'Easy', 'Medium', 'Hard'
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    topic = relationship("Topic", back_populates="tests")
    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    test_attempts = relationship("TestAttempt", back_populates="test", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Test(id={self.id}, title={self.title}, marks={self.marks})>"


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    test_id = Column(String(64), ForeignKey("tests.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    # Stored as JSON array: ["Option A", "Option B", "Option C", "Option D"]
    options = Column(JSON, nullable=False)
    correct_index = Column(Integer, nullable=False, default=0)
    explanation = Column(Text, nullable=True)
    # LONGTEXT (up to 4GB) to safely accommodate Base64 images
    image_url = Column(LONGTEXT, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    test = relationship("Test", back_populates="questions")

    def __repr__(self):
        return f"<Question(id={self.id}, test_id={self.test_id}, prompt={self.question_text[:30]}...)>"


class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    test_id = Column(String(64), ForeignKey("tests.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Integer, nullable=False, default=0)
    percentage = Column(Integer, nullable=False, default=0)
    total_time_spent_seconds = Column(Integer, nullable=False, default=0)
    # Stored as JSON: [12, 18, 9, 31, 14, ...] per-question stopwatch tracking
    time_spent_per_question = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="test_attempts")
    test = relationship("Test", back_populates="test_attempts")

    def __repr__(self):
        return f"<TestAttempt(id={self.id}, user_id={self.user_id}, score={self.score}/{self.percentage}%)>"