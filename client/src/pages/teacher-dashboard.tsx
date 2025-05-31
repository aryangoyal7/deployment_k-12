import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users2, 
  BookOpen, 
  Wand2, 
  BarChart3,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Download,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";
import { useLessonGenerator } from "@/hooks/use-lesson-generator";

export default function TeacherDashboard() {
  const { lessonsQuery } = useLessonGenerator();
  const lessons = lessonsQuery.data || [];

  const teacherStats = {
    totalLessons: lessons.length,
    totalStudents: 34,
    activeClasses: 3,
    avgClassScore: 86,
    lessonsThisWeek: 5,
    completionRate: 92
  };

  const myClasses = [
    {
      id: 1,
      name: "Mathematics Grade 10A",
      students: 28,
      subject: "Mathematics",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      avgScore: 87,
      completionRate: 94
    },
    {
      id: 2,
      name: "Mathematics Grade 10B", 
      students: 25,
      subject: "Mathematics",
      schedule: "Tue, Thu - 11:00 AM",
      avgScore: 82,
      completionRate: 89
    },
    {
      id: 3,
      name: "Advanced Calculus",
      students: 18,
      subject: "Mathematics",
      schedule: "Mon, Wed - 2:00 PM",
      avgScore: 91,
      completionRate: 96
    }
  ];

  const recentStudentActivity = [
    {
      id: 1,
      student: "Alex Johnson",
      class: "Mathematics Grade 10A",
      activity: "Completed Quadratic Equations",
      score: 94,
      time: "2 hours ago"
    },
    {
      id: 2,
      student: "Emma Wilson",
      class: "Mathematics Grade 10B",
      activity: "Started Linear Functions",
      time: "4 hours ago"
    },
    {
      id: 3,
      student: "Michael Brown",
      class: "Advanced Calculus",
      activity: "Quiz: Derivatives",
      score: 88,
      time: "Yesterday"
    }
  ];

  const upcomingSchedule = [
    {
      id: 1,
      class: "Mathematics Grade 10A",
      topic: "Polynomial Functions",
      time: "Tomorrow, 9:00 AM",
      duration: "50 min",
      type: "lesson"
    },
    {
      id: 2,
      class: "Mathematics Grade 10B",
      topic: "Mid-term Assessment",
      time: "Friday, 11:00 AM", 
      duration: "90 min",
      type: "assessment"
    }
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Teacher Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/lesson-generator">
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Create Lesson
                </Button>
              </Link>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">Dr. Patricia Smith</div>
                <div className="text-xs text-slate-500">Mathematics Teacher</div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{teacherStats.totalLessons}</div>
              <div className="text-xs text-slate-600">Total Lessons</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{teacherStats.totalStudents}</div>
              <div className="text-xs text-slate-600">Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{teacherStats.activeClasses}</div>
              <div className="text-xs text-slate-600">Classes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{teacherStats.avgClassScore}%</div>
              <div className="text-xs text-slate-600">Avg Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{teacherStats.lessonsThisWeek}</div>
              <div className="text-xs text-slate-600">This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{teacherStats.completionRate}%</div>
              <div className="text-xs text-slate-600">Completion</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">My Lessons</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wand2 className="h-5 w-5 text-purple-500" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/lesson-generator">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New AI Lesson
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Class Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Students/Parents
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Assessment
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Student Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Recent Student Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentStudentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.student}</div>
                        <div className="text-xs text-slate-600">{activity.activity}</div>
                        <div className="text-xs text-slate-500">{activity.class} • {activity.time}</div>
                      </div>
                      {activity.score && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.score}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Class Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span>Class Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myClasses.map((classInfo) => (
                    <div key={classInfo.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{classInfo.name}</div>
                          <div className="text-sm text-slate-600">{classInfo.students} students • {classInfo.schedule}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">{classInfo.avgScore}%</div>
                          <div className="text-xs text-slate-600">Avg Score</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion Rate</span>
                            <span>{classInfo.completionRate}%</span>
                          </div>
                          <Progress value={classInfo.completionRate} className="h-2" />
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My AI-Generated Lessons</h3>
              <Link href="/lesson-generator">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Lesson
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson: any) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {lesson.difficultyLevel}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{lesson.topic}</h3>
                    <p className="text-sm text-slate-600 mb-3">{lesson.subject} • {lesson.gradeLevel}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span>{lesson.estimatedDuration}</span>
                      <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myClasses.map((classInfo) => (
                    <Card key={classInfo.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{classInfo.name}</h3>
                            <p className="text-slate-600">{classInfo.schedule}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">{classInfo.students}</div>
                            <div className="text-xs text-slate-600">Students</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-slate-600">Average Score</div>
                            <div className="text-xl font-semibold">{classInfo.avgScore}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-600">Completion Rate</div>
                            <div className="text-xl font-semibold">{classInfo.completionRate}%</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Students
                          </Button>
                          <Button size="sm" variant="outline">
                            Send Message
                          </Button>
                          <Button size="sm" variant="outline">
                            Class Analytics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Performance Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {myClasses.map((classInfo, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{classInfo.name}</span>
                          <span>{classInfo.avgScore}%</span>
                        </div>
                        <Progress value={classInfo.avgScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span>Lesson Usage Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Lessons Created</span>
                      <span className="font-semibold">{lessons.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lessons Used This Week</span>
                      <span className="font-semibold">{teacherStats.lessonsThisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Student Engagement Rate</span>
                      <span className="font-semibold">{teacherStats.completionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span>Upcoming Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSchedule.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.type === 'lesson' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        <div>
                          <div className="font-medium">{item.topic}</div>
                          <div className="text-sm text-slate-600">{item.class}</div>
                          <div className="text-sm text-slate-500">{item.time} • {item.duration}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type === 'lesson' ? 'Lesson' : 'Assessment'}
                      </Badge>
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