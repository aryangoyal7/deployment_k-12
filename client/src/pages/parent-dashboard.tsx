import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCheck, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Calendar,
  MessageSquare,
  Bell,
  ArrowLeft,
  BarChart3,
  Target,
  Award,
  AlertCircle
} from "lucide-react";

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("Alex Johnson");
  
  const children = [
    { name: "Alex Johnson", grade: "Grade 10", id: 1 },
    { name: "Emma Johnson", grade: "Grade 8", id: 2 }
  ];

  const childProgress = {
    "Alex Johnson": {
      overallProgress: 75,
      completedLessons: 12,
      totalLessons: 16,
      averageScore: 87,
      weeklyStudyTime: "8h 45m",
      currentStreak: 5,
      subjects: [
        { name: "Mathematics", progress: 92, recentScore: 94 },
        { name: "Science", progress: 85, recentScore: 88 },
        { name: "English", progress: 78, recentScore: 82 },
        { name: "Social Studies", progress: 70, recentScore: 75 }
      ]
    }
  };

  const recentActivities = [
    {
      id: 1,
      child: "Alex Johnson",
      activity: "Completed Quadratic Equations lesson",
      subject: "Mathematics",
      score: 94,
      time: "2 hours ago",
      type: "lesson_completed"
    },
    {
      id: 2,
      child: "Alex Johnson", 
      activity: "Started Cell Biology module",
      subject: "Science",
      time: "Yesterday",
      type: "lesson_started"
    },
    {
      id: 3,
      child: "Emma Johnson",
      activity: "Quiz: Ancient Civilizations",
      subject: "Social Studies",
      score: 88,
      time: "2 days ago",
      type: "quiz_completed"
    }
  ];

  const communications = [
    {
      id: 1,
      from: "Mrs. Smith",
      subject: "Math Progress Update",
      message: "Alex is showing excellent progress in algebra...",
      time: "3 hours ago",
      read: false
    },
    {
      id: 2,
      from: "Mr. Johnson",
      subject: "Science Project Reminder",
      message: "Please remind Alex about the upcoming science project...",
      time: "1 day ago",
      read: true
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      date: "March 15, 2024",
      time: "3:00 PM",
      type: "meeting"
    },
    {
      id: 2,
      title: "Math Quiz",
      date: "March 18, 2024", 
      time: "10:00 AM",
      type: "assessment"
    }
  ];

  const currentProgress = childProgress[selectedChild] || childProgress["Alex Johnson"];

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
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Parent Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge variant="secondary" className="ml-2">3</Badge>
              </Button>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">Sarah Johnson</div>
                <div className="text-xs text-slate-500">Parent</div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Child Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <Button
                key={child.id}
                variant={selectedChild === child.name ? "default" : "outline"}
                onClick={() => setSelectedChild(child.name)}
                className="text-sm"
              >
                {child.name} ({child.grade})
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{currentProgress.overallProgress}%</div>
              <div className="text-xs text-slate-600">Overall Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{currentProgress.completedLessons}</div>
              <div className="text-xs text-slate-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{currentProgress.averageScore}%</div>
              <div className="text-xs text-slate-600">Avg Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{currentProgress.weeklyStudyTime}</div>
              <div className="text-xs text-slate-600">This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{currentProgress.currentStreak}</div>
              <div className="text-xs text-slate-600">Day Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{currentProgress.totalLessons}</div>
              <div className="text-xs text-slate-600">Total Lessons</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Academic Progress</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <span>{selectedChild}'s Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{currentProgress.overallProgress}%</span>
                    </div>
                    <Progress value={currentProgress.overallProgress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{currentProgress.completedLessons}</div>
                      <div className="text-xs text-slate-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-400">{currentProgress.totalLessons - currentProgress.completedLessons}</div>
                      <div className="text-xs text-slate-600">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.activity}</div>
                        <div className="text-xs text-slate-600">{activity.subject} • {activity.time}</div>
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

            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span>Subject Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentProgress.subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">Recent: {subject.recentScore}%</span>
                          <Badge variant="outline" className="text-xs">
                            {subject.progress}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
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
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Academic Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {currentProgress.subjects.map((subject, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject.name}</span>
                          <span>{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Award className="h-8 w-8 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-800">Math Champion</div>
                        <div className="text-sm text-yellow-600">Scored 90+ on 3 consecutive math lessons</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Award className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">Consistent Learner</div>
                        <div className="text-sm text-blue-600">Maintained 5-day learning streak</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <span>Messages from Teachers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {communications.map((comm) => (
                    <div key={comm.id} className={`p-4 rounded-lg border ${comm.read ? 'bg-slate-50' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{comm.from}</div>
                        <div className="text-xs text-slate-500">{comm.time}</div>
                      </div>
                      <div className="font-medium text-sm mb-1">{comm.subject}</div>
                      <div className="text-sm text-slate-600">{comm.message}</div>
                      {!comm.read && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span>Important Updates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="font-medium text-orange-800">Homework Reminder</div>
                    <div className="text-sm text-orange-600 mt-1">
                      Math assignment due tomorrow. Please ensure Alex completes the algebra problems.
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-800">Great Progress!</div>
                    <div className="text-sm text-green-600 mt-1">
                      Alex has shown significant improvement in science. Keep up the great work!
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
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${event.type === 'meeting' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-slate-600">{event.date} at {event.time}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type === 'meeting' ? 'Meeting' : 'Assessment'}
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