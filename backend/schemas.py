from typing import List, Optional, Any
from pydantic import BaseModel, Field


# ==========================================
# QUESTION SCHEMAS
# ==========================================

class QuestionPayload(BaseModel):
    """
    Matches frontend React Question Draft schema.
    Supports questions with Base64 image strings.
    """
    id: Optional[str] = None
    question: str = Field(..., description="Question statement or problem prompt")
    options: List[str] = Field(..., min_length=2, description="List of choices [A, B, C, D]")
    correctIndex: int = Field(default=0, ge=0, le=3, description="0-indexed correct option")
    explanation: Optional[str] = Field(default="", description="Detailed step-by-step reasoning or grammar rule")
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
    """
    Matches frontend React Test Builder Modal schema when saving custom tests.
    """
    id: Optional[str] = None
    topic_id: str = Field(..., description="ID of the parent Topic / Chapter")
    title: str = Field(..., min_length=1, description="Test Title / Name")
    durationMinutes: int = Field(default=15, ge=1, description="Custom countdown timer in minutes")
    marks: int = Field(default=20, ge=1, description="Total maximum score")
    difficulty: Optional[str] = Field(default="Medium", description="Easy, Medium, or Hard")
    questions: List[QuestionPayload] = Field(..., min_length=1, description="Unlimited array of questions")

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
    """
    Matches student test attempt payload after test submission,
    including granular stopwatch tracking per individual question.
    """
    id: Optional[str] = None
    user_id: str = Field(..., description="ID of student who took the test")
    test_id: str = Field(..., description="ID of the submitted test")
    score: int = Field(..., ge=0, description="Marks earned by the student")
    totalMarks: Optional[int] = Field(default=20, description="Total maximum marks for the test")
    percentage: int = Field(..., ge=0, le=100, description="Overall accuracy percentage")
    totalTimeSpentSeconds: int = Field(..., ge=0, description="Total time taken across all questions in seconds")
    timeSpentPerQuestion: Optional[List[int]] = Field(
        default=[],
        description="Array of seconds spent on question 0, 1, 2, ... for granular topper comparison"
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
    questions_count: int
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


class CurriculumTopicItem(BaseModel):
    id: str
    chapter_number: int
    title: str
    summary: Optional[str] = None
    tests: List[CurriculumTestItem] = []

    class Config:
        from_attributes = True


class CurriculumSubjectItem(BaseModel):
    id: str
    class_id: str
    name: str
    code: str
    is_active: bool
    topics: List[CurriculumTopicItem] = []

    class Config:
        from_attributes = True


# ==========================================
# GENERIC API RESPONSE SCHEMAS
# ==========================================

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
