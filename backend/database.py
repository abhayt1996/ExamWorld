import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database connection URL for MySQL
# Default connects to local MySQL database 'examworld'
# Override using the DATABASE_URL environment variable if needed
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/examworld?charset=utf8mb4"
)

# SQLAlchemy engine configured for MySQL with utf8mb4 support
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Automatically reconnect if connection was dropped
    pool_recycle=3600,       # Recycle connections every hour to avoid MySQL timeout
    pool_size=10,            # Connection pool size
    max_overflow=20          # Maximum overflow connections beyond pool_size
)

# Session factory for generating local database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for declarative ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy database session per request
    and ensures the session is properly closed when the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
