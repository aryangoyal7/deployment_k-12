import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import multer from "multer";
import { z } from "zod";
import { storage } from "./storage";
import { lessonGenerationRequestSchema, type LessonGenerationRequest, type LessonProgress } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server for real-time progress updates on a different path
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  const activeConnections = new Map();

  // WebSocket connection handling
  wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected");
    
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "subscribe_progress" && data.sessionId) {
          activeConnections.set(data.sessionId, ws);
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      // Remove from active connections
      const entries = Array.from(activeConnections.entries());
      for (const [sessionId, connection] of entries) {
        if (connection === ws) {
          activeConnections.delete(sessionId);
          break;
        }
      }
    });
  });

  // Helper function to broadcast progress updates
  const broadcastProgress = (progress: LessonProgress) => {
    const ws = activeConnections.get(progress.sessionId);
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: "progress_update",
        data: progress
      }));
    }
  };

  // Lesson generation service integration
  const callLessonGenerationService = async (requestData: any, sessionId: number) => {
    try {
      const { generateLesson } = await import('./lesson-generation-service');
      const result = await generateLesson(requestData, sessionId, broadcastProgress);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Lesson generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // POST /api/lessons/generate - Generate a new lesson
  app.post("/api/lessons/generate", async (req, res) => {
    try {
      const requestData = lessonGenerationRequestSchema.parse(req.body);
      
      // Create generation session
      const session = await storage.createGenerationSession({
        lessonId: null,
        status: "pending",
        progress: 0,
        currentAgent: "Initializing"
      });

      // Broadcast initial progress
      broadcastProgress({
        sessionId: session.id,
        progress: 0,
        currentAgent: "Initializing",
        status: "pending",
        message: "Starting lesson generation..."
      });

      // Start lesson generation in background
      setImmediate(async () => {
        try {
          // Call lesson generation service which handles all progress updates
          const serviceResponse = await callLessonGenerationService(requestData, session.id);

          if (serviceResponse.success) {
            // The lesson generation service already creates and stores the lesson
            const lesson = serviceResponse.data;

            // Update session with completion
            await storage.updateGenerationSession(session.id, {
              lessonId: lesson.id,
              status: "completed",
              progress: 100,
              currentAgent: "Complete"
            });

          } else {
            throw new Error("Lesson generation service failed");
          }

        } catch (error) {
          console.error("Lesson generation error:", error);
          
          await storage.updateGenerationSession(session.id, {
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error"
          });

          broadcastProgress({
            sessionId: session.id,
            progress: 0,
            currentAgent: "Error",
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error"
          });
        }
      });

      res.json({
        success: true,
        sessionId: session.id,
        message: "Lesson generation started"
      });

    } catch (error) {
      console.error("Lesson generation request error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Invalid request"
      });
    }
  });

  // GET /api/lessons/:id - Get a specific lesson
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);

      if (!lesson) {
        return res.status(404).json({
          success: false,
          error: "Lesson not found"
        });
      }

      res.json({
        success: true,
        data: lesson
      });

    } catch (error) {
      console.error("Get lesson error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve lesson"
      });
    }
  });

  // GET /api/lessons - List all lessons with pagination
  app.get("/api/lessons", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const lessons = await storage.getLessonsByUser(userId);

      res.json({
        success: true,
        data: lessons,
        total: lessons.length
      });

    } catch (error) {
      console.error("List lessons error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve lessons"
      });
    }
  });

  // POST /api/upload/curriculum - Upload curriculum documents
  app.post("/api/upload/curriculum", upload.array("files", 5), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({
          success: false,
          error: "No files uploaded"
        });
      }

      const uploadedFiles = [];

      for (const file of req.files as Express.Multer.File[]) {
        const doc = await storage.createCurriculumDocument({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          userId: 1 // Default user for demo
        });

        uploadedFiles.push(doc);
      }

      res.json({
        success: true,
        data: uploadedFiles
      });

    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to upload files"
      });
    }
  });

  // GET /api/sessions/:id/progress - Get generation session progress
  app.get("/api/sessions/:id/progress", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getGenerationSession(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          error: "Session not found"
        });
      }

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          progress: session.progress,
          currentAgent: session.currentAgent || "Unknown",
          status: session.status,
          error: session.error
        }
      });

    } catch (error) {
      console.error("Get session progress error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve session progress"
      });
    }
  });

  // GET /api/lessons/:id/export - Export lesson in different formats
  app.get("/api/lessons/:id/export", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const format = req.query.format as string || "json";
      
      const lesson = await storage.getLesson(lessonId);

      if (!lesson) {
        return res.status(404).json({
          success: false,
          error: "Lesson not found"
        });
      }

      if (format === "markdown") {
        // Convert lesson to markdown
        let markdown = `# ${lesson.title}\n\n`;
        markdown += `## Lesson Metadata\n\n`;
        markdown += `- **Subject:** ${lesson.subject}\n`;
        markdown += `- **Grade Level:** ${lesson.gradeLevel}\n`;
        markdown += `- **Topic:** ${lesson.topic}\n`;
        markdown += `- **Difficulty Level:** ${lesson.difficultyLevel}\n`;
        markdown += `- **Duration:** ${lesson.estimatedDuration}\n\n`;

        if (lesson.learningObjectives?.length) {
          markdown += `### Learning Objectives\n\n`;
          lesson.learningObjectives.forEach((objective, index) => {
            markdown += `${index + 1}. ${objective}\n`;
          });
          markdown += `\n`;
        }

        // Add components
        const components = Array.isArray(lesson.components) ? lesson.components : [];
        components.sort((a: any, b: any) => a.order - b.order);
        
        components.forEach((component: any) => {
          markdown += `## ${component.componentType}\n\n`;
          markdown += `${component.content}\n\n`;
        });

        res.setHeader("Content-Type", "text/markdown");
        res.setHeader("Content-Disposition", `attachment; filename="${lesson.title}.md"`);
        res.send(markdown);

      } else {
        // Return JSON format
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="${lesson.title}.json"`);
        res.json(lesson);
      }

    } catch (error) {
      console.error("Export lesson error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to export lesson"
      });
    }
  });

  return httpServer;
}
