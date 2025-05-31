import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Wand2,
  User,
  UserCheck,
  Shield,
  Users2,
  ArrowRight
} from "lucide-react";

export default function Index() {
  const [userRole, setUserRole] = useState<string | null>(null);

  const roleCards = [
    {
      role: "student",
      title: "Student Portal",
      description: "Access your personalized learning dashboard, track progress, and engage with AI-generated lessons.",
      icon: User,
      path: "/student-dashboard",
      color: "from-blue-500 to-blue-600",
      features: ["Personal Dashboard", "Progress Tracking", "Interactive Lessons", "Performance Analytics"]
    },
    {
      role: "parent",
      title: "Parent Portal",
      description: "Monitor your child's educational progress and stay connected with their learning journey.",
      icon: UserCheck,
      path: "/parent-dashboard", 
      color: "from-green-500 to-green-600",
      features: ["Child Progress Reports", "Communication Tools", "Learning Insights", "Goal Setting"]
    },
    {
      role: "teacher",
      title: "Teacher Portal",
      description: "Create and manage AI-powered lessons, track student progress, and enhance teaching effectiveness.",
      icon: Users2,
      path: "/teacher-dashboard",
      color: "from-purple-500 to-purple-600",
      features: ["AI Lesson Generator", "Class Management", "Student Analytics", "Curriculum Planning"]
    },
    {
      role: "admin",
      title: "Administrator Portal",
      description: "Oversee educational operations, manage users, and access comprehensive system analytics.",
      icon: Shield,
      path: "/admin-dashboard",
      color: "from-red-500 to-red-600",
      features: ["User Management", "System Analytics", "Content Oversight", "Platform Administration"]
    }
  ];

  const stats = [
    { label: "AI-Generated Lessons", value: "1,200+", icon: Wand2 },
    { label: "Active Students", value: "15,000+", icon: Users },
    { label: "Learning Topics", value: "500+", icon: BookOpen },
    { label: "Success Rate", value: "95%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">EduGenius</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/lesson-generator">
                <Button variant="outline" className="text-sm">
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Lesson Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            AI-Powered Education
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent block">
              Platform
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Revolutionizing education with intelligent lesson generation, personalized learning paths, 
            and comprehensive analytics for students, teachers, parents, and administrators.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Portal</h2>
            <p className="text-lg text-slate-600">
              Select your role to access personalized features and dashboards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roleCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Card 
                  key={card.role} 
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer"
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 text-center">
                      {card.description}
                    </p>
                    
                    <div className="space-y-2">
                      {card.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-slate-500">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link href={card.path}>
                      <Button className="w-full mt-4 group">
                        Access Portal
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Lesson Generator Highlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <div className="max-w-7xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    <Wand2 className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    Intelligent Lesson Generator
                  </h3>
                  <p className="text-lg text-slate-600 mb-6">
                    Create comprehensive, CBSE-aligned lessons in minutes using our multi-agent AI system. 
                    Generate curriculum analysis, engaging content, interactive activities, and assessments automatically.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">4</div>
                      <div className="text-sm text-slate-600">AI Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">GPT-4</div>
                      <div className="text-sm text-slate-600">Powered</div>
                    </div>
                  </div>
                  <Link href="/lesson-generator">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                      <Wand2 className="h-5 w-5 mr-2" />
                      Try Lesson Generator
                    </Button>
                  </Link>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Curriculum Expert Analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Content Creation & Activities</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Assessment Design</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Quality Review & Optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">EduGenius</span>
          </div>
          <p className="text-slate-400">
            Empowering education through artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}