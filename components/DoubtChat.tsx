
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Upload, Send, Bot, User, FileText, Image } from 'lucide-react';

const DoubtChat = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'user',
      message: 'Can you explain the concept of derivatives in calculus?',
      timestamp: '2024-01-12 10:30',
      subject: 'Mathematics'
    },
    {
      id: 2,
      type: 'ai',
      message: 'Derivatives measure the rate of change of a function. Think of it as the slope of a curve at any given point. For example, if you have a function f(x) = x², the derivative f\'(x) = 2x tells you how fast the function is changing at any point x.',
      timestamp: '2024-01-12 10:31',
      subject: 'Mathematics'
    }
  ]);

  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'biology', name: 'Biology' }
  ];

  const handleSendMessage = () => {
    if (currentMessage.trim() && selectedSubject) {
      const newMessage = {
        id: chatHistory.length + 1,
        type: 'user' as const,
        message: currentMessage,
        timestamp: new Date().toLocaleString(),
        subject: subjects.find(s => s.id === selectedSubject)?.name || ''
      };
      
      setChatHistory([...chatHistory, newMessage]);
      setCurrentMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: chatHistory.length + 2,
          type: 'ai' as const,
          message: 'I understand your question. Let me help you with that. This is a simulated AI response that would provide detailed explanations based on your specific doubt.',
          timestamp: new Date().toLocaleString(),
          subject: subjects.find(s => s.id === selectedSubject)?.name || ''
        };
        setChatHistory(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleFileUpload = () => {
    console.log('File upload functionality would be implemented here');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-purple-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
              AI Doubt Solver
            </CardTitle>
            <CardDescription>
              Get instant help with your academic questions across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject Selection */}
            <div className="flex items-center space-x-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleFileUpload} className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto bg-gray-50/50 rounded-lg p-4 space-y-4">
              {chatHistory.map((chat) => (
                <div key={chat.id} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    chat.type === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {chat.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple-600" />
                      )}
                      <span className="text-xs font-medium">
                        {chat.type === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {chat.subject}
                      </Badge>
                    </div>
                    <p className={`text-sm ${chat.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                      {chat.message}
                    </p>
                    <p className={`text-xs mt-2 ${chat.type === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                      {chat.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your doubt here..."
                className="min-h-[60px] resize-none"
                disabled={!selectedSubject}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!currentMessage.trim() || !selectedSubject}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {!selectedSubject && (
              <p className="text-sm text-gray-500 text-center">
                Please select a subject to start asking questions
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Features */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
              <Image className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Voice Question
            </Button>
          </CardContent>
        </Card>

        {/* Recent Topics */}
        <Card className="bg-white/80 backdrop-blur-sm border border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Recent Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { topic: 'Quadratic Equations', subject: 'Mathematics', time: '2 hours ago' },
              { topic: 'Photosynthesis', subject: 'Biology', time: '1 day ago' },
              { topic: 'World War II', subject: 'History', time: '2 days ago' }
            ].map((item, index) => (
              <div key={index} className="p-3 bg-gray-50/80 rounded-lg cursor-pointer hover:bg-gray-100/80 transition-colors">
                <p className="font-medium text-gray-800 text-sm">{item.topic}</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="secondary" className="text-xs">{item.subject}</Badge>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Tips */}
        <Card className="bg-white/80 backdrop-blur-sm border border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">AI Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>💡 Be specific in your questions for better answers</p>
              <p>📎 Upload images of problems for visual explanations</p>
              <p>🔍 Highlight text in notes to ask targeted questions</p>
              <p>📚 Mention the chapter or topic for context</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoubtChat;
