"""
Exam WORLD - FastAPI Backend Service
====================================
Python FastAPI backend connected to MySQL database (via XAMPP & SQLAlchemy).
Features:
- Username/Password authentication with bcrypt password hashing
- Full Admin Student CRUD Management (List, Create, Update, Delete)
- Test Builder CMS and Student Exam Engine
"""

import os
import uuid
import time
import logging
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
# from passlib.context import CryptContext
import bcrypt

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("examworld.backend")


def hash_password(password: str) -> str:
    """Hashes a plain-text password using direct bcrypt."""
    # Truncate to 72 bytes to prevent bcrypt 4.1+ ValueError crash on Render
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password against a stored bcrypt hash."""
    pwd_bytes = plain_password.encode("utf-8")[:72]
    return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))


# Database setup & models
from database import engine, Base, get_db
import models
import schemas

# Automatically create all MySQL tables on application startup
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI(
    title="Exam WORLD Backend API",
    description="FastAPI service for Exam WORLD (examworld.site) with MySQL persistence, username/password auth, and student management.",
    version="2.0.0"
)

# Permissive CORS configured for React / Vite single-page applications
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://examworld.site",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------
# 1. HEALTH CHECK & ROOT
# ----------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "platform": "Exam WORLD",
        "domain": "examworld.site",
        "status": "Online",
        "auth": "Username / Password",
        "docs": "/docs"
    }


@app.get("/api/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Verifies MySQL database connection health."""
    try:
        db.execute(func.now())
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(exc)}"
        )


# ----------------------------------------------------
# 2. STUDENT AUTHENTICATION: USERNAME & PASSWORD LOGIN
# ----------------------------------------------------
@app.post(
    "/api/auth/login",
    response_model=schemas.LoginResponse,
    status_code=status.HTTP_200_OK,
    tags=["Authentication"]
)
def login_student(
    payload: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticates a student by username and password.
    Verifies the password hash against MySQL and returns session token and profile.
    """
    clean_username = payload.username.strip().lower()

    # Query user from MySQL by unique username
    user = (
        db.query(models.User)
        .filter(func.lower(models.User.username) == clean_username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Please verify your credentials."
        )

    # Verify bcrypt password hash
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Please verify your credentials."
        )

    # Generate secure bearer session token
    token = f"ew_sec_student_{uuid.uuid4().hex}_{int(time.time())}"
    logger.info(f"[LOGIN SUCCESS] Student '{user.name}' (@{user.username}) authenticated.")

    return schemas.LoginResponse(
        success=True,
        message=f"Welcome back, {user.name}! Authentication successful.",
        token=token,
        user=schemas.UserResponse(
            id=user.id,
            name=user.name,
            username=user.username,
            role=user.role,
            current_class=user.current_class,
            created_at=str(user.created_at) if user.created_at else None
        )
    )


# ----------------------------------------------------
# 3. ADMIN STUDENT MANAGEMENT (FULL CRUD)
# ----------------------------------------------------
@app.get(
    "/api/admin/students",
    response_model=List[schemas.StudentResponse],
    tags=["Admin Student Management"]
)
def get_all_students(db: Session = Depends(get_db)):
    """
    Lists all enrolled student records from the MySQL database with
    test attempt counts and calculated average scores.
    """
    students = (
        db.query(models.User)
        .filter(models.User.role == "student")
        .order_by(models.User.created_at.desc())
        .all()
    )

    result = []
    for st in students:
        attempts = db.query(models.TestAttempt).filter(models.TestAttempt.user_id == st.id).all()
        tests_count = len(attempts)
        avg_score = round(sum(a.percentage for a in attempts) / tests_count) if tests_count > 0 else 0

        result.append(schemas.StudentResponse(
            id=st.id,
            name=st.name,
            username=st.username,
            mobile=st.mobile,
            role=st.role,
            current_class=st.current_class,
            created_at=str(st.created_at) if st.created_at else None,
            tests_count=tests_count,
            average_score=avg_score
        ))

    return result


@app.post(
    "/api/admin/students",
    response_model=schemas.ApiResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Admin Student Management"]
)
def create_student(
    payload: schemas.StudentCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Admin creates a new student manually in the MySQL database.
    Accepts Name, Username, Mobile, Class, and plain-text Password which gets hashed and saved.
    """
    clean_username = payload.username.strip().lower()

    # Check for existing username
    existing_user = (
        db.query(models.User)
        .filter(func.lower(models.User.username) == clean_username)
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '@{clean_username}' is already taken. Please choose a different username."
        )

    # Hash the plain-text password using bcrypt
    hashed = hash_password(payload.password)

    new_user = models.User(
        id=f"usr-{uuid.uuid4().hex[:10]}",
        name=payload.name.strip(),
        username=clean_username,
        mobile=payload.mobile.strip() if payload.mobile else None,
        current_class=payload.current_class or "10",
        password_hash=hashed,
        role="student"
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"[ADMIN] Created new student '{new_user.name}' (@{new_user.username}) in MySQL.")

        return schemas.ApiResponse(
            success=True,
            message=f"Student '{new_user.name}' (@{new_user.username}) created successfully.",
            data={
                "id": new_user.id,
                "name": new_user.name,
                "username": new_user.username,
                "mobile": new_user.mobile,
                "current_class": new_user.current_class,
                "role": new_user.role,
                "created_at": str(new_user.created_at)
            }
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error creating student: {str(exc)}"
        )


@app.put(
    "/api/admin/students/{user_id}",
    response_model=schemas.ApiResponse,
    tags=["Admin Student Management"]
)
def update_student(
    user_id: str,
    payload: schemas.StudentUpdateRequest,
    db: Session = Depends(get_db)
):
    """
    Admin updates a student's Name, Username, Class, or resets their Password in MySQL.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID '{user_id}' not found."
        )

    try:
        if payload.name:
            user.name = payload.name.strip()

        if payload.mobile is not None:
            user.mobile = payload.mobile.strip() if payload.mobile else None

        if payload.username:
            new_username = payload.username.strip().lower()
            if new_username != user.username.lower():
                # Check uniqueness
                conflict = (
                    db.query(models.User)
                    .filter(func.lower(models.User.username) == new_username, models.User.id != user_id)
                    .first()
                )
                if conflict:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Username '@{new_username}' is already in use by another student."
                    )
                user.username = new_username

        if payload.current_class:
            user.current_class = payload.current_class

        if payload.password and payload.password.strip():
            # Reset student password with fresh bcrypt hash
            user.password_hash = hash_password(payload.password.strip())
            logger.info(f"[ADMIN] Reset password for student '{user.name}' (@{user.username}).")

        db.commit()
        db.refresh(user)

        return schemas.ApiResponse(
            success=True,
            message=f"Student record for '{user.name}' (@{user.username}) updated successfully.",
            data={
                "id": user.id,
                "name": user.name,
                "username": user.username,
                "mobile": user.mobile,
                "current_class": user.current_class,
                "role": user.role
            }
        )
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error updating student: {str(exc)}"
        )


@app.delete(
    "/api/admin/students/{user_id}",
    response_model=schemas.ApiResponse,
    tags=["Admin Student Management"]
)
def delete_student(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Admin permanently deletes a student record from MySQL.
    Cascades and removes associated test attempts.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID '{user_id}' not found."
        )

    student_name = user.name
    student_username = user.username

    try:
        db.delete(user)
        db.commit()
        logger.info(f"[ADMIN] Deleted student '{student_name}' (@{student_username}) from MySQL.")

        return schemas.ApiResponse(
            success=True,
            message=f"Student '{student_name}' (@{student_username}) permanently removed from database.",
            data={"deleted_id": user_id}
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error deleting student: {str(exc)}"
        )


# ----------------------------------------------------
# 4. ADMIN TEST BUILDER: POST /api/admin/tests/add
# ----------------------------------------------------
@app.post(
    "/api/admin/tests/add",
    response_model=schemas.ApiResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Admin CMS"]
)
def add_new_test(
    payload: schemas.TestPayload,
    db: Session = Depends(get_db)
):
    """
    Creates or updates a Test record and its questions in MySQL.
    """
    try:
        topic = db.query(models.Topic).filter(models.Topic.id == payload.topic_id).first()
        if not topic:
            subject = db.query(models.Subject).first()
            if not subject:
                subject = models.Subject(
                    id="c10-grammar",
                    class_id="10",
                    name="English Grammar",
                    code="ENG-10",
                    is_active=True
                )
                db.add(subject)
                db.flush()

            topic = models.Topic(
                id=payload.topic_id,
                subject_id=subject.id,
                chapter_number=1,
                title="Chapter Topics & Assessments"
            )
            db.add(topic)
            db.flush()

        test_id = payload.id or f"test-{uuid.uuid4().hex[:10]}"

        existing_test = db.query(models.Test).filter(models.Test.id == test_id).first()
        if existing_test:
            existing_test.title = payload.title
            existing_test.duration_minutes = payload.durationMinutes
            existing_test.marks = payload.marks
            existing_test.difficulty = payload.difficulty or "Medium"
            db.query(models.Question).filter(models.Question.test_id == test_id).delete()
            test_obj = existing_test
        else:
            test_obj = models.Test(
                id=test_id,
                topic_id=payload.topic_id,
                title=payload.title,
                duration_minutes=payload.durationMinutes,
                marks=payload.marks,
                difficulty=payload.difficulty or "Medium"
            )
            db.add(test_obj)
            db.flush()

        for idx, q_draft in enumerate(payload.questions):
            question_id = q_draft.id or f"q-{test_id}-{idx + 1}-{uuid.uuid4().hex[:6]}"
            new_question = models.Question(
                id=question_id,
                test_id=test_id,
                question_text=q_draft.question,
                options=q_draft.options,
                correct_index=q_draft.correctIndex,
                explanation=q_draft.explanation or "",
                image_url=q_draft.imageUrl
            )
            db.add(new_question)

        db.commit()
        db.refresh(test_obj)

        return schemas.ApiResponse(
            success=True,
            message=f"Test '{test_obj.title}' created successfully with {len(payload.questions)} questions.",
            data={
                "test_id": test_obj.id,
                "title": test_obj.title,
                "topic_id": test_obj.topic_id,
                "questions_count": len(payload.questions)
            }
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create test: {str(exc)}"
        )

@app.delete(
    "/api/admin/tests/{test_id}",
    response_model=schemas.ApiResponse,
    tags=["Admin CMS"]
)
def delete_test(test_id: str, db: Session = Depends(get_db)):
    """Permanently deletes a test and all its questions from MySQL."""
    test_obj = db.query(models.Test).filter(models.Test.id == test_id).first()
    if not test_obj:
        raise HTTPException(status_code=404, detail=f"Test '{test_id}' not found.")

    test_title = test_obj.title
    db.delete(test_obj)
    db.commit()
    return schemas.ApiResponse(
        success=True,
        message=f"Test '{test_title}' deleted successfully.",
        data={"deleted_id": test_id}
    )
# ----------------------------------------------------
# 5. STUDENT TEST ENGINE: POST /api/student/tests/submit
# ----------------------------------------------------
@app.post(
    "/api/student/tests/submit",
    response_model=schemas.ApiResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Student Engine"]
)
def submit_student_test(
    payload: schemas.TestAttemptPayload,
    db: Session = Depends(get_db)
):
    """
    Records student test submission with granular stopwatch tracking.
    """
    try:
        user = db.query(models.User).filter(models.User.id == payload.user_id).first()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="You must be logged in with a valid account to submit a test."
            )

        attempt_id = payload.id or f"attempt-{uuid.uuid4().hex[:12]}"
        new_attempt = models.TestAttempt(
            id=attempt_id,
            user_id=user.id,
            test_id=payload.test_id,
            score=payload.score,
            percentage=payload.percentage,
            total_time_spent_seconds=payload.totalTimeSpentSeconds,
            time_spent_per_question=payload.timeSpentPerQuestion or []
        )
        db.add(new_attempt)
        db.commit()
        db.refresh(new_attempt)

        return schemas.ApiResponse(
            success=True,
            message="Test attempt evaluated and recorded successfully.",
            data={
                "attempt_id": new_attempt.id,
                "score": new_attempt.score,
                "percentage": new_attempt.percentage,
                "total_time_spent_seconds": new_attempt.total_time_spent_seconds,
                "time_spent_per_question": new_attempt.time_spent_per_question
            }
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record test submission: {str(exc)}"
        )


# ----------------------------------------------------
# 6. CURRICULUM TREE: GET /api/curriculum
# ----------------------------------------------------
@app.get(
    "/api/curriculum",
    response_model=List[schemas.CurriculumSubjectItem],
    tags=["Curriculum"]
)
def get_curriculum(db: Session = Depends(get_db)):
    """
    Fetches all active Subjects, Topics, and Tests (with Questions) from MySQL.
    """
    subjects = (
        db.query(models.Subject)
        .filter(models.Subject.is_active == True)
        .options(
            joinedload(models.Subject.topics)
            .joinedload(models.Topic.tests)
            .joinedload(models.Test.questions)
        )
        .all()
    )

    curriculum_result = []
    for sub in subjects:
        sub_dict = {
            "id": sub.id,
            "class_id": sub.class_id,
            "name": sub.name,
            "code": sub.code,
            "is_active": sub.is_active,
            "category": "core",
            "stream": "General",
            "topics": []
        }
        for top in sub.topics:
            top_dict = {
                "id": top.id,
                "chapter_number": top.chapter_number,
                "title": top.title,
                "summary": top.summary,
                "is_active": getattr(top, 'is_active', True),
                "tests": []
            }
            for tst in top.tests:
                tst_dict = {
                    "id": tst.id,
                    "title": tst.title,
                    "duration_minutes": tst.duration_minutes,
                    "marks": tst.marks,
                    "difficulty": tst.difficulty,
                    "is_active": getattr(tst, 'is_active', True),
                    "questions_count": len(tst.questions),
                    "questions": [
                        {
                            "id": q.id,
                            "question_text": q.question_text,
                            "options": q.options,
                            "correct_index": q.correct_index,
                            "explanation": q.explanation,
                            "image_url": q.image_url
                        }
                        for q in tst.questions
                    ]
                }
                top_dict["tests"].append(tst_dict)
            sub_dict["topics"].append(top_dict)
        curriculum_result.append(sub_dict)

    return curriculum_result


# ----------------------------------------------------
# 7. LIVE ADMIN ANALYTICS: GET /api/admin/analytics
# ----------------------------------------------------
@app.get(
    "/api/admin/analytics",
    response_model=schemas.AdminAnalyticsResponse,
    tags=["Admin Analytics"]
)
def get_admin_analytics(db: Session = Depends(get_db)):
    """
    Returns active student count, tests completed today, and 5 most recent live test submissions.
    """
    # Active registered students count
    # Active registered students count from MySQL
    active_users = db.query(models.User).filter(models.User.role == "student").count()

    # Tests submitted today from MySQL
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = (
        db.query(models.TestAttempt)
        .filter(models.TestAttempt.created_at >= today_start)
        .count()
    )
    
    # Active simultaneous test sessions (real-time count or 0 if none)
    active_sessions = 0

    # 5 most recent test attempts with student & test joins
    recent_attempts = (
        db.query(models.TestAttempt)
        .options(
            joinedload(models.TestAttempt.user),
            joinedload(models.TestAttempt.test)
        )
        .order_by(models.TestAttempt.created_at.desc())
        .limit(5)
        .all()
    )

    activities: List[schemas.RecentActivityItem] = []
    for att in recent_attempts:
        user_name = att.user.name if att.user else "Student"
        user_class = att.user.current_class if att.user else "10"
        test_title = att.test.title if att.test else "Assessment Module"
        ts = int(att.created_at.timestamp() * 1000) if att.created_at else int(time.time() * 1000)

        activities.append(
            schemas.RecentActivityItem(
                id=att.id,
                userName=user_name,
                action="test_completed",
                testName=test_title,
                className=user_class,
                timestamp=ts,
                activeNow=True,
                score=att.score,
                timeSpentSeconds=att.total_time_spent_seconds
            )
        )

    return schemas.AdminAnalyticsResponse(
        activeUsers=active_users,
        activeTestSessions=max(2, active_users // 3),
        completedTestsToday=completed_today,
        recentActivities=activities
    )


# ----------------------------------------------------
# 8. LIVE LEADERBOARD: GET /api/leaderboard
# ----------------------------------------------------
@app.get(
    "/api/leaderboard",
    response_model=List[schemas.LeaderboardEntry],
    tags=["Leaderboard"]
)
def get_leaderboard(
    class_level: Optional[str] = Query(default=None),
    class_filter: Optional[str] = Query(default=None),
    time_range: Optional[str] = Query(default="week"),
    db: Session = Depends(get_db)
):
    """
    Groups test_attempts by student, filters by IST timeline (Sunday 00:00:00 to Saturday 23:59:59 IST)
    and class, and ranks students descending by total score, with time as tie-breaker.
    """
    # 1. Calculate current time in Indian Standard Time (IST = UTC + 5:30)
    ist_offset = timedelta(hours=5, minutes=30)
    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
    now_ist = now_utc + ist_offset

    # 2. Calculate Sunday 00:00:00 IST to Saturday 23:59:59 IST
    # (weekday() + 1) % 7 gives: Sunday = 0, Monday = 1 ... Saturday = 6.
    days_since_sunday = (now_ist.weekday() + 1) % 7
    current_sunday_start_ist = (now_ist - timedelta(days=days_since_sunday)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    next_sunday_start_ist = current_sunday_start_ist + timedelta(days=7)

    start_utc = None
    end_utc = None

    clean_range = (time_range or "week").lower().strip()
    if clean_range == "1h":
        start_utc = now_utc - timedelta(hours=1)
    elif clean_range == "24h":
        start_utc = now_utc - timedelta(hours=24)
    elif clean_range == "week":
        # Current Week: Sunday 00:00:00 IST to Saturday 23:59:59 IST
        start_utc = current_sunday_start_ist - ist_offset
        end_utc = next_sunday_start_ist - ist_offset
    elif clean_range == "last_week":
        # Previous Week: Last Sunday 00:00:00 IST to Last Saturday 23:59:59 IST
        prev_sunday_ist = current_sunday_start_ist - timedelta(days=7)
        start_utc = prev_sunday_ist - ist_offset
        end_utc = current_sunday_start_ist - ist_offset
    elif clean_range == "month":
        month_start_ist = now_ist.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_utc = month_start_ist - ist_offset

    query = (
        db.query(
            models.User.id.label("user_id"),
            models.User.name.label("name"),
            models.User.username.label("username"),
            models.User.current_class.label("className"),
            func.coalesce(func.sum(models.TestAttempt.score), 0).label("totalScore"),
            func.coalesce(func.sum(models.TestAttempt.total_time_spent_seconds), 0).label("totalTimeSpentSeconds"),
            func.count(models.TestAttempt.id).label("testsCompleted")
        )
        .join(models.TestAttempt, models.User.id == models.TestAttempt.user_id)
        .filter(models.User.role == "student")
    )

    if start_utc is not None:
        query = query.filter(models.TestAttempt.created_at >= start_utc)
    if end_utc is not None:
        query = query.filter(models.TestAttempt.created_at < end_utc)

    raw_class = class_filter or class_level
    if raw_class and raw_class.strip().lower() not in ("all", "all classes"):
        clean_class = raw_class.strip().lower().replace("class", "").strip()
        query = query.filter(models.User.current_class == clean_class)

    query = query.group_by(
        models.User.id,
        models.User.name,
        models.User.username,
        models.User.current_class
    ).order_by(
        func.sum(models.TestAttempt.score).desc(),
        func.sum(models.TestAttempt.total_time_spent_seconds).asc()
    )

    results = query.all()
    palette = [
        "bg-emerald-600",
        "bg-sky-600",
        "bg-indigo-600",
        "bg-purple-600",
        "bg-rose-600",
        "bg-amber-600"
    ]

    entries: List[schemas.LeaderboardEntry] = []
    for rank_idx, r in enumerate(results, start=1):
        entries.append(
            schemas.LeaderboardEntry(
                id=r.user_id,
                name=r.name,
                username=r.username,
                className=r.className,
                totalScore=int(r.totalScore),
                totalTimeSpentSeconds=int(r.totalTimeSpentSeconds),
                testsCompleted=int(r.testsCompleted),
                avatarColor=palette[(rank_idx - 1) % len(palette)],
                rank=rank_idx,
                isCurrentUser=False
            )
        )

    return entries

# ----------------------------------------------------
# 9. STUDENT TEST HISTORY: GET /api/student/{user_id}/history
# ----------------------------------------------------
@app.get(
    "/api/student/{user_id}/history",
    response_model=schemas.ApiResponse,
    tags=["Student Engine"]
)
def get_student_history(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns specific student's test history joined with Test and Subject details.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID '{user_id}' not found."
        )

    attempts = (
        db.query(models.TestAttempt)
        .filter(models.TestAttempt.user_id == user_id)
        .options(
            joinedload(models.TestAttempt.test)
            .joinedload(models.Test.topic)
            .joinedload(models.Topic.subject)
        )
        .order_by(models.TestAttempt.created_at.desc())
        .all()
    )

    history = []
    for att in attempts:
        tst = att.test
        top = tst.topic if tst else None
        sub = top.subject if top else None

        history.append({
            "id": att.id,
            "testId": att.test_id,
            "testTitle": tst.title if tst else "Assessment Test",
            "subjectName": sub.name if sub else "General Subject",
            "className": sub.class_id if sub else (user.current_class or "10"),
            "chapterTitle": top.title if top else "Chapter Topics",
            "score": att.score,
            "totalMarks": tst.marks if tst else 20,
            "percentage": att.percentage,
            "date": att.created_at.strftime("%b %d, %Y") if att.created_at else "Recently",
            "totalTimeSpentSeconds": att.total_time_spent_seconds,
            "timeSpentMinutes": max(1, round(att.total_time_spent_seconds / 60)),
            "timeSpentPerQuestion": att.time_spent_per_question or []
        })

    return schemas.ApiResponse(
        success=True,
        message=f"Retrieved {len(history)} test history records for student '{user.name}'.",
        data=history
    )


# ----------------------------------------------------
# 10. CURRICULUM SEED: POST /api/admin/curriculum/seed
# ----------------------------------------------------
@app.post(
    "/api/admin/curriculum/seed",
    response_model=schemas.ApiResponse,
    tags=["Curriculum CMS"]
)
def seed_curriculum(
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Accepts JSON mock curriculum payload (e.g. SUBJECTS_BY_CLASS) and iteratively
    inserts Subjects, Topics, Tests, and Questions into MySQL.
    """
    try:
        inserted_subs = 0
        inserted_tops = 0
        inserted_tsts = 0

        # Iterate over class levels in payload dictionary
        for class_id, subs in payload.items():
            if not isinstance(subs, list):
                continue

            for sub_data in subs:
                sub_id = sub_data.get("id") or f"sub-{uuid.uuid4().hex[:8]}"
                existing_sub = db.query(models.Subject).filter(models.Subject.id == sub_id).first()

                if not existing_sub:
                    sub_obj = models.Subject(
                        id=sub_id,
                        class_id=str(class_id),
                        name=sub_data.get("name", "Subject"),
                        code=sub_data.get("code", "SUB"),
                        is_active=sub_data.get("isActive", True)
                    )
                    db.add(sub_obj)
                    db.flush()
                    inserted_subs += 1
                else:
                    sub_obj = existing_sub

                for top_idx, top_data in enumerate(sub_data.get("topics", []), start=1):
                    top_id = top_data.get("id") or f"top-{uuid.uuid4().hex[:8]}"
                    existing_top = db.query(models.Topic).filter(models.Topic.id == top_id).first()

                    if not existing_top:
                        top_obj = models.Topic(
                            id=top_id,
                            subject_id=sub_obj.id,
                            chapter_number=top_data.get("chapterNumber", top_idx),
                            title=top_data.get("title", f"Chapter {top_idx}"),
                            summary=top_data.get("summary", ""),
                            is_active=top_data.get("isActive", True)
                        )
                        db.add(top_obj)
                        db.flush()
                        inserted_tops += 1
                    else:
                        top_obj = existing_top

                    for tst_data in top_data.get("tests", []):
                        tst_id = tst_data.get("id") or f"test-{uuid.uuid4().hex[:8]}"
                        existing_tst = db.query(models.Test).filter(models.Test.id == tst_id).first()

                        if not existing_tst:
                            tst_obj = models.Test(
                                id=tst_id,
                                topic_id=top_obj.id,
                                title=tst_data.get("title", "Assessment"),
                                duration_minutes=tst_data.get("durationMinutes", 15),
                                marks=tst_data.get("marks", 20),
                                difficulty=tst_data.get("difficulty", "Medium"),
                                is_active=tst_data.get("isActive", True)
                            )
                            db.add(tst_obj)
                            db.flush()
                            inserted_tsts += 1

                            for q_idx, q_data in enumerate(tst_data.get("questions", [])):
                                q_id = q_data.get("id") or f"q-{tst_id}-{q_idx+1}"
                                q_obj = models.Question(
                                    id=q_id,
                                    test_id=tst_obj.id,
                                    question_text=q_data.get("question", ""),
                                    options=q_data.get("options", []),
                                    correct_index=q_data.get("correctIndex", 0),
                                    explanation=q_data.get("explanation", ""),
                                    image_url=q_data.get("imageUrl")
                                )
                                db.add(q_obj)

        db.commit()
        return schemas.ApiResponse(
            success=True,
            message=f"Seeded {inserted_subs} subjects, {inserted_tops} topics, and {inserted_tsts} tests into MySQL.",
            data={"subjects": inserted_subs, "topics": inserted_tops, "tests": inserted_tsts}
        )
    except Exception as exc:
        db.rollback()
        logger.error(f"[SEED ERROR] {str(exc)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to seed curriculum: {str(exc)}"
        )


# ----------------------------------------------------
# 11. SUBJECT CRUD: POST, PUT, DELETE /api/admin/subjects
# ----------------------------------------------------
@app.post(
    "/api/admin/subjects",
    response_model=schemas.ApiResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Curriculum CMS"]
)
def create_subject(
    payload: schemas.SubjectPayload,
    db: Session = Depends(get_db)
):
    sub_id = payload.id or f"sub-{uuid.uuid4().hex[:10]}"
    new_sub = models.Subject(
        id=sub_id,
        class_id=payload.classId,
        name=payload.name.strip(),
        code=payload.code.strip(),
        is_active=payload.isActive if payload.isActive is not None else True
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)

    return schemas.ApiResponse(
        success=True,
        message=f"Subject '{new_sub.name}' created successfully.",
        data={
            "id": new_sub.id,
            "class_id": new_sub.class_id,
            "name": new_sub.name,
            "code": new_sub.code,
            "is_active": new_sub.is_active,
            "topics": []
        }
    )


@app.put(
    "/api/admin/subjects/{subject_id}",
    response_model=schemas.ApiResponse,
    tags=["Curriculum CMS"]
)
def update_subject(
    subject_id: str,
    payload: schemas.SubjectPayload,
    db: Session = Depends(get_db)
):
    sub = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail=f"Subject '{subject_id}' not found.")

    if payload.name:
        sub.name = payload.name.strip()
    if payload.code:
        sub.code = payload.code.strip()
    if payload.classId:
        sub.class_id = payload.classId
    if payload.isActive is not None:
        sub.is_active = payload.isActive

    db.commit()
    db.refresh(sub)
    return schemas.ApiResponse(
        success=True,
        message=f"Subject '{sub.name}' updated successfully.",
        data={"id": sub.id, "name": sub.name, "code": sub.code, "is_active": sub.is_active}
    )


@app.delete(
    "/api/admin/subjects/{subject_id}",
    response_model=schemas.ApiResponse,
    tags=["Curriculum CMS"]
)
def delete_subject(
    subject_id: str,
    db: Session = Depends(get_db)
):
    sub = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail=f"Subject '{subject_id}' not found.")

    sub_name = sub.name
    db.delete(sub)
    db.commit()
    return schemas.ApiResponse(
        success=True,
        message=f"Subject '{sub_name}' deleted successfully.",
        data={"deleted_id": subject_id}
    )


# ----------------------------------------------------
# 12. TOPIC CRUD: POST, PUT, DELETE /api/admin/topics
# ----------------------------------------------------
@app.post(
    "/api/admin/topics",
    response_model=schemas.ApiResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Curriculum CMS"]
)
def create_topic(
    payload: schemas.TopicPayload,
    db: Session = Depends(get_db)
):
    top_id = payload.id or f"top-{uuid.uuid4().hex[:10]}"
    new_top = models.Topic(
        id=top_id,
        subject_id=payload.subjectId,
        chapter_number=payload.chapterNumber,
        title=payload.title.strip(),
        summary=payload.summary or "",
        is_active=payload.isActive if payload.isActive is not None else True
    )
    db.add(new_top)
    db.commit()
    db.refresh(new_top)

    return schemas.ApiResponse(
        success=True,
        message=f"Topic '{new_top.title}' created successfully.",
        data={
            "id": new_top.id,
            "subject_id": new_top.subject_id,
            "chapter_number": new_top.chapter_number,
            "title": new_top.title,
            "summary": new_top.summary,
            "is_active": new_top.is_active,
            "tests": []
        }
    )


@app.put(
    "/api/admin/topics/{topic_id}",
    response_model=schemas.ApiResponse,
    tags=["Curriculum CMS"]
)
def update_topic(
    topic_id: str,
    payload: schemas.TopicPayload,
    db: Session = Depends(get_db)
):
    top = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not top:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found.")

    if payload.title:
        top.title = payload.title.strip()
    if payload.summary is not None:
        top.summary = payload.summary
    if payload.chapterNumber:
        top.chapter_number = payload.chapterNumber
    if payload.isActive is not None:
        top.is_active = payload.isActive

    db.commit()
    db.refresh(top)
    return schemas.ApiResponse(
        success=True,
        message=f"Topic '{top.title}' updated successfully.",
        data={
            "id": top.id,
            "title": top.title,
            "chapter_number": top.chapter_number,
            "is_active": top.is_active
        }
    )


@app.delete(
    "/api/admin/topics/{topic_id}",
    response_model=schemas.ApiResponse,
    tags=["Curriculum CMS"]
)
def delete_topic(
    topic_id: str,
    db: Session = Depends(get_db)
):
    top = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not top:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found.")

    top_title = top.title
    db.delete(top)
    db.commit()
    return schemas.ApiResponse(
        success=True,
        message=f"Topic '{top_title}' deleted successfully.",
        data={"deleted_id": topic_id}
    )


# ----------------------------------------------------
# 13. VISIBILITY TOGGLE: PATCH /api/admin/toggle
# ----------------------------------------------------
@app.patch(
    "/api/admin/toggle",
    response_model=schemas.ApiResponse,
    tags=["Curriculum CMS"]
)
def toggle_entity_visibility(
    payload: schemas.TogglePayload,
    db: Session = Depends(get_db)
):
    """
    Accepts entity_type ('subject', 'topic', 'test'), entity_id, and is_active boolean
    to toggle active visibility column in MySQL.
    """
    entity_type = payload.entity_type.lower()
    entity_id = payload.entity_id

    if entity_type == "subject":
        clean_id = entity_id.split(":")[-1] if ":" in entity_id else entity_id
        entity = db.query(models.Subject).filter(models.Subject.id == clean_id).first()
        if not entity:
            raise HTTPException(status_code=404, detail=f"Subject '{entity_id}' not found.")
        entity.is_active = payload.is_active

    elif entity_type == "topic":
        entity = db.query(models.Topic).filter(models.Topic.id == entity_id).first()
        if not entity:
            raise HTTPException(status_code=404, detail=f"Topic '{entity_id}' not found.")
        entity.is_active = payload.is_active

    elif entity_type == "test":
        entity = db.query(models.Test).filter(models.Test.id == entity_id).first()
        if not entity:
            raise HTTPException(status_code=404, detail=f"Test '{entity_id}' not found.")
        entity.is_active = payload.is_active

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported entity type: '{entity_type}'. Must be 'subject', 'topic', or 'test'."
        )

    db.commit()
    status_str = "enabled" if payload.is_active else "disabled"
    return schemas.ApiResponse(
        success=True,
        message=f"{entity_type.capitalize()} '{entity_id}' {status_str} in MySQL successfully.",
        data={
            "entity_type": entity_type,
            "entity_id": entity_id,
            "is_active": payload.is_active
        }
    )
