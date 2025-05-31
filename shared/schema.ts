import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  gradeLevel: text("grade_level").notNull(),
  topic: text("topic").notNull(),
  subtopics: text("subtopics").array().notNull(),
  difficultyLevel: text("difficulty_level").notNull().default("intermediate"),
  estimatedDuration: text("estimated_duration").notNull().default("45 minutes"),
  learningObjectives: text("learning_objectives").array().notNull(),
  standardsAlignment: text("standards_alignment").array(),
  prerequisites: text("prerequisites").array(),
  targetSkills: text("target_skills").array(),
  components: jsonb("components").notNull(),
  qualityScore: real("quality_score"),
  feedback: text("feedback").array(),
  version: text("version").notNull().default("1.0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const curriculumDocuments = pgTable("curriculum_documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const generationSessions = pgTable("generation_sessions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  currentAgent: text("current_agent"),
  error: text("error"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Lesson metadata schema
export const lessonMetadataSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  topic: z.string().min(1, "Topic is required"),
  subtopics: z.array(z.string()).min(1, "At least one subtopic is required"),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  estimatedDuration: z.string().default("45 minutes"),
  learningObjectives: z.array(z.string()).optional().default([]),
  standardsAlignment: z.array(z.string()).optional().default([]),
  prerequisites: z.array(z.string()).optional().default([]),
  targetSkills: z.array(z.string()).optional().default([]),
});

// Lesson component schema
export const lessonComponentSchema = z.object({
  componentType: z.string(),
  content: z.string(),
  order: z.number(),
  metadata: z.record(z.any()).optional().default({}),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertCurriculumDocumentSchema = createInsertSchema(curriculumDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertGenerationSessionSchema = createInsertSchema(generationSessions).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

// Request/Response schemas for API
export const lessonGenerationRequestSchema = z.object({
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  topic: z.string().min(1),
  subtopics: z.array(z.string()).min(1),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  estimatedDuration: z.string().default("45 minutes"),
  curriculumDocumentIds: z.array(z.number()).optional().default([]),
});

export const lessonProgressSchema = z.object({
  sessionId: z.number(),
  progress: z.number().min(0).max(100),
  currentAgent: z.string(),
  status: z.enum(["pending", "in_progress", "completed", "failed"]),
  message: z.string().optional(),
  error: z.string().optional(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertCurriculumDocument = z.infer<typeof insertCurriculumDocumentSchema>;
export type CurriculumDocument = typeof curriculumDocuments.$inferSelect;

export type InsertGenerationSession = z.infer<typeof insertGenerationSessionSchema>;
export type GenerationSession = typeof generationSessions.$inferSelect;

export type LessonMetadata = z.infer<typeof lessonMetadataSchema>;
export type LessonComponent = z.infer<typeof lessonComponentSchema>;
export type LessonGenerationRequest = z.infer<typeof lessonGenerationRequestSchema>;
export type LessonProgress = z.infer<typeof lessonProgressSchema>;
