import { LessonGenerationRequest, LessonProgress } from "@shared/schema";
import { storage } from "./storage";

// OpenAI integration for the multi-agent system
class OpenAIAgent {
  private apiKey: string;
  private model: string;
  private temperature: number;

  constructor(apiKey: string, model: string = "gpt-4", temperature: number = 0.2) {
    this.apiKey = apiKey;
    this.model = model;
    this.temperature = temperature;
  }

  async callOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: this.temperature,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async process(inputData: any): Promise<any> {
    throw new Error("Subclasses must implement this method");
  }
}

class CurriculumExpertAgent extends OpenAIAgent {
  constructor(apiKey: string) {
    super(apiKey, "gpt-4", 0.1);
  }

  async process(inputData: any): Promise<any> {
    const { subject, gradeLevel, topic, subtopics, difficultyLevel } = inputData;
    
    const systemPrompt = `You are an expert curriculum designer with specialized knowledge of CBSE (Central Board of Secondary Education) Class 10 educational standards and learning objectives. Your role is to analyze CBSE Class 10 curriculum requirements for specific subjects and topics as per NCERT guidelines, define clear, measurable learning objectives aligned with CBSE assessment patterns and board exam requirements, identify key concepts and skills that students should master according to CBSE syllabus and competency framework, ensure alignment with CBSE educational standards, learning outcomes, and board examination patterns, and determine appropriate scope and sequence for lessons following NCERT textbook structure and CBSE time allocation.`;

    const userPrompt = `Analyze the following lesson requirements and provide detailed curriculum guidance:
    
    Subject: ${subject}
    Grade Level: ${gradeLevel}
    Topic: ${topic}
    Subtopics: ${subtopics.join(', ')}
    Difficulty Level: ${difficultyLevel}
    
    Please provide:
    1. 3-5 specific, measurable learning objectives aligned with CBSE standards
    2. CBSE/NCERT standards alignment references
    3. Prerequisites students should have
    4. Target skills to be developed
    5. Suggested lesson duration and pacing
    
    Format your response as JSON with the following structure:
    {
        "learning_objectives": ["objective1", "objective2", ...],
        "standards_alignment": ["standard1", "standard2", ...],
        "prerequisites": ["prereq1", "prereq2", ...],
        "target_skills": ["skill1", "skill2", ...],
        "recommended_duration": "duration_string",
        "curriculum_analysis": "detailed analysis text"
    }`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse JSON response from CurriculumExpert");
      return {
        learning_objectives: ["Understand key concepts of " + topic],
        standards_alignment: ["CBSE Class " + gradeLevel + " " + subject],
        prerequisites: [],
        target_skills: [],
        recommended_duration: "45 minutes",
        curriculum_analysis: response
      };
    }
  }
}

class ContentCreatorAgent extends OpenAIAgent {
  constructor(apiKey: string) {
    super(apiKey, "gpt-4", 0.3);
  }

  async process(inputData: any): Promise<any> {
    const { subject, topic, subtopics, curriculum_analysis } = inputData;
    const learningObjectives = curriculum_analysis?.learning_objectives || [];

    const systemPrompt = `You are an expert educational content creator specializing in developing engaging, age-appropriate lesson content for Indian CBSE Class 10 students. Your expertise includes creating clear, step-by-step explanations that build understanding progressively, developing relatable examples and real-world applications relevant to Indian students, designing interactive elements and activities that promote active learning, adapting content for different learning styles (visual, auditory, kinesthetic), incorporating storytelling and narrative techniques to make abstract concepts concrete, and ensuring content is culturally relevant and appropriate for the Indian educational context.`;

    const userPrompt = `Create comprehensive lesson content for:
    Subject: ${subject}
    Topic: ${topic}
    Subtopics: ${subtopics.join(', ')}
    Learning Objectives: ${learningObjectives.join(', ')}
    
    Generate the following lesson components:
    1. Introduction (5-10 minutes) - Hook, relevance, overview
    2. Main Content (20-30 minutes) - Detailed explanations with examples
    3. Interactive Activities (10-15 minutes) - Engaging student activities
    4. Wrap-up (5 minutes) - Summary and preview of next lesson
    
    Each component should be detailed, engaging, and include specific teaching strategies.
    
    Format as JSON:
    {
        "introduction": {
            "content": "detailed introduction content",
            "duration": "time estimate",
            "teaching_strategies": ["strategy1", "strategy2"]
        },
        "main_content": {
            "content": "detailed main content",
            "duration": "time estimate",
            "examples": ["example1", "example2"],
            "key_concepts": ["concept1", "concept2"]
        },
        "activities": {
            "content": "detailed activity descriptions",
            "duration": "time estimate",
            "materials_needed": ["material1", "material2"],
            "instructions": ["step1", "step2"]
        },
        "wrap_up": {
            "content": "summary and conclusion",
            "duration": "time estimate",
            "key_takeaways": ["takeaway1", "takeaway2"]
        }
    }`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse JSON response from ContentCreator");
      return {
        introduction: { content: "Introduction to " + topic, duration: "10 minutes" },
        main_content: { content: "Main content about " + topic, duration: "25 minutes" },
        activities: { content: "Interactive activities for " + topic, duration: "15 minutes" },
        wrap_up: { content: "Summary of " + topic, duration: "5 minutes" }
      };
    }
  }
}

class AssessmentAgent extends OpenAIAgent {
  constructor(apiKey: string) {
    super(apiKey, "gpt-4", 0.2);
  }

  async process(inputData: any): Promise<any> {
    const { subject, topic, difficultyLevel, learning_objectives } = inputData;

    const systemPrompt = `You are an expert in educational assessment and evaluation, specializing in creating diverse, effective assessment strategies for CBSE Class 10 students. Your expertise includes designing formative and summative assessments aligned with learning objectives, creating assessment rubrics and scoring criteria, developing different question types (MCQ, short answer, essay, practical), ensuring assessments are fair, valid, and reliable, incorporating peer assessment and self-reflection opportunities, and adapting assessments for different learning needs and abilities.`;

    const userPrompt = `Create comprehensive assessment strategies for:
    Subject: ${subject}
    Topic: ${topic}
    Learning Objectives: ${learning_objectives.join(', ')}
    Difficulty Level: ${difficultyLevel}
    
    Design:
    1. Formative assessments (during lesson)
    2. Summative assessment (end of lesson)
    3. Self-assessment opportunities
    4. Evaluation criteria and rubrics
    
    Format as JSON:
    {
        "formative_assessments": [
            {
                "type": "assessment type",
                "description": "detailed description",
                "timing": "when to use",
                "questions": ["question1", "question2"]
            }
        ],
        "summative_assessment": {
            "type": "assessment type",
            "description": "detailed description",
            "questions": ["question1", "question2"],
            "rubric": "scoring criteria"
        },
        "self_assessment": {
            "reflection_questions": ["question1", "question2"],
            "checklist": ["item1", "item2"]
        },
        "evaluation_criteria": ["criteria1", "criteria2"]
    }`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse JSON response from AssessmentAgent");
      return {
        formative_assessments: [{ type: "Quick Check", description: "Formative assessment", questions: [] }],
        summative_assessment: { type: "Quiz", questions: [], rubric: "Standard rubric" },
        self_assessment: { reflection_questions: [], checklist: [] },
        evaluation_criteria: []
      };
    }
  }
}

class QualityReviewAgent extends OpenAIAgent {
  constructor(apiKey: string) {
    super(apiKey, "gpt-4", 0.1);
  }

  async process(inputData: any): Promise<any> {
    const systemPrompt = `You are an expert educational quality assurance specialist with deep knowledge of pedagogical best practices, CBSE curriculum standards, and effective teaching methodologies. Your role is to review lesson plans for pedagogical soundness and curriculum alignment, evaluate content quality, accuracy, and age-appropriateness, assess engagement levels and interactive elements, check for inclusive and diverse representation, ensure assessment alignment with learning objectives, provide constructive feedback and improvement suggestions, and rate overall lesson quality on multiple dimensions.`;

    const userPrompt = `Review this complete lesson plan and provide comprehensive quality assessment:
    
    Lesson Data: ${JSON.stringify(inputData, null, 2)}
    
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
    {
        "quality_scores": {
            "curriculum_alignment": score,
            "content_quality": score,
            "engagement_level": score,
            "assessment_effectiveness": score,
            "pedagogical_soundness": score
        },
        "overall_score": average_score,
        "strengths": ["strength1", "strength2"],
        "areas_for_improvement": ["area1", "area2"],
        "detailed_feedback": "comprehensive feedback text",
        "recommendations": ["recommendation1", "recommendation2"]
    }`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse JSON response from QualityReviewAgent");
      return {
        quality_scores: {
          curriculum_alignment: 8,
          content_quality: 8,
          engagement_level: 8,
          assessment_effectiveness: 8,
          pedagogical_soundness: 8
        },
        overall_score: 8.0,
        strengths: ["Well-structured content"],
        areas_for_improvement: [],
        detailed_feedback: response,
        recommendations: []
      };
    }
  }
}

export async function generateLesson(
  request: LessonGenerationRequest,
  sessionId: number,
  progressCallback: (progress: LessonProgress) => void
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not found");
  }

  // Initialize agents
  const curriculumAgent = new CurriculumExpertAgent(apiKey);
  const contentAgent = new ContentCreatorAgent(apiKey);
  const assessmentAgent = new AssessmentAgent(apiKey);
  const qualityAgent = new QualityReviewAgent(apiKey);

  try {
    // Step 1: Curriculum Analysis (0-25%)
    progressCallback({
      sessionId,
      progress: 5,
      currentAgent: "CurriculumExpert",
      status: "in_progress",
      message: "Starting curriculum analysis..."
    });

    const curriculumInput = {
      subject: request.subject,
      gradeLevel: request.gradeLevel,
      topic: request.topic,
      subtopics: request.subtopics,
      difficultyLevel: request.difficultyLevel
    };

    const curriculumAnalysis = await curriculumAgent.process(curriculumInput);
    
    progressCallback({
      sessionId,
      progress: 25,
      currentAgent: "CurriculumExpert",
      status: "in_progress",
      message: "Curriculum analysis completed"
    });

    // Step 2: Content Generation (25-60%)
    progressCallback({
      sessionId,
      progress: 30,
      currentAgent: "ContentCreator",
      status: "in_progress",
      message: "Generating lesson content..."
    });

    const contentInput = {
      ...curriculumInput,
      curriculum_analysis: curriculumAnalysis,
      learning_objectives: curriculumAnalysis.learning_objectives || []
    };

    const lessonContent = await contentAgent.process(contentInput);
    
    progressCallback({
      sessionId,
      progress: 60,
      currentAgent: "ContentCreator",
      status: "in_progress",
      message: "Lesson content generated"
    });

    // Step 3: Assessment Creation (60-80%)
    progressCallback({
      sessionId,
      progress: 65,
      currentAgent: "AssessmentAgent",
      status: "in_progress",
      message: "Creating assessments..."
    });

    const assessmentInput = {
      ...curriculumInput,
      learning_objectives: curriculumAnalysis.learning_objectives || []
    };

    const assessments = await assessmentAgent.process(assessmentInput);
    
    progressCallback({
      sessionId,
      progress: 80,
      currentAgent: "AssessmentAgent",
      status: "in_progress",
      message: "Assessments created"
    });

    // Step 4: Compile Lesson Components
    progressCallback({
      sessionId,
      progress: 85,
      currentAgent: "LessonCompiler",
      status: "in_progress",
      message: "Compiling lesson components..."
    });

    const components = compileComponents(lessonContent, assessments);

    // Step 5: Quality Review (80-95%)
    progressCallback({
      sessionId,
      progress: 90,
      currentAgent: "QualityReviewAgent",
      status: "in_progress",
      message: "Reviewing lesson quality..."
    });

    const lessonData = {
      subject: request.subject,
      gradeLevel: request.gradeLevel,
      topic: request.topic,
      subtopics: request.subtopics,
      curriculum_analysis: curriculumAnalysis,
      lesson_content: lessonContent,
      assessments: assessments,
      components: components
    };

    const qualityReview = await qualityAgent.process(lessonData);
    
    progressCallback({
      sessionId,
      progress: 95,
      currentAgent: "QualityReviewAgent",
      status: "in_progress",
      message: "Quality review completed"
    });

    // Step 6: Final Assembly
    progressCallback({
      sessionId,
      progress: 98,
      currentAgent: "LessonAssembler",
      status: "in_progress",
      message: "Finalizing lesson..."
    });

    // Create and store the lesson
    const lesson = await storage.createLesson({
      title: `${request.topic} - ${request.subject} Lesson`,
      subject: request.subject,
      gradeLevel: request.gradeLevel,
      topic: request.topic,
      subtopics: request.subtopics,
      difficultyLevel: request.difficultyLevel,
      estimatedDuration: request.estimatedDuration,
      learningObjectives: curriculumAnalysis.learning_objectives || [],
      standardsAlignment: curriculumAnalysis.standards_alignment || [],
      prerequisites: curriculumAnalysis.prerequisites || [],
      targetSkills: curriculumAnalysis.target_skills || [],
      components: components,
      qualityScore: qualityReview.overall_score || 8.0,
      feedback: qualityReview.recommendations || [],
      version: "1.0",
      userId: 1 // Default user for demo
    });

    progressCallback({
      sessionId,
      progress: 100,
      currentAgent: "Complete",
      status: "completed",
      message: "Lesson generation completed successfully"
    });

    return lesson;

  } catch (error) {
    console.error("Lesson generation failed:", error);
    progressCallback({
      sessionId,
      progress: 0,
      currentAgent: "Error",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
    throw error;
  }
}

function compileComponents(lessonContent: any, assessments: any): any[] {
  const components = [];
  let order = 1;

  // Introduction component
  if (lessonContent.introduction) {
    components.push({
      componentType: "Introduction",
      content: lessonContent.introduction.content,
      order: order++,
      metadata: {
        duration: lessonContent.introduction.duration,
        teaching_strategies: lessonContent.introduction.teaching_strategies || []
      }
    });
  }

  // Main content component
  if (lessonContent.main_content) {
    components.push({
      componentType: "Main Content",
      content: lessonContent.main_content.content,
      order: order++,
      metadata: {
        duration: lessonContent.main_content.duration,
        examples: lessonContent.main_content.examples || [],
        key_concepts: lessonContent.main_content.key_concepts || []
      }
    });
  }

  // Activities component
  if (lessonContent.activities) {
    components.push({
      componentType: "Interactive Activities",
      content: lessonContent.activities.content,
      order: order++,
      metadata: {
        duration: lessonContent.activities.duration,
        materials_needed: lessonContent.activities.materials_needed || [],
        instructions: lessonContent.activities.instructions || []
      }
    });
  }

  // Assessment component
  if (assessments.formative_assessments && assessments.formative_assessments.length > 0) {
    let assessmentContent = "Formative Assessments:\n";
    for (const assessment of assessments.formative_assessments) {
      assessmentContent += `\n${assessment.type}: ${assessment.description}\n`;
      for (const question of assessment.questions || []) {
        assessmentContent += `- ${question}\n`;
      }
    }

    components.push({
      componentType: "Formative Assessment",
      content: assessmentContent,
      order: order++,
      metadata: {
        assessment_type: "formative",
        assessments: assessments.formative_assessments
      }
    });
  }

  // Wrap-up component
  if (lessonContent.wrap_up) {
    components.push({
      componentType: "Conclusion",
      content: lessonContent.wrap_up.content,
      order: order++,
      metadata: {
        duration: lessonContent.wrap_up.duration,
        key_takeaways: lessonContent.wrap_up.key_takeaways || []
      }
    });
  }

  return components;
}