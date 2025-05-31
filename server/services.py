import asyncio
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import os
from .agents import CurriculumExpertAgent, ContentCreatorAgent, AssessmentAgent, QualityReviewAgent
from .models import LessonRequest, LessonResponse, LessonMetadata, LessonComponent, GenerationProgress

logger = logging.getLogger(__name__)

class LessonGenerationService:
    """Service that orchestrates the multi-agent lesson generation workflow."""
    
    def __init__(self, openai_api_key: str):
        """Initialize the lesson generation service with OpenAI API key."""
        self.openai_api_key = openai_api_key
        self.curriculum_agent = CurriculumExpertAgent(openai_api_key)
        self.content_agent = ContentCreatorAgent(openai_api_key)
        self.assessment_agent = AssessmentAgent(openai_api_key)
        self.quality_agent = QualityReviewAgent(openai_api_key)
        
        # Progress tracking
        self.current_session_id = None
        self.progress_callback = None
    
    def set_progress_callback(self, callback):
        """Set callback function for progress updates."""
        self.progress_callback = callback
    
    async def _update_progress(self, session_id: int, progress: int, current_agent: str, message: str = "", status: str = "in_progress"):
        """Update generation progress."""
        if self.progress_callback:
            progress_data = GenerationProgress(
                session_id=session_id,
                progress=progress,
                current_agent=current_agent,
                status=status,
                message=message
            )
            await self.progress_callback(progress_data)
    
    async def generate_lesson(self, request: LessonRequest, session_id: int) -> LessonResponse:
        """Generate a complete lesson using the multi-agent workflow."""
        try:
            self.current_session_id = session_id
            
            # Step 1: Curriculum Analysis (0-25%)
            await self._update_progress(session_id, 5, "CurriculumExpert", "Starting curriculum analysis...")
            
            curriculum_input = {
                "subject": request.subject,
                "grade_level": request.grade_level,
                "topic": request.topic,
                "subtopics": request.subtopics,
                "difficulty_level": request.difficulty_level
            }
            
            curriculum_analysis = await self.curriculum_agent.process(curriculum_input)
            await self._update_progress(session_id, 25, "CurriculumExpert", "Curriculum analysis completed")
            
            # Step 2: Content Generation (25-60%)
            await self._update_progress(session_id, 30, "ContentCreator", "Generating lesson content...")
            
            content_input = {
                **curriculum_input,
                "curriculum_analysis": curriculum_analysis,
                "learning_objectives": curriculum_analysis.get("learning_objectives", [])
            }
            
            lesson_content = await self.content_agent.process(content_input)
            await self._update_progress(session_id, 60, "ContentCreator", "Lesson content generated")
            
            # Step 3: Assessment Creation (60-80%)
            await self._update_progress(session_id, 65, "AssessmentAgent", "Creating assessments...")
            
            assessment_input = {
                **curriculum_input,
                "learning_objectives": curriculum_analysis.get("learning_objectives", [])
            }
            
            assessments = await self.assessment_agent.process(assessment_input)
            await self._update_progress(session_id, 80, "AssessmentAgent", "Assessments created")
            
            # Step 4: Compile Lesson Components
            await self._update_progress(session_id, 85, "LessonCompiler", "Compiling lesson components...")
            
            components = self._compile_lesson_components(lesson_content, assessments)
            
            # Step 5: Quality Review (80-95%)
            await self._update_progress(session_id, 90, "QualityReviewAgent", "Reviewing lesson quality...")
            
            lesson_data = {
                "subject": request.subject,
                "grade_level": request.grade_level,
                "topic": request.topic,
                "subtopics": request.subtopics,
                "curriculum_analysis": curriculum_analysis,
                "lesson_content": lesson_content,
                "assessments": assessments,
                "components": components
            }
            
            quality_review = await self.quality_agent.process(lesson_data)
            await self._update_progress(session_id, 95, "QualityReviewAgent", "Quality review completed")
            
            # Step 6: Final Assembly
            await self._update_progress(session_id, 98, "LessonAssembler", "Finalizing lesson...")
            
            # Create lesson metadata
            metadata = LessonMetadata(
                subject=request.subject,
                grade_level=request.grade_level,
                topic=request.topic,
                subtopics=request.subtopics,
                learning_objectives=curriculum_analysis.get("learning_objectives", []),
                standards_alignment=curriculum_analysis.get("standards_alignment", []),
                difficulty_level=request.difficulty_level,
                estimated_duration=request.estimated_duration,
                prerequisites=curriculum_analysis.get("prerequisites", []),
                target_skills=curriculum_analysis.get("target_skills", [])
            )
            
            # Generate lesson title
            title = f"{request.topic} - {request.subject} Lesson"
            
            # Create final lesson response
            lesson_response = LessonResponse(
                id=0,  # Will be set by storage layer
                title=title,
                metadata=metadata,
                components=components,
                quality_score=quality_review.get("overall_score"),
                feedback=quality_review.get("recommendations", []),
                version="1.0",
                created_at=datetime.now()
            )
            
            await self._update_progress(session_id, 100, "Complete", "Lesson generation completed successfully", "completed")
            
            return lesson_response
            
        except Exception as e:
            logger.error(f"Lesson generation failed: {str(e)}")
            if self.progress_callback:
                await self._update_progress(session_id, 0, "Error", f"Generation failed: {str(e)}", "failed")
            raise
    
    def _compile_lesson_components(self, lesson_content: Dict[str, Any], assessments: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Compile lesson content and assessments into structured components."""
        components = []
        order = 1
        
        # Introduction component
        if "introduction" in lesson_content:
            intro = lesson_content["introduction"]
            components.append({
                "component_type": "Introduction",
                "content": intro.get("content", ""),
                "order": order,
                "metadata": {
                    "duration": intro.get("duration", "10 minutes"),
                    "teaching_strategies": intro.get("teaching_strategies", [])
                }
            })
            order += 1
        
        # Main content component
        if "main_content" in lesson_content:
            main = lesson_content["main_content"]
            components.append({
                "component_type": "Main Content",
                "content": main.get("content", ""),
                "order": order,
                "metadata": {
                    "duration": main.get("duration", "25 minutes"),
                    "examples": main.get("examples", []),
                    "key_concepts": main.get("key_concepts", [])
                }
            })
            order += 1
        
        # Activities component
        if "activities" in lesson_content:
            activities = lesson_content["activities"]
            components.append({
                "component_type": "Interactive Activities",
                "content": activities.get("content", ""),
                "order": order,
                "metadata": {
                    "duration": activities.get("duration", "15 minutes"),
                    "materials_needed": activities.get("materials_needed", []),
                    "instructions": activities.get("instructions", [])
                }
            })
            order += 1
        
        # Assessment component
        if "formative_assessments" in assessments and assessments["formative_assessments"]:
            assessment_content = "Formative Assessments:\n"
            for assessment in assessments["formative_assessments"]:
                assessment_content += f"\n{assessment.get('type', 'Assessment')}: {assessment.get('description', '')}\n"
                for question in assessment.get('questions', []):
                    assessment_content += f"- {question}\n"
            
            components.append({
                "component_type": "Formative Assessment",
                "content": assessment_content,
                "order": order,
                "metadata": {
                    "assessment_type": "formative",
                    "assessments": assessments["formative_assessments"]
                }
            })
            order += 1
        
        # Wrap-up component
        if "wrap_up" in lesson_content:
            wrap_up = lesson_content["wrap_up"]
            components.append({
                "component_type": "Conclusion",
                "content": wrap_up.get("content", ""),
                "order": order,
                "metadata": {
                    "duration": wrap_up.get("duration", "5 minutes"),
                    "key_takeaways": wrap_up.get("key_takeaways", [])
                }
            })
            order += 1
        
        return components


class FileProcessingService:
    """Service for processing uploaded curriculum documents."""
    
    def __init__(self, upload_directory: str = "uploads"):
        """Initialize the file processing service."""
        self.upload_directory = upload_directory
        os.makedirs(upload_directory, exist_ok=True)
    
    async def save_uploaded_file(self, file_content: bytes, filename: str) -> str:
        """Save uploaded file and return the file path."""
        file_path = os.path.join(self.upload_directory, filename)
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        return file_path
    
    async def process_pdf_document(self, file_path: str) -> Dict[str, Any]:
        """Process PDF document and extract text content."""
        try:
            # This would use PyPDF2 or similar library to extract text
            # For now, return a placeholder
            return {
                "extracted_text": "PDF content would be extracted here",
                "page_count": 1,
                "processing_status": "success"
            }
        except Exception as e:
            logger.error(f"PDF processing failed: {str(e)}")
            return {
                "extracted_text": "",
                "page_count": 0,
                "processing_status": "failed",
                "error": str(e)
            }
