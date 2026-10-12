from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# TiDB Serverless Cloud Connection String
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://4QbvfAuUsgd8h2L.root:Qg4sVgFVJHDIuuSS@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/examworld?ssl_verify_cert=true&ssl_verify_identity=true"

# SQLAlchemy engine configured for MySQL
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600
)

# SessionLocal class for database session instantiation
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base model for SQLAlchemy ORM declarations
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy database session per request
    and guarantees it closes once the request lifecycle completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()