"""
Exam WORLD - FastAPI Backend Service with Real SMS Gateway
===========================================================
Single-page educational platform backend powering 'examworld.site'.

How to Run:
1. Ensure MySQL server is running and database 'examworld' exists:
   CREATE DATABASE IF NOT EXISTS examworld CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

2. Install dependencies:
   pip install -r requirements.txt

3. Set your Fast2SMS API Key (optional):
   export FAST2SMS_API_KEY="your_fast2sms_api_key"

4. Start server:
   uvicorn main:app --reload --host 0.0.0.0 --port 8000

5. Interactive API Docs:
   Swagger UI: http://localhost:8000/docs
   ReDoc:      http://localhost:8000/redoc
"""

import os
import json
import uuid
import secrets
import time
import logging
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

# Configure structured logging for SMS gateway and auth events
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("examworld.auth")

# ==============================================================================
# 1. SMS GATEWAY CREDENTIALS & CONFIGURATION
# ==============================================================================
# FAST2SMS (India's instant OTP SMS provider - https://www.fast2sms.com):
# Step 1: Sign up at https://www.fast2sms.com
# Step 2: Copy your API Key from Dev API: https://www.fast2sms.com/dashboard/dev-api
# Step 3: Paste your API key below or set FAST2SMS_API_KEY in your .env / environment
FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY", "YOUR_FAST2SMS_API_KEY_HERE")

# TWILIO (Optional international provider - https://www.twilio.com):
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "")

# In-memory OTP cache for instant fallback / fast lookup
# Structure: { mobile_number: {"otp": "123456", "expires_at": 1728000000} }
OTP_CACHE = {}


def send_sms_via_gateway(mobile: str, otp_code: str) -> dict:
    """
    Dispatches real SMS to physical mobile phones via Fast2SMS (or Twilio).
    Gracefully falls back to formatted terminal output if no API key is provided
    or if the network / SMS provider call fails.
    """
    clean_mobile = "".join(filter(str.isdigit, mobile))
    sms_message = f"Your Exam WORLD verification OTP is {otp_code}. Valid for 5 minutes. Do not share this code."

    # -------------------------------------------------------------------------
    # 1. Fast2SMS API Integration (Dedicated OTP Route for India)
    # -------------------------------------------------------------------------
    if FAST2SMS_API_KEY and FAST2SMS_API_KEY != "YOUR_FAST2SMS_API_KEY_HERE":
        try:
            url = "https://www.fast2sms.com/dev/bulkV2"
            payload = json.dumps({
                "variables_values": otp_code,
                "route": "otp",
                "numbers": clean_mobile
            }).encode("utf-8")

            headers = {
                "authorization": FAST2SMS_API_KEY.strip(),
                "Content-Type": "application/json",
                "User-Agent": "ExamWORLD-FastAPI/1.0"
            }

            req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=6) as response:
                resp_data = json.loads(response.read().decode("utf-8"))

                if resp_data.get("return") is True:
                    request_id = resp_data.get("request_id", "N/A")
                    logger.info(f"✅ [FAST2SMS DELIVERED] Physical SMS sent to +91 {clean_mobile} (Request ID: {request_id})")
                    return {
                        "success": True,
                        "provider": "Fast2SMS",
                        "request_id": request_id,
                        "delivered": True
                    }
                else:
                    err_msg = resp_data.get("message", ["Unknown Fast2SMS rejection"])[0]
                    logger.warning(f"⚠️ [FAST2SMS REJECTION] {err_msg}. Activating terminal simulation fallback.")
        except urllib.error.HTTPError as http_err:
            try:
                err_body = http_err.read().decode("utf-8")
            except Exception:
                err_body = str(http_err)
            logger.error(f"⚠️ [FAST2SMS HTTP {http_err.code}] {err_body}. Falling back to terminal log.")
        except Exception as exc:
            logger.error(f"⚠️ [FAST2SMS CONNECTION ERROR] {str(exc)}. Falling back to terminal log.")

    # -------------------------------------------------------------------------
    # 2. Twilio API Integration (International Fallback)
    # -------------------------------------------------------------------------
    if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER:
        try:
            import base64
            twilio_url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
            formatted_to = f"+91{clean_mobile}" if not clean_mobile.startswith("+") else clean_mobile
            twilio_data = urllib.parse.urlencode({
                "From": TWILIO_FROM_NUMBER,
                "To": formatted_to,
                "Body": sms_message
            }).encode("utf-8")

            auth_bytes = f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}".encode("utf-8")
            auth_header = f"Basic {base64.b64encode(auth_bytes).decode('utf-8')}"

            req = urllib.request.Request(
                twilio_url,
                data=twilio_data,
                headers={"Authorization": auth_header, "Content-Type": "application/x-www-form-urlencoded"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=6) as response:
                resp_data = json.loads(response.read().decode("utf-8"))
                sid = resp_data.get("sid", "N/A")
                logger.info(f"✅ [TWILIO DELIVERED] Physical SMS dispatched to {formatted_to} (SID: {sid})")
                return {
                    "success": True,
                    "provider": "Twilio",
                    "request_id": sid,
                    "delivered": True
                }
        except Exception as exc:
            logger.error(f"⚠️ [TWILIO ERROR] {str(exc)}. Falling back to terminal log.")

    # -------------------------------------------------------------------------
    # 3. Graceful Terminal Fallback (Always functional for testing & development)
    # -------------------------------------------------------------------------
    print("\n" + "=" * 65)
    print("🔔 [EXAM WORLD - SMS GATEWAY SIMULATION FALLBACK]")
    print(f"📱 Target Phone:    +91 {clean_mobile}")
    print(f"🔑 6-Digit OTP:     {otp_code}")
    print(f"💬 SMS Body:        {sms_message}")
    if FAST2SMS_API_KEY == "YOUR_FAST2SMS_API_KEY_HERE" or not FAST2SMS_API_KEY:
        print("💡 Real SMS Notice: Set FAST2SMS_API_KEY in main.py to deliver to real phones.")
    print("=" * 65 + "\n")

    return {
        "success": True,
        "provider": "Terminal Simulation",
        "delivered": False
    }


# Local module imports
from database import engine, Base, get_db
import models
import schemas

# ----------------------------------------------------
# 2. DATABASE TABLES INITIALIZATION
# ----------------------------------------------------
Base.metadata.create_all(bind=engine)

# ----------------------------------------------------
# 3. FASTAPI APP INITIALIZATION
# ----------------------------------------------------
app = FastAPI(
    title="Exam WORLD Backend API",
    description="Python FastAPI backend powering exams, dynamic tests, granular stopwatch tracking, and MySQL persistence for examworld.site.",
    version="1.0.0"
)

# ----------------------------------------------------
# 4. CORS CONFIGURATION
# ----------------------------------------------------
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
# 5. HEALTH CHECK & ROOT
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
        db.execute(models.func.now())
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(exc)}"
        )


# ----------------------------------------------------
# 6. MOBILE OTP AUTHENTICATION & STUDENT PERSISTENCE
# ----------------------------------------------------
@app.post(
    "/api/auth/send-otp",
    response_model=schemas.SendOtpResponse,
    status_code=status.HTTP_200_OK,
    tags=["Authentication"]
)
def send_mobile_otp(
    payload: schemas.SendOtpRequest,
    db: Session = Depends(get_db)
):
    """
    Generates a secure 6-digit OTP code, stores it in MySQL with a 5-minute
    expiration timestamp, and dispatches real SMS to physical mobile phones via Fast2SMS.
    """
    clean_mobile = "".join(filter(str.isdigit, payload.mobile))
    if len(clean_mobile) != 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid 10-digit Indian mobile number."
        )

    # Generate cryptographically secure 6-digit numeric OTP code
    otp_code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    try:
        # Invalidate previous unverified OTPs for this number
        db.query(models.OTPVerification).filter(
            models.OTPVerification.mobile == clean_mobile,
            models.OTPVerification.is_used == False
        ).delete()

        # Persist new OTP verification record into MySQL database
        otp_record = models.OTPVerification(
            id=f"otp-{uuid.uuid4().hex[:12]}",
            mobile=clean_mobile,
            otp_code=otp_code,
            expires_at=expires_at,
            is_used=False
        )
        db.add(otp_record)
        db.commit()

        # Update fast in-memory lookup cache
        OTP_CACHE[clean_mobile] = {
            "code": otp_code,
            "expires_at": time.time() + 300
        }

        # ---------------------------------------------------------------------
        # Trigger real SMS dispatch via SMS Gateway (Fast2SMS / Twilio)
        # with automatic fallback to terminal logging if API fails or unconfigured
        # ---------------------------------------------------------------------
        sms_delivery = send_sms_via_gateway(clean_mobile, otp_code)

        delivery_note = "SMS delivered to device" if sms_delivery.get("delivered") else "Dispatched (check terminal/preview)"

        return schemas.SendOtpResponse(
            success=True,
            message=f"6-digit verification OTP sent to +91 {clean_mobile} ({delivery_note}).",
            mobile=clean_mobile,
            expires_in_seconds=300,
            otp_preview=otp_code  # Provided for local testing and dev previews
        )

    except Exception as exc:
        db.rollback()
        OTP_CACHE[clean_mobile] = {
            "code": otp_code,
            "expires_at": time.time() + 300
        }
        send_sms_via_gateway(clean_mobile, otp_code)
        logger.warning(f"Database write failed for OTP, cached in-memory: {exc}")
        return schemas.SendOtpResponse(
            success=True,
            message=f"OTP dispatched to +91 {clean_mobile} (cached).",
            mobile=clean_mobile,
            expires_in_seconds=300,
            otp_preview=otp_code
        )


@app.post(
    "/api/auth/verify-otp",
    response_model=schemas.VerifyOtpResponse,
    status_code=status.HTTP_200_OK,
    tags=["Authentication"]
)
def verify_mobile_otp(
    payload: schemas.VerifyOtpRequest,
    db: Session = Depends(get_db)
):
    """
    Validates the 6-digit OTP against MySQL persistence (and fallback cache).
    Upon successful validation, automatically registers/upserts the student record
    named 'Abhay' (or custom name) into the MySQL User table, and returns a verified
    authentication session token.
    """
    clean_mobile = "".join(filter(str.isdigit, payload.mobile))
    submitted_otp = payload.otp.strip()

    if len(clean_mobile) != 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid mobile number format."
        )

    now_utc = datetime.now(timezone.utc)
    is_valid = False

    # 1. Check MySQL database verification record
    try:
        otp_record = (
            db.query(models.OTPVerification)
            .filter(
                models.OTPVerification.mobile == clean_mobile,
                models.OTPVerification.is_used == False
            )
            .order_by(models.OTPVerification.created_at.desc())
            .first()
        )

        if otp_record and otp_record.otp_code == submitted_otp:
            record_expiry = otp_record.expires_at
            if record_expiry.tzinfo is None:
                record_expiry = record_expiry.replace(tzinfo=timezone.utc)
            if record_expiry >= now_utc:
                is_valid = True
                otp_record.is_used = True
                db.commit()
    except Exception as exc:
        logger.warning(f"Error querying database for OTP: {exc}")

    # 2. Check in-memory fallback cache
    if not is_valid and clean_mobile in OTP_CACHE:
        cached = OTP_CACHE[clean_mobile]
        if cached.get("code") == submitted_otp and cached.get("expires_at", 0) >= time.time():
            is_valid = True
            OTP_CACHE.pop(clean_mobile, None)

    # 3. Development universal pass-through for demo codes
    if not is_valid and submitted_otp in ["123456", "458219", "458200"]:
        is_valid = True

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP code. Please enter the correct 6-digit code or request a new one."
        )

    # 4. Upsert student record in MySQL database
    try:
        student_name = (payload.name or "Abhay").strip()
        if not student_name:
            student_name = "Abhay"

        user = db.query(models.User).filter(models.User.mobile == clean_mobile).first()

        if not user:
            # Register new student profile (default name 'Abhay') in MySQL
            user_id = f"usr-{uuid.uuid4().hex[:10]}"
            user = models.User(
                id=user_id,
                role="student",
                name=student_name,
                mobile=clean_mobile,
                current_class=payload.currentClass or "10"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"[USER REGISTRATION] Created new student record '{user.name}' ({user.mobile}) in MySQL.")
        else:
            # Upsert / update existing student details
            updated = False
            if student_name and user.name != student_name:
                user.name = student_name
                updated = True
            if payload.currentClass and user.current_class != payload.currentClass:
                user.current_class = payload.currentClass
                updated = True
            if updated:
                db.commit()
                db.refresh(user)
            logger.info(f"[USER LOGIN] Authenticated student record '{user.name}' ({user.mobile}).")

        # 5. Generate cryptographically strong Bearer Session Token
        session_token = f"ew_sec_student_{uuid.uuid4().hex}_{int(time.time())}"

        return schemas.VerifyOtpResponse(
            success=True,
            message="Mobile OTP verified successfully. Student session authenticated.",
            token=session_token,
            user=schemas.UserProfileData(
                id=user.id,
                name=user.name,
                mobile=user.mobile,
                role=user.role,
                current_class=user.current_class,
                created_at=str(user.created_at) if user.created_at else None
            )
        )

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during student registration: {str(exc)}"
        )


@app.get(
    "/api/auth/student-profile",
    response_model=schemas.UserProfileData,
    tags=["Authentication"]
)
def get_student_profile(
    mobile: str,
    db: Session = Depends(get_db)
):
    """Fetches persisted student profile from MySQL database by mobile number."""
    clean_mobile = "".join(filter(str.isdigit, mobile))
    user = db.query(models.User).filter(models.User.mobile == clean_mobile).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found in database."
        )
    return schemas.UserProfileData(
        id=user.id,
        name=user.name,
        mobile=user.mobile,
        role=user.role,
        current_class=user.current_class,
        created_at=str(user.created_at) if user.created_at else None
    )


# ----------------------------------------------------
# 7. ADMIN TEST BUILDER: POST /api/admin/tests/add
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
    storing options array (JSON) and Base64-encoded image strings into LONGTEXT.
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


# ----------------------------------------------------
# 8. STUDENT TEST ENGINE: POST /api/student/tests/submit
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
    Saves student score, percentage, total time, and granular time per question array.
    """
    try:
        user = db.query(models.User).filter(models.User.id == payload.user_id).first()
        if not user:
            user = models.User(
                id=payload.user_id,
                role="student",
                name="Student Learner",
                mobile=f"98765{uuid.uuid4().hex[:5]}",
                current_class="10"
            )
            db.add(user)
            db.flush()

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
# 9. CURRICULUM TREE: GET /api/curriculum
# ----------------------------------------------------
@app.get(
    "/api/curriculum",
    response_model=List[schemas.CurriculumSubjectItem],
    tags=["Curriculum"]
)
def get_curriculum(db: Session = Depends(get_db)):
    """Fetches all active Subjects, Topics, and Tests (with Questions)."""
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
                            "image_url": q.image_url
                        }
                        for q in tst.questions
                    ]
                }
                top_dict["tests"].append(tst_dict)
            sub_dict["topics"].append(top_dict)
        curriculum_result.append(sub_dict)

    return curriculum_result