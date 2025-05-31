import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Save, Star } from "lucide-react";
import { useLessonGenerator } from "@/hooks/use-lesson-generator";

interface LessonPreviewProps {
  lesson: any;
  onSave?: () => void;
}

export default function LessonPreview({ lesson, onSave }: LessonPreviewProps) {
  const { exportLesson } = useLessonGenerator();

  if (!lesson) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No lesson generated yet</p>
        </CardContent>
      </Card>
    );
  }

  const handleExport = async (format: "json" | "markdown") => {
    if (lesson.id) {
      await exportLesson(lesson.id, format);
    }
  };

  const renderMetadata = () => (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-muted-foreground mb-3">Lesson Metadata</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Subject</p>
          <p className="text-sm">{lesson.subject}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Grade Level</p>
          <p className="text-sm">{lesson.gradeLevel}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Topic</p>
          <p className="text-sm">{lesson.topic}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Duration</p>
          <p className="text-sm">{lesson.estimatedDuration}</p>
        </div>
      </div>
      
      {lesson.learningObjectives?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Learning Objectives</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {lesson.learningObjectives.map((objective: string, index: number) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderComponents = () => {
    if (!lesson.components || !Array.isArray(lesson.components)) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No lesson components available
        </div>
      );
    }

    const sortedComponents = [...lesson.components].sort((a, b) => a.order - b.order);

    return (
      <div className="space-y-6">
        {sortedComponents.map((component: any, index: number) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <h4 className="font-semibold">{component.componentType}</h4>
              {component.metadata?.duration && (
                <Badge variant="outline" className="text-xs">
                  {component.metadata.duration}
                </Badge>
              )}
            </div>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{component.content}</p>
            </div>
            
            {/* Additional metadata */}
            {component.metadata && Object.keys(component.metadata).length > 1 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground space-y-1">
                  {component.metadata.examples && (
                    <div>
                      <span className="font-medium">Examples: </span>
                      {component.metadata.examples.join(", ")}
                    </div>
                  )}
                  {component.metadata.materials_needed && (
                    <div>
                      <span className="font-medium">Materials: </span>
                      {component.metadata.materials_needed.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-accent-600" />
            <span>Generated Lesson Preview</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("json")}
            >
              <Download className="h-4 w-4 mr-1" />
              Export JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("markdown")}
            >
              <Download className="h-4 w-4 mr-1" />
              Export MD
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Lesson
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {/* Lesson Title */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
            </div>

            {/* Metadata Section */}
            {renderMetadata()}

            <Separator />

            {/* Lesson Components */}
            {renderComponents()}

            {/* Quality Score */}
            {lesson.qualityScore && (
              <>
                <Separator />
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Lesson Quality Score</h4>
                      <p className="text-sm text-muted-foreground">AI-generated quality assessment</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-2xl font-bold text-primary">
                          {lesson.qualityScore.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
