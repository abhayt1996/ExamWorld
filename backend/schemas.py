from typing import List, Optional, Any
from pydantic import BaseModel, Field


# ==========================================
# AUTHENTICATION SCHEMAS
# ==========================================

class LoginRequest(BaseModel):
    """Payload submitted by student to authenticate."""
    username: str = Field(..., min_length=3, max_length=60, description="Student username")
    password: str = Field(..., min_length=4, max_length=128, description="Student password")


class UserResponse(BaseModel):
    """User profile data returned upon successful authentication."""
    id: str
    name: str
    username: str
    role: str = "student"
    current_class: str = "10"
    created_at: Optional[Any] = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Response returned after successful student login."""
    success: bool
    message: str
    token: str
    user: UserResponse


# ==========================================
# ADMIN STUDENT MANAGEMENT SCHEMAS
# ==========================================

class StudentCreateRequest(BaseModel):
    """Payload for Admin manually creating a new student."""
    name: str = Field(..., min_length=1, max_length=120, description="Student display name")
    username: str = Field(..., min_length=3, max_length=60, description="Unique username")
    mobile: Optional[str] = Field(default=None, max_length=20, description="Student mobile phone number")
    current_class: str = Field(default="10", description="Enrolled Class/Grade (6-12)")
    password: str = Field(..., min_length=4, max_length=128, description="Plain text initial password to be hashed")


class StudentUpdateRequest(BaseModel):
    """Payload for Admin updating an existing student."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    username: Optional[str] = Field(default=None, min_length=3, max_length=60)
    mobile: Optional[str] = Field(default=None, max_length=20)
    current_class: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None, min_length=4, max_length=128, description="Optional new password to reset")


class StudentResponse(BaseModel):
    """Student record returned to Admin Dashboard."""
    id: str
    name: str
    username: str
    mobile: Optional[str] = None
    role: str = "student"
    current_class: str = "10"
    created_at: Optional[Any] = None
    tests_count: Optional[int] = 0
    average_score: Optional[int] = 0

    class Config:
        from_attributes = True


# ==========================================
# QUESTION SCHEMAS
# ==========================================

class QuestionPayload(BaseModel):
    id: Optional[str] = None
    question: str = Field(..., description="Question statement or problem prompt")
    options: List[str] = Field(..., min_length=2, description="List of choices [A, B, C, D]")
    correctIndex: int = Field(default=0, ge=0, le=3, description="0-indexed correct option")
    explanation: Optional[str] = Field(default="", description="Detailed step-by-step reasoning or rule")
    imageUrl: Optional[str] = Field(default=None, description="Base64 Data URL or remote image URL")

    class Config:
        populate_by_name = True


class QuestionResponse(BaseModel):
    id: str
    question_text: str
    options: List[str]
    correct_index: int
    explanation: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


# ==========================================
# TEST SCHEMAS
# ==========================================

class TestPayload(BaseModel):
    id: Optional[str] = None
    topic_id: str = Field(..., description="ID of the parent Topic / Chapter")
    title: str = Field(..., min_length=1, description="Test Title / Name")
    durationMinutes: int = Field(default=15, ge=1, description="Custom countdown timer in minutes")
    marks: int = Field(default=20, ge=1, description="Total maximum score")
    difficulty: Optional[str] = Field(default="Medium", description="Easy, Medium, or Hard")
    questions: List[QuestionPayload] = Field(..., min_length=1, description="Array of test questions")

    class Config:
        populate_by_name = True


class TestResponse(BaseModel):
    id: str
    topic_id: str
    title: str
    duration_minutes: int
    marks: int
    difficulty: str
    questions_count: int
    questions: Optional[List[QuestionResponse]] = []

    class Config:
        from_attributes = True


# ==========================================
# TEST ATTEMPT / SUBMISSION SCHEMAS
# ==========================================

class TestAttemptPayload(BaseModel):
    id: Optional[str] = None
    user_id: str = Field(..., description="ID of student who took the test")
    test_id: str = Field(..., description="ID of the submitted test")
    score: int = Field(..., ge=0, description="Marks earned by the student")
    totalMarks: Optional[int] = Field(default=20, description="Total maximum marks for the test")
    percentage: int = Field(..., ge=0, le=100, description="Overall accuracy percentage")
    totalTimeSpentSeconds: int = Field(..., ge=0, description="Total time taken across all questions in seconds")
    timeSpentPerQuestion: Optional[List[int]] = Field(
        default=[],
        description="Array of seconds spent on question 0, 1, 2, ... for stopwatch comparison"
    )

    class Config:
        populate_by_name = True


class TestAttemptResponse(BaseModel):
    id: str
    user_id: str
    test_id: str
    score: int
    percentage: int
    total_time_spent_seconds: int
    time_spent_per_question: Optional[List[int]] = []

    class Config:
        from_attributes = True


# ==========================================
# CURRICULUM TREE SCHEMAS
# ==========================================

class CurriculumTestItem(BaseModel):
    id: str
    title: str
    duration_minutes: int
    marks: int
    difficulty: str
    is_active: bool = True
    questions_count: int
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


class CurriculumTopicItem(BaseModel):
    id: str
    chapter_number: int
    title: str
    summary: Optional[str] = None
    is_active: bool = True
    tests: List[CurriculumTestItem] = []

    class Config:
        from_attributes = True


class CurriculumSubjectItem(BaseModel):
    id: str
    class_id: str
    name: str
    code: str
    is_active: bool
    category: Optional[str] = "core"
    stream: Optional[str] = "General"
    topics: List[CurriculumTopicItem] = []

    class Config:
        from_attributes = True


# ==========================================
# LEADERBOARD & ANALYTICS SCHEMAS
# ==========================================

class LeaderboardEntry(BaseModel):
    id: str
    name: str
    username: Optional[str] = None
    className: str
    totalScore: int
    totalTimeSpentSeconds: int
    testsCompleted: int
    avatarColor: str = "bg-emerald-600"
    rank: Optional[int] = None
    isCurrentUser: bool = False

    class Config:
        populate_by_name = True
        from_attributes = True


class RecentActivityItem(BaseModel):
    id: str
    userName: str
    action: str = "test_completed"  # 'test_completed' | 'test_started'
    testName: Optional[str] = None
    className: str = "10"
    timestamp: int
    activeNow: bool = True
    score: Optional[int] = None
    timeSpentSeconds: Optional[int] = None

    class Config:
        populate_by_name = True
        from_attributes = True


class AdminAnalyticsResponse(BaseModel):
    activeUsers: int
    activeTestSessions: int = 0
    completedTestsToday: int
    recentActivities: List[RecentActivityItem] = []


# ==========================================
# CURRICULUM CRUD & TOGGLE SCHEMAS
# ==========================================

class SubjectPayload(BaseModel):
    id: Optional[str] = None
    classId: str = Field(..., alias="classId")
    name: str = Field(..., min_length=1)
    code: str = Field(..., min_length=1)
    isActive: Optional[bool] = Field(default=True, alias="isActive")
    category: Optional[str] = "core"
    stream: Optional[str] = "General"

    class Config:
        populate_by_name = True


class TopicPayload(BaseModel):
    id: Optional[str] = None
    subjectId: str = Field(..., alias="subjectId")
    chapterNumber: int = Field(default=1, alias="chapterNumber")
    title: str = Field(..., min_length=1)
    summary: Optional[str] = None
    isActive: Optional[bool] = Field(default=True, alias="isActive")

    class Config:
        populate_by_name = True


class TogglePayload(BaseModel):
    entity_type: str = Field(..., description="Entity type: 'subject', 'topic', 'test', or 'grade'")
    entity_id: str = Field(..., description="ID of the entity to toggle")
    is_active: bool = Field(..., description="Target active state boolean")


# ==========================================
# GENERIC API RESPONSE SCHEMAS
# ==========================================

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None