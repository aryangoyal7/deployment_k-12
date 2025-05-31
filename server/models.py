from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class LessonMetadata(BaseModel):
    subject: str
    grade_level: str
    topic: str
    subtopics: List[str]
    learning_objectives: List[str] = Field(default_factory=list)
    standards_alignment: List[str] = Field(default_factory=list)
    difficulty_level: str = "intermediate"
    estimated_duration: str = "45 minutes"
    prerequisites: List[str] = Field(default_factory=list)
    target_skills: List[str] = Field(default_factory=list)

class LessonComponent(BaseModel):
    component_type: str
    content: str
    order: int
    metadata: Dict[str, Any] = Field(default_factory=dict)

class LessonRequest(BaseModel):
    subject: str
    grade_level: str
    topic: str
    subtopics: List[str]
    difficulty_level: str = "intermediate"
    estimated_duration: str = "45 minutes"
    curriculum_document_ids: List[int] = Field(default_factory=list)

class LessonResponse(BaseModel):
    id: int
    title: str
    metadata: LessonMetadata
    components: List[LessonComponent]
    quality_score: Optional[float] = None
    feedback: List[str] = Field(default_factory=list)
    version: str = "1.0"
    created_at: datetime

class GenerationProgress(BaseModel):
    session_id: int
    progress: int = Field(ge=0, le=100)
    current_agent: str
    status: str  # pending, in_progress, completed, failed
    message: Optional[str] = None
    error: Optional[str] = None

class FileUploadResponse(BaseModel):
    id: int
    filename: str
    original_name: str
    size: int
    uploaded_at: datetime
