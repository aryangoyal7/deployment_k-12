import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  BookOpen, 
  BarChart3,
  Settings,
  Database,
  Activity,
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  FileText
} from "lucide-react";
import { useLessonGenerator } from "@/hooks/use-lesson-generator";

export default function AdminDashboard() {
  const { lessonsQuery } = useLessonGenerator();
  const lessons = lessonsQuery.data || [];

  const systemStats = {
    totalUsers: 1247,
    totalTeachers: 89,
    totalStudents: 1034,
    totalParents: 824,
    totalLessons: lessons.length,
    activeToday: 342,
    systemUptime: "99.8%",
    avgResponseTime: "1.2s"
  };

  const recentActivities = [
    {
      id: 1,
      user: "Dr. Patricia Smith",
      action: "Created AI lesson: Quadratic Equations",
      type: "lesson_created",
      time: "2 hours ago"
    },
    {
      id: 2,
      user: "Alex Johnson",
      action: "Completed Mathematics assessment",
      type: "assessment_completed",
      time: "3 hours ago"
    },
    {
      id: 3,
      user: "Sarah Wilson",
      action: "Registered new parent account",
      type: "user_registered", 
      time: "5 hours ago"
    },
    {
      id: 4,
      user: "System",
      action: "AI lesson generation service optimized",
      type: "system_update",
      time: "1 day ago"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "High API Usage",
      message: "OpenAI API usage at 85% of monthly limit",
      time: "1 hour ago"
    },
    {
      id: 2,
      type: "info",
      title: "System Backup Complete",
      message: "Daily backup completed successfully",
      time: "2 hours ago"
    },
    {
      id: 3,
      type: "success",
      title: "Performance Optimization",
      message: "Lesson generation speed improved by 15%",
      time: "1 day ago"
    }
  ];

  const userGrowth = [
    { month: "Jan", users: 950 },
    { month: "Feb", users: 1050 },
    { month: "Mar", users: 1247 }
  ];

  const topPerformingClasses = [
    { name: "Mathematics Grade 10A", teacher: "Dr. Patricia Smith", avgScore: 94, students: 28 },
    { name: "Advanced Science", teacher: "Mr. Robert Johnson", avgScore: 91, students: 22 },
    { name: "English Literature", teacher: "Ms. Emily Davis", avgScore: 89, students: 25 }
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
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Admin Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">Administrator</div>
                <div className="text-xs text-slate-500">System Admin</div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{systemStats.totalUsers}</div>
              <div className="text-xs text-slate-600">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{systemStats.totalTeachers}</div>
              <div className="text-xs text-slate-600">Teachers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{systemStats.totalStudents}</div>
              <div className="text-xs text-slate-600">Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{systemStats.totalParents}</div>
              <div className="text-xs text-slate-600">Parents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{systemStats.totalLessons}</div>
              <div className="text-xs text-slate-600">AI Lessons</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{systemStats.activeToday}</div>
              <div className="text-xs text-slate-600">Active Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-600">{systemStats.systemUptime}</div>
              <div className="text-xs text-slate-600">Uptime</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{systemStats.avgResponseTime}</div>
              <div className="text-xs text-slate-600">Response</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>System Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${
                      alert.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                      alert.type === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {alert.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                        ) : alert.type === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                          <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-slate-600">{alert.message}</div>
                          <div className="text-xs text-slate-500 mt-1">{alert.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Recent Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'lesson_created' ? 'bg-purple-500' :
                        activity.type === 'assessment_completed' ? 'bg-green-500' :
                        activity.type === 'user_registered' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.user}</div>
                        <div className="text-xs text-slate-600">{activity.action}</div>
                        <div className="text-xs text-slate-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Top Performing Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingClasses.map((classInfo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{classInfo.name}</div>
                          <div className="text-sm text-slate-600">{classInfo.teacher} • {classInfo.students} students</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">{classInfo.avgScore}%</div>
                        <div className="text-xs text-slate-600">Average Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>User Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{systemStats.totalTeachers}</div>
                      <div className="text-sm text-blue-800">Teachers</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{systemStats.totalStudents}</div>
                      <div className="text-sm text-green-800">Students</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{systemStats.totalParents}</div>
                    <div className="text-sm text-purple-800">Parents</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-green-500" />
                    <span>User Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userGrowth.map((month, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{month.month} 2024</span>
                        <span className="font-semibold">{month.users}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <span>AI-Generated Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total AI Lessons</span>
                    <span className="font-semibold">{systemStats.totalLessons}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Lessons This Week</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Quality Score</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Usage (OpenAI)</span>
                    <Badge variant="outline">85% of limit</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    <span>Content Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mathematics</span>
                        <span>45 lessons</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Science</span>
                        <span>32 lessons</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>English</span>
                        <span>28 lessons</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <span>Platform Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Daily Active Users</span>
                    <span className="font-semibold">{systemStats.activeToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Lesson Completion Rate</span>
                    <span className="font-semibold">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Session Time</span>
                    <span className="font-semibold">24 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>User Satisfaction</span>
                    <span className="font-semibold">4.7/5</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    <span>Cost Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly AI Costs</span>
                    <span className="font-semibold">$2,340</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cost per Lesson</span>
                    <span className="font-semibold">$0.85</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Infrastructure</span>
                    <span className="font-semibold">$890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Monthly</span>
                    <span className="font-semibold">$3,230</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>System Uptime</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {systemStats.systemUptime}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {systemStats.avgResponseTime}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Service Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <span>Resource Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU Usage</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Usage</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage Usage</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage User Roles
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Database Settings
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    API Configuration
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}