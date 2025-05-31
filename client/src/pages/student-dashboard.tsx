import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  PlayCircle,
  CheckCircle,
  Star,
  ArrowLeft,
  BarChart3
} from "lucide-react";
import { useLessonGenerator } from "@/hooks/use-lesson-generator";

export default function StudentDashboard() {
  const { lessonsQuery } = useLessonGenerator();
  const lessons = lessonsQuery.data || [];

  const studentStats = {
    completedLessons: 12,
    totalLessons: 18,
    currentStreak: 7,
    averageScore: 87,
    timeSpent: "24h 30m",
    achievements: 5
  };

  const upcomingLessons = [
    {
      id: 1,
      title: "Advanced Algebra",
      subject: "Mathematics",
      dueDate: "Today, 3:00 PM",
      duration: "45 min",
      difficulty: "intermediate",
      progress: 0
    },
    {
      id: 2,
      title: "Cell Biology",
      subject: "Science",
      dueDate: "Tomorrow, 10:00 AM",
      duration: "60 min",
      difficulty: "beginner",
      progress: 0
    }
  ];

  const recentActivity = [
    {
      id: 1,
      title: "Quadratic Equations",
      subject: "Mathematics",
      completedAt: "2 hours ago",
      score: 92,
      status: "completed"
    },
    {
      id: 2,
      title: "Photosynthesis",
      subject: "Science",
      completedAt: "Yesterday",
      score: 88,
      status: "completed"
    },
    {
      id: 3,
      title: "Shakespeare's Sonnets",
      subject: "English",
      completedAt: "3 days ago",
      score: 85,
      status: "completed"
    }
  ];

  const achievements = [
    { name: "Quick Learner", description: "Complete 5 lessons in a week", earned: true },
    { name: "High Scorer", description: "Score above 90% in 3 lessons", earned: true },
    { name: "Consistent", description: "Maintain a 7-day streak", earned: true },
    { name: "Explorer", description: "Try lessons from 5 different subjects", earned: false },
    { name: "Perfectionist", description: "Get 100% on any lesson", earned: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Student Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">Alex Johnson</div>
                <div className="text-xs text-slate-500">Grade 10</div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{studentStats.completedLessons}</div>
              <div className="text-xs text-slate-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{studentStats.currentStreak}</div>
              <div className="text-xs text-slate-600">Day Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{studentStats.averageScore}%</div>
              <div className="text-xs text-slate-600">Avg Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{studentStats.timeSpent}</div>
              <div className="text-xs text-slate-600">Time Spent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{studentStats.achievements}</div>
              <div className="text-xs text-slate-600">Achievements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{studentStats.totalLessons}</div>
              <div className="text-xs text-slate-600">Total Lessons</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">My Lessons</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span>Learning Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round((studentStats.completedLessons / studentStats.totalLessons) * 100)}%</span>
                    </div>
                    <Progress value={(studentStats.completedLessons / studentStats.totalLessons) * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{studentStats.completedLessons}</div>
                      <div className="text-xs text-slate-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-400">{studentStats.totalLessons - studentStats.completedLessons}</div>
                      <div className="text-xs text-slate-600">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <span>Upcoming Lessons</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{lesson.title}</div>
                        <div className="text-xs text-slate-600">{lesson.subject} • {lesson.duration}</div>
                        <div className="text-xs text-slate-500">{lesson.dueDate}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-slate-600">{activity.subject} • {activity.completedAt}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{activity.score}%</div>
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lessons.map((lesson: any) => (
                    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {lesson.difficultyLevel}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm mb-2">{lesson.topic}</h3>
                        <p className="text-xs text-slate-600 mb-3">{lesson.subject} • {lesson.gradeLevel}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{lesson.estimatedDuration}</span>
                          <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Button size="sm" className="w-full mt-3">
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Start Lesson
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span>Performance Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mathematics</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Science</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>English</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Social Studies</span>
                        <span>79%</span>
                      </div>
                      <Progress value={79} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Learning Streak</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{studentStats.currentStreak}</div>
                    <div className="text-sm text-slate-600 mb-4">Days in a row</div>
                    <div className="text-xs text-slate-500">
                      Keep it up! Your longest streak was 12 days.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${achievement.earned ? 'border-yellow-200 bg-yellow-50' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${achievement.earned ? 'bg-yellow-100' : 'bg-slate-200'}`}>
                          {achievement.earned ? (
                            <Star className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <Star className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className={`font-medium ${achievement.earned ? 'text-yellow-800' : 'text-slate-600'}`}>
                            {achievement.name}
                          </div>
                          <div className="text-sm text-slate-600">{achievement.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}