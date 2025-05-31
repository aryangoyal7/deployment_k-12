import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Wand2 } from "lucide-react";
import { LessonGenerationRequest } from "@shared/schema";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  topic: z.string().min(1, "Topic is required"),
  subtopicsText: z.string().min(1, "At least one subtopic is required"),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedDuration: z.string().min(1, "Duration is required"),
});

type FormData = z.infer<typeof formSchema>;

interface LessonFormProps {
  onSubmit: (data: LessonGenerationRequest) => void;
  isLoading?: boolean;
}

export default function LessonForm({ onSubmit, isLoading = false }: LessonFormProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      topic: "",
      subtopicsText: "",
      difficultyLevel: "intermediate",
      estimatedDuration: "45 minutes",
    },
  });

  const handleSubmit = (data: FormData) => {
    const subtopics = data.subtopicsText
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const request: LessonGenerationRequest = {
      subject: data.subject,
      gradeLevel: data.gradeLevel,
      topic: data.topic,
      subtopics,
      difficultyLevel: data.difficultyLevel,
      estimatedDuration: data.estimatedDuration,
      curriculumDocumentIds: [],
    };

    onSubmit(request);
  };

  const difficultyButtons = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ] as const;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-primary" />
          <span>Lesson Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="social-studies">Social Studies</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="grade-8">Grade 8</SelectItem>
                        <SelectItem value="grade-9">Grade 9</SelectItem>
                        <SelectItem value="grade-10">Grade 10</SelectItem>
                        <SelectItem value="grade-11">Grade 11</SelectItem>
                        <SelectItem value="grade-12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Quadratic Equations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtopicsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtopics</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List specific subtopics (one per line)&#10;Standard form&#10;Factoring methods&#10;Graphing parabolas&#10;Real-world applications"
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Difficulty Level</FormLabel>
                <div className="flex space-x-2 mt-2">
                  {difficultyButtons.map((difficulty) => (
                    <Button
                      key={difficulty.value}
                      type="button"
                      variant={selectedDifficulty === difficulty.value ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedDifficulty(difficulty.value);
                        form.setValue("difficultyLevel", difficulty.value);
                      }}
                    >
                      {difficulty.label}
                    </Button>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30 minutes">30 minutes</SelectItem>
                        <SelectItem value="45 minutes">45 minutes</SelectItem>
                        <SelectItem value="60 minutes">60 minutes</SelectItem>
                        <SelectItem value="90 minutes">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium py-3"
              disabled={isLoading}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isLoading ? "Generating Lesson..." : "Generate Lesson"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
