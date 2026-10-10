"""
Exam WORLD - FastAPI Backend Service
====================================
Single-page educational platform backend powering 'examworld.site'.

How to Run:
1. Ensure MySQL server is running and database 'examworld' exists:
   CREATE DATABASE IF NOT EXISTS examworld CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

2. Install dependencies:
   pip install fastapi uvicorn sqlalchemy pymysql pydantic

3. Start server:
   uvicorn main:app --reload --host 0.0.0.0 --port 8000

4. Interactive API Docs:
   Swagger UI: http://localhost:8000/docs
   ReDoc:      http://localhost:8000/redoc
"""

import uuid
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

# Local module imports
from database import engine, Base, get_db
import models
import schemas

# ----------------------------------------------------
# 1. DATABASE TABLES INITIALIZATION
# ----------------------------------------------------
# Automatically create all MySQL tables on application startup
Base.metadata.create_all(bind=engine)

# ----------------------------------------------------
# 2. FASTAPI APP INITIALIZATION
# ----------------------------------------------------
app = FastAPI(
    title="Exam WORLD Backend API",
    description="Python FastAPI backend powering exams, dynamic tests, granular stopwatch tracking, and MySQL persistence for examworld.site.",
    version="1.0.0"
)

# ----------------------------------------------------
# 3. CORS CONFIGURATION
# ----------------------------------------------------
# Permissive CORS configured for React / Vite single-page applications
origins = [
    "http://localhost:5173",  # Default Vite dev server port
    "http://localhost:3000",  # Standard React app port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://examworld.site",
    "*"                       # Allow all origins for prototyping/previews
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------
# 4. HEALTH CHECK & ROOT
# ----------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "platform": "Exam WORLD",
        "domain": "examworld.site",
        "status": "Online",
        "docs": "/docs"
    }


@app.get("/api/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Verifies MySQL database connection health."""
    try:
        # Simple test query
        db.execute(models.func.now())
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(exc)}"
        )


# ----------------------------------------------------
# 5. ADMIN TEST BUILDER: POST /api/admin/tests/add
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
    Receives TestPayload from the Admin Test Builder Modal.
    Writes the Test record and loops through all unlimited questions,
    storing the options array (JSON) and Base64-encoded image strings
    safely inside the Question table's LONGTEXT column.
    """
    try:
        # Verify parent topic exists; if not in prototype mode, create a placeholder topic
        topic = db.query(models.Topic).filter(models.Topic.id == payload.topic_id).first()
        if not topic:
            # Prototype resilience: Ensure subject & topic exist if testing against fresh DB
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

        # Generate test ID if not provided
        test_id = payload.id or f"test-{uuid.uuid4().hex[:10]}"

        # Create or update Test entity
        existing_test = db.query(models.Test).filter(models.Test.id == test_id).first()
        if existing_test:
            # Overwrite test settings if updating existing test
            existing_test.title = payload.title
            existing_test.duration_minutes = payload.durationMinutes
            existing_test.marks = payload.marks
            existing_test.difficulty = payload.difficulty or "Medium"
            # Delete old questions to re-insert fresh unlimited questions
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

        # Loop through all questions and write to MySQL
        # Unlimited questions supported with Base64 image string storage
        for idx, q_draft in enumerate(payload.questions):
            question_id = q_draft.id or f"q-{test_id}-{idx + 1}-{uuid.uuid4().hex[:6]}"
            new_question = models.Question(
                id=question_id,
                test_id=test_id,
                question_text=q_draft.question,
                options=q_draft.options,
                correct_index=q_draft.correctIndex,
                explanation=q_draft.explanation or "",
                image_url=q_draft.imageUrl  # Stored into LONGTEXT column (up to 4GB Base64)
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


# ----------------------------------------------------
# 6. STUDENT TEST ENGINE: POST /api/student/tests/submit
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
    Receives TestAttemptPayload from student test completion.
    Saves the student's test score, percentage, total time taken,
    and granular time-per-question stopwatch array into the TestAttempt table.
    """
    try:
        # Ensure student user exists in database
        user = db.query(models.User).filter(models.User.id == payload.user_id).first()
        if not user:
            # Auto-provision learner profile if first test submission
            user = models.User(
                id=payload.user_id,
                role="student",
                name="Student Learner",
                mobile=f"98765{uuid.uuid4().hex[:5]}",
                current_class="10"
            )
            db.add(user)
            db.flush()

        # Generate attempt ID
        attempt_id = payload.id or f"attempt-{uuid.uuid4().hex[:12]}"

        # Create TestAttempt record
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
# 7. CURRICULUM TREE: GET /api/curriculum
# ----------------------------------------------------
@app.get(
    "/api/curriculum",
    response_model=List[schemas.CurriculumSubjectItem],
    tags=["Curriculum"]
)
def get_curriculum(db: Session = Depends(get_db)):
    """
    Fetches all active Subjects, Topics, and Tests (with Questions)
    in a clean hierarchical tree to populate the React frontend.
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

    # Format into response schema
    curriculum_result = []
    for sub in subjects:
        sub_dict = {
            "id": sub.id,
            "class_id": sub.class_id,
            "name": sub.name,
            "code": sub.code,
            "is_active": sub.is_active,
            "topics": []
        }
        for top in sub.topics:
            top_dict = {
                "id": top.id,
                "chapter_number": top.chapter_number,
                "title": top.title,
                "summary": top.summary,
                "tests": []
            }
            for tst in top.tests:
                tst_dict = {
                    "id": tst.id,
                    "title": tst.title,
                    "duration_minutes": tst.duration_minutes,
                    "marks": tst.marks,
                    "difficulty": tst.difficulty,
                    "questions_count": len(tst.questions),
                    "questions": [
                        {
                            "id": q.id,
                            "question_text": q.question_text,
                            "options": q.options,
                            "correct_index": q.correct_index,
                            "explanation": q.explanation,
                            "image_url": q.image_url  # Returns Base64 string to frontend
                        }
                        for q in tst.questions
                    ]
                }
                top_dict["tests"].append(tst_dict)
            sub_dict["topics"].append(top_dict)
        curriculum_result.append(sub_dict)

    return curriculum_result
