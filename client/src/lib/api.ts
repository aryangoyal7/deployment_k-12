import { LessonGenerationRequest, LessonProgress } from "@shared/schema";

const API_BASE = "";

export async function apiRequest(url: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export class LessonGeneratorAPI {
  private static instance: LessonGeneratorAPI;
  private wsConnection: WebSocket | null = null;
  private progressCallbacks = new Map<number, (progress: LessonProgress) => void>();

  static getInstance(): LessonGeneratorAPI {
    if (!LessonGeneratorAPI.instance) {
      LessonGeneratorAPI.instance = new LessonGeneratorAPI();
    }
    return LessonGeneratorAPI.instance;
  }

  async generateLesson(request: LessonGenerationRequest): Promise<{ sessionId: number }> {
    const response = await fetch(`${API_BASE}/api/lessons/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to start lesson generation: ${response.statusText}`);
    }

    const data = await response.json();
    return { sessionId: data.sessionId };
  }

  async getLesson(id: number) {
    const response = await fetch(`${API_BASE}/api/lessons/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch lesson: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getLessons() {
    const response = await fetch(`${API_BASE}/api/lessons`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async uploadCurriculumFiles(files: File[]): Promise<any[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    const response = await fetch(`${API_BASE}/api/upload/curriculum`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async exportLesson(id: number, format: "json" | "markdown" = "json"): Promise<Blob> {
    const response = await fetch(`${API_BASE}/api/lessons/${id}/export?format=${format}`);
    
    if (!response.ok) {
      throw new Error(`Failed to export lesson: ${response.statusText}`);
    }

    return response.blob();
  }

  subscribeToProgress(sessionId: number, callback: (progress: LessonProgress) => void): void {
    this.progressCallbacks.set(sessionId, callback);
    this.connectWebSocket();
    
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: "subscribe_progress",
        sessionId
      }));
    }
  }

  unsubscribeFromProgress(sessionId: number): void {
    this.progressCallbacks.delete(sessionId);
  }

  private connectWebSocket(): void {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onopen = () => {
      console.log("WebSocket connected");
    };

    this.wsConnection.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "progress_update" && message.data) {
          const progress = message.data as LessonProgress;
          const callback = this.progressCallbacks.get(progress.sessionId);
          if (callback) {
            callback(progress);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.wsConnection.onclose = () => {
      console.log("WebSocket disconnected");
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (this.progressCallbacks.size > 0) {
          this.connectWebSocket();
        }
      }, 3000);
    };

    this.wsConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }
}
