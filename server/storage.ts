import { lessons, users, curriculumDocuments, generationSessions, type User, type InsertUser, type Lesson, type InsertLesson, type CurriculumDocument, type InsertCurriculumDocument, type GenerationSession, type InsertGenerationSession } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Lesson operations
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonsByUser(userId: number): Promise<Lesson[]>;
  updateLesson(id: number, updates: Partial<InsertLesson>): Promise<Lesson | undefined>;
  deleteLesson(id: number): Promise<boolean>;

  // Curriculum document operations
  createCurriculumDocument(doc: InsertCurriculumDocument): Promise<CurriculumDocument>;
  getCurriculumDocument(id: number): Promise<CurriculumDocument | undefined>;
  getCurriculumDocumentsByUser(userId: number): Promise<CurriculumDocument[]>;
  deleteCurriculumDocument(id: number): Promise<boolean>;

  // Generation session operations
  createGenerationSession(session: InsertGenerationSession): Promise<GenerationSession>;
  getGenerationSession(id: number): Promise<GenerationSession | undefined>;
  updateGenerationSession(id: number, updates: Partial<InsertGenerationSession>): Promise<GenerationSession | undefined>;
  getActiveGenerationSessions(): Promise<GenerationSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private lessons: Map<number, Lesson>;
  private curriculumDocuments: Map<number, CurriculumDocument>;
  private generationSessions: Map<number, GenerationSession>;
  private currentUserId: number;
  private currentLessonId: number;
  private currentDocumentId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.curriculumDocuments = new Map();
    this.generationSessions = new Map();
    this.currentUserId = 1;
    this.currentLessonId = 1;
    this.currentDocumentId = 1;
    this.currentSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentLessonId++;
    const lesson: Lesson = {
      id,
      title: insertLesson.title,
      subject: insertLesson.subject,
      gradeLevel: insertLesson.gradeLevel,
      topic: insertLesson.topic,
      subtopics: insertLesson.subtopics,
      difficultyLevel: insertLesson.difficultyLevel || "intermediate",
      estimatedDuration: insertLesson.estimatedDuration || "45 minutes",
      learningObjectives: insertLesson.learningObjectives,
      standardsAlignment: insertLesson.standardsAlignment || null,
      prerequisites: insertLesson.prerequisites || null,
      targetSkills: insertLesson.targetSkills || null,
      components: insertLesson.components,
      qualityScore: insertLesson.qualityScore || null,
      feedback: insertLesson.feedback || null,
      version: insertLesson.version || "1.0",
      createdAt: new Date(),
      userId: insertLesson.userId || null,
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessonsByUser(userId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(
      (lesson) => lesson.userId === userId
    );
  }

  async updateLesson(id: number, updates: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const existing = this.lessons.get(id);
    if (!existing) return undefined;

    const updated: Lesson = { ...existing, ...updates };
    this.lessons.set(id, updated);
    return updated;
  }

  async deleteLesson(id: number): Promise<boolean> {
    return this.lessons.delete(id);
  }

  async createCurriculumDocument(insertDoc: InsertCurriculumDocument): Promise<CurriculumDocument> {
    const id = this.currentDocumentId++;
    const doc: CurriculumDocument = {
      id,
      filename: insertDoc.filename,
      originalName: insertDoc.originalName,
      mimeType: insertDoc.mimeType,
      size: insertDoc.size,
      uploadedAt: new Date(),
      userId: insertDoc.userId || null,
    };
    this.curriculumDocuments.set(id, doc);
    return doc;
  }

  async getCurriculumDocument(id: number): Promise<CurriculumDocument | undefined> {
    return this.curriculumDocuments.get(id);
  }

  async getCurriculumDocumentsByUser(userId: number): Promise<CurriculumDocument[]> {
    return Array.from(this.curriculumDocuments.values()).filter(
      (doc) => doc.userId === userId
    );
  }

  async deleteCurriculumDocument(id: number): Promise<boolean> {
    return this.curriculumDocuments.delete(id);
  }

  async createGenerationSession(insertSession: InsertGenerationSession): Promise<GenerationSession> {
    const id = this.currentSessionId++;
    const session: GenerationSession = {
      id,
      lessonId: insertSession.lessonId || null,
      status: insertSession.status || "pending",
      progress: insertSession.progress || 0,
      currentAgent: insertSession.currentAgent || null,
      error: insertSession.error || null,
      startedAt: new Date(),
      completedAt: null,
    };
    this.generationSessions.set(id, session);
    return session;
  }

  async getGenerationSession(id: number): Promise<GenerationSession | undefined> {
    return this.generationSessions.get(id);
  }

  async updateGenerationSession(id: number, updates: Partial<InsertGenerationSession>): Promise<GenerationSession | undefined> {
    const existing = this.generationSessions.get(id);
    if (!existing) return undefined;

    const updated: GenerationSession = { ...existing, ...updates };
    if (updates.status === "completed" || updates.status === "failed") {
      updated.completedAt = new Date();
    }
    this.generationSessions.set(id, updated);
    return updated;
  }

  async getActiveGenerationSessions(): Promise<GenerationSession[]> {
    return Array.from(this.generationSessions.values()).filter(
      (session) => session.status === "in_progress" || session.status === "pending"
    );
  }
}

export const storage = new MemStorage();
