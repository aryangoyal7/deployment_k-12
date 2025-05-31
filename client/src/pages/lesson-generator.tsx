import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, CalendarDays, BookOpen } from "lucide-react";
import LessonForm from "@/components/lesson-generator/lesson-form";
import ProgressTracker from "@/components/lesson-generator/progress-tracker";
import LessonPreview from "@/components/lesson-generator/lesson-preview";
import FileUpload from "@/components/lesson-generator/file-upload";
import { useLessonGenerator } from "@/hooks/use-lesson-generator";

export default function LessonGenerator() {
  const { generateLesson, lessonsQuery, useLessonQuery, progress, isGenerating } = useLessonGenerator();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  
  const selectedLessonQuery = useLessonQuery(selectedLessonId);

  // Auto-select the latest lesson when generation completes
  useEffect(() => {
    if (progress?.status === "completed" && lessonsQuery.data?.length) {
      const latestLesson = lessonsQuery.data[0];
      setSelectedLessonId(latestLesson.id);
    }
  }, [progress?.status, lessonsQuery.data]);

  const handleLessonGeneration = (data: any) => {
    generateLesson.mutate(data);
  };

  const recentLessons = lessonsQuery.data?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">EduGenius</span>
              </div>
              
              <nav className="hidden md:flex space-x-6 ml-8">
                <a href="#dashboard" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </a>
                <a href="#lessons" className="text-primary px-3 py-2 text-sm font-medium border-b-2 border-primary">
                  Lesson Generator
                </a>
                <a href="#library" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Lesson Library
                </a>
                <a href="#analytics" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Analytics
                </a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">Dr. Sarah Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Lesson Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <LessonForm 
              onSubmit={handleLessonGeneration} 
              isLoading={isGenerating}
            />
            
            <FileUpload />
          </div>
          
          {/* Right Panel - Generation Results */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Tracker */}
            <ProgressTracker 
              progress={progress} 
              isGenerating={isGenerating}
            />
            
            {/* Lesson Preview */}
            <LessonPreview 
              lesson={selectedLessonQuery.data}
            />
          </div>
        </div>

        {/* Recent Lessons Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Lessons</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLessons.map((lesson: any) => (
              <Card 
                key={lesson.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{lesson.topic}</h3>
                        <p className="text-xs text-slate-600">{lesson.subject} • {lesson.gradeLevel}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Complete
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {lesson.components?.[0]?.content?.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="h-3 w-3" />
                      <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
