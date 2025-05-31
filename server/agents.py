import asyncio
import json
import openai
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class OpenAIAgent:
    """Base class for all OpenAI-powered agents in the system."""
    
    def __init__(self, api_key: str, model: str = "gpt-4", temperature: float = 0.2):
        """Initialize the agent with OpenAI API configuration."""
        openai.api_key = api_key
        self.model = model
        self.temperature = temperature
        self.system_prompt = "You are a helpful AI assistant."
        self.name = "BaseAgent"
    
    async def _call_openai(self, messages: List[Dict[str, str]]) -> str:
        """Call OpenAI API with the given messages."""
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=4000
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API call failed: {str(e)}")
            raise Exception(f"AI service error: {str(e)}")
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input data and return output. To be implemented by subclasses."""
        raise NotImplementedError("Subclasses must implement this method")


class CurriculumExpertAgent(OpenAIAgent):
    """Agent specialized in curriculum analysis and learning objective definition."""
    
    def __init__(self, api_key: str, model: str = "gpt-4", temperature: float = 0.1):
        """Initialize the curriculum expert agent."""
        super().__init__(api_key, model, temperature)
        self.name = "CurriculumExpert"
        self.system_prompt = """You are an expert curriculum designer with specialized knowledge of CBSE (Central Board of Secondary Education) Class 10 educational standards and learning objectives. Your role is to:

1. Analyze CBSE Class 10 curriculum requirements for specific subjects and topics as per NCERT guidelines
2. Define clear, measurable learning objectives aligned with CBSE assessment patterns and board exam requirements
3. Identify key concepts and skills that students should master according to CBSE syllabus and competency framework
4. Ensure alignment with CBSE educational standards, learning outcomes, and board examination patterns
5. Determine appropriate scope and sequence for lessons following NCERT textbook structure and CBSE time allocation

Always provide detailed, CBSE-specific guidance that considers the Indian educational context, examination requirements, and pedagogical best practices for Class 10 students."""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze curriculum requirements and define learning objectives."""
        subject = input_data.get("subject", "")
        grade_level = input_data.get("grade_level", "")
        topic = input_data.get("topic", "")
        subtopics = input_data.get("subtopics", [])
        difficulty_level = input_data.get("difficulty_level", "intermediate")
        
        prompt = f"""
        Analyze the following lesson requirements and provide detailed curriculum guidance:
        
        Subject: {subject}
        Grade Level: {grade_level}
        Topic: {topic}
        Subtopics: {', '.join(subtopics)}
        Difficulty Level: {difficulty_level}
        
        Please provide:
        1. 3-5 specific, measurable learning objectives aligned with CBSE standards
        2. CBSE/NCERT standards alignment references
        3. Prerequisites students should have
        4. Target skills to be developed
        5. Suggested lesson duration and pacing
        
        Format your response as JSON with the following structure:
        {{
            "learning_objectives": ["objective1", "objective2", ...],
            "standards_alignment": ["standard1", "standard2", ...],
            "prerequisites": ["prereq1", "prereq2", ...],
            "target_skills": ["skill1", "skill2", ...],
            "recommended_duration": "duration_string",
            "curriculum_analysis": "detailed analysis text"
        }}
        """
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_openai(messages)
        
        try:
            result = json.loads(response)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON response from {self.name}")
            return {
                "learning_objectives": [],
                "standards_alignment": [],
                "prerequisites": [],
                "target_skills": [],
                "recommended_duration": "45 minutes",
                "curriculum_analysis": response
            }


class ContentCreatorAgent(OpenAIAgent):
    """Agent specialized in creating engaging lesson content and explanations."""
    
    def __init__(self, api_key: str, model: str = "gpt-4", temperature: float = 0.3):
        super().__init__(api_key, model, temperature)
        self.name = "ContentCreator"
        self.system_prompt = """You are an expert educational content creator specializing in developing engaging, age-appropriate lesson content for Indian CBSE Class 10 students. Your expertise includes:

1. Creating clear, step-by-step explanations that build understanding progressively
2. Developing relatable examples and real-world applications relevant to Indian students
3. Designing interactive elements and activities that promote active learning
4. Adapting content for different learning styles (visual, auditory, kinesthetic)
5. Incorporating storytelling and narrative techniques to make abstract concepts concrete
6. Ensuring content is culturally relevant and appropriate for the Indian educational context

Always create content that is pedagogically sound, engaging, and aligned with modern educational best practices while respecting CBSE curriculum requirements."""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate engaging lesson content based on curriculum analysis."""
        curriculum_analysis = input_data.get("curriculum_analysis", {})
        subject = input_data.get("subject", "")
        topic = input_data.get("topic", "")
        subtopics = input_data.get("subtopics", [])
        learning_objectives = curriculum_analysis.get("learning_objectives", [])
        
        prompt = f"""
        Create comprehensive lesson content for:
        Subject: {subject}
        Topic: {topic}
        Subtopics: {', '.join(subtopics)}
        Learning Objectives: {', '.join(learning_objectives)}
        
        Generate the following lesson components:
        1. Introduction (5-10 minutes) - Hook, relevance, overview
        2. Main Content (20-30 minutes) - Detailed explanations with examples
        3. Interactive Activities (10-15 minutes) - Engaging student activities
        4. Wrap-up (5 minutes) - Summary and preview of next lesson
        
        Each component should be detailed, engaging, and include specific teaching strategies.
        
        Format as JSON:
        {{
            "introduction": {{
                "content": "detailed introduction content",
                "duration": "time estimate",
                "teaching_strategies": ["strategy1", "strategy2"]
            }},
            "main_content": {{
                "content": "detailed main content",
                "duration": "time estimate",
                "examples": ["example1", "example2"],
                "key_concepts": ["concept1", "concept2"]
            }},
            "activities": {{
                "content": "detailed activity descriptions",
                "duration": "time estimate",
                "materials_needed": ["material1", "material2"],
                "instructions": ["step1", "step2"]
            }},
            "wrap_up": {{
                "content": "summary and conclusion",
                "duration": "time estimate",
                "key_takeaways": ["takeaway1", "takeaway2"]
            }}
        }}
        """
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_openai(messages)
        
        try:
            result = json.loads(response)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON response from {self.name}")
            return {
                "introduction": {"content": "Introduction content", "duration": "10 minutes"},
                "main_content": {"content": "Main lesson content", "duration": "25 minutes"},
                "activities": {"content": "Interactive activities", "duration": "15 minutes"},
                "wrap_up": {"content": "Lesson summary", "duration": "5 minutes"}
            }


class AssessmentAgent(OpenAIAgent):
    """Agent specialized in creating assessments and evaluation methods."""
    
    def __init__(self, api_key: str, model: str = "gpt-4", temperature: float = 0.2):
        super().__init__(api_key, model, temperature)
        self.name = "AssessmentAgent"
        self.system_prompt = """You are an expert in educational assessment and evaluation, specializing in creating diverse, effective assessment strategies for CBSE Class 10 students. Your expertise includes:

1. Designing formative and summative assessments aligned with learning objectives
2. Creating assessment rubrics and scoring criteria
3. Developing different question types (MCQ, short answer, essay, practical)
4. Ensuring assessments are fair, valid, and reliable
5. Incorporating peer assessment and self-reflection opportunities
6. Adapting assessments for different learning needs and abilities

Always create assessments that accurately measure student understanding while promoting learning and growth."""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate assessment activities and evaluation methods."""
        learning_objectives = input_data.get("learning_objectives", [])
        subject = input_data.get("subject", "")
        topic = input_data.get("topic", "")
        difficulty_level = input_data.get("difficulty_level", "intermediate")
        
        prompt = f"""
        Create comprehensive assessment strategies for:
        Subject: {subject}
        Topic: {topic}
        Learning Objectives: {', '.join(learning_objectives)}
        Difficulty Level: {difficulty_level}
        
        Design:
        1. Formative assessments (during lesson)
        2. Summative assessment (end of lesson)
        3. Self-assessment opportunities
        4. Evaluation criteria and rubrics
        
        Format as JSON:
        {{
            "formative_assessments": [
                {{
                    "type": "assessment type",
                    "description": "detailed description",
                    "timing": "when to use",
                    "questions": ["question1", "question2"]
                }}
            ],
            "summative_assessment": {{
                "type": "assessment type",
                "description": "detailed description",
                "questions": ["question1", "question2"],
                "rubric": "scoring criteria"
            }},
            "self_assessment": {{
                "reflection_questions": ["question1", "question2"],
                "checklist": ["item1", "item2"]
            }},
            "evaluation_criteria": ["criteria1", "criteria2"]
        }}
        """
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_openai(messages)
        
        try:
            result = json.loads(response)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON response from {self.name}")
            return {
                "formative_assessments": [],
                "summative_assessment": {"type": "quiz", "questions": []},
                "self_assessment": {"reflection_questions": []},
                "evaluation_criteria": []
            }


class QualityReviewAgent(OpenAIAgent):
    """Agent specialized in reviewing and improving lesson quality."""
    
    def __init__(self, api_key: str, model: str = "gpt-4", temperature: float = 0.1):
        super().__init__(api_key, model, temperature)
        self.name = "QualityReviewAgent"
        self.system_prompt = """You are an expert educational quality assurance specialist with deep knowledge of pedagogical best practices, CBSE curriculum standards, and effective teaching methodologies. Your role is to:

1. Review lesson plans for pedagogical soundness and curriculum alignment
2. Evaluate content quality, accuracy, and age-appropriateness
3. Assess engagement levels and interactive elements
4. Check for inclusive and diverse representation
5. Ensure assessment alignment with learning objectives
6. Provide constructive feedback and improvement suggestions
7. Rate overall lesson quality on multiple dimensions

Provide thorough, actionable feedback that helps improve lesson effectiveness."""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Review complete lesson and provide quality assessment."""
        lesson_data = input_data
        
        prompt = f"""
        Review this complete lesson plan and provide comprehensive quality assessment:
        
        Lesson Data: {json.dumps(lesson_data, indent=2)}
        
        Evaluate on these dimensions:
        1. Curriculum Alignment (1-10)
        2. Content Quality (1-10)
        3. Engagement Level (1-10)
        4. Assessment Effectiveness (1-10)
        5. Pedagogical Soundness (1-10)
        
        Provide:
        - Detailed feedback for each dimension
        - Overall quality score (1-10)
        - Specific improvement recommendations
        - Strengths of the lesson
        
        Format as JSON:
        {{
            "quality_scores": {{
                "curriculum_alignment": score,
                "content_quality": score,
                "engagement_level": score,
                "assessment_effectiveness": score,
                "pedagogical_soundness": score
            }},
            "overall_score": average_score,
            "strengths": ["strength1", "strength2"],
            "areas_for_improvement": ["area1", "area2"],
            "detailed_feedback": "comprehensive feedback text",
            "recommendations": ["recommendation1", "recommendation2"]
        }}
        """
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_openai(messages)
        
        try:
            result = json.loads(response)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON response from {self.name}")
            return {
                "quality_scores": {
                    "curriculum_alignment": 7,
                    "content_quality": 7,
                    "engagement_level": 7,
                    "assessment_effectiveness": 7,
                    "pedagogical_soundness": 7
                },
                "overall_score": 7.0,
                "strengths": [],
                "areas_for_improvement": [],
                "detailed_feedback": response,
                "recommendations": []
            }
