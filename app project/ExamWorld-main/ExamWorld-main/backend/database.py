from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Standard XAMPP default MySQL connection string (user 'root', empty password, database 'examworld')
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/examworld"

# SQLAlchemy engine configured for MySQL
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600
)

# SessionLocal class for local session instantiation
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base model for SQLAlchemy ORM declarations
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that generates a new database session per request
    and guarantees it closes once the request lifecycle concludes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
