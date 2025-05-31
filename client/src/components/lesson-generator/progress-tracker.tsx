import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bot, Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { LessonProgress } from "@shared/schema";

interface ProgressTrackerProps {
  progress: LessonProgress | null;
  isGenerating: boolean;
}

const agentSteps = [
  {
    name: "CurriculumExpert",
    label: "Curriculum Analysis",
    description: "Analyzing learning objectives and standards",
    progressRange: [0, 25],
  },
  {
    name: "ContentCreator",
    label: "Content Generation",
    description: "Creating engaging lesson content",
    progressRange: [25, 60],
  },
  {
    name: "AssessmentAgent",
    label: "Assessment Design",
    description: "Designing activities and assessments",
    progressRange: [60, 80],
  },
  {
    name: "QualityReviewAgent",
    label: "Quality Review",
    description: "Reviewing and optimizing lesson quality",
    progressRange: [80, 95],
  },
];

export default function ProgressTracker({ progress, isGenerating }: ProgressTrackerProps) {
  if (!isGenerating && !progress) {
    return null;
  }

  const currentProgress = progress?.progress || 0;
  const currentAgent = progress?.currentAgent || "";
  const status = progress?.status || "pending";

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStepStatus = (step: typeof agentSteps[0]) => {
    if (status === "failed") return "error";
    if (step.name === currentAgent) return "active";
    if (currentProgress >= step.progressRange[1]) return "completed";
    return "pending";
  };

  const getStepIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "active":
        return <Circle className="h-4 w-4 text-primary animate-pulse" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Lesson Generation</span>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>In Progress</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Generation Progress</span>
            <span className="text-muted-foreground">{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <Badge 
            variant={status === "completed" ? "default" : status === "failed" ? "destructive" : "secondary"}
          >
            {status === "completed" ? "Completed" : 
             status === "failed" ? "Failed" : 
             status === "in_progress" ? "In Progress" : "Pending"}
          </Badge>
          {progress?.message && (
            <span className="text-sm text-muted-foreground">{progress.message}</span>
          )}
        </div>

        {/* Agent Steps */}
        <div className="space-y-4">
          {agentSteps.map((step, index) => {
            const stepStatus = getStepStatus(step);
            
            return (
              <div key={step.name} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(stepStatus)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className={`text-sm font-medium ${
                      stepStatus === "completed" ? "text-green-700" :
                      stepStatus === "active" ? "text-primary" :
                      stepStatus === "error" ? "text-red-700" :
                      "text-muted-foreground"
                    }`}>
                      {step.label}
                    </p>
                    {stepStatus === "active" && (
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {status === "failed" && progress?.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-800">Generation Failed</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{progress.error}</p>
          </div>
        )}

        {/* Success Message */}
        {status === "completed" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-800">Generation Completed</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your lesson has been successfully generated and is ready for review.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
