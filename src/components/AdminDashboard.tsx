import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { LogOut, Upload, Users, AlertTriangle, TrendingUp, Download } from 'lucide-react';
import { InvitationManagement } from './InvitationManagement';
import { DataUpload } from './DataUpload';
import { StudentTable } from './StudentTable';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ExportReports } from './ExportReports';
import logo from 'figma:asset/374a0e02cc44c0490007731c6b8a2ce74021479a.png';

export function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([
    {
      id: 1,
      studentId: '22-00005',
      name: 'Katherine Tiu',
      course: 'Computer Engineering',
      year: 2,
      section: 'BSCpE-2A',
      grades: [85, 78, 92, 76],
      essUGrade: 2.5,
      riskLevel: 'Low',
      recommendations: ['Continue current study habits', 'Consider advanced courses']
    },
    {
      id: 2,
      studentId: '22-00006',
      name: 'Mark Paolo Obina',
      course: 'Computer Engineering',
      year: 4,
      section: 'BSCpE-4A',
      grades: [72, 69, 74, 71],
      essUGrade: 3.2,
      riskLevel: 'Conditional',
      recommendations: ['Schedule tutoring sessions', 'Improve study schedule']
    },
    {
      id: 3,
      studentId: '22-00007',
      name: 'Chrristian Casaba',
      course: 'Computer Engineering',
      year: 2,
      section: 'BSCpE-2B',
      grades: [65, 62, 68, 60],
      essUGrade: 3.8,
      riskLevel: 'High',
      recommendations: ['Immediate counseling required', 'Academic probation review', 'Intensive tutoring program']
    },
    {
      id: 4,
      studentId: '22-00008',
      name: 'John Paul Salinas',
      course: 'Computer Engineering',
      year: 3,
      section: 'BSCpE-3B',
      grades: [88, 92, 85, 90],
      essUGrade: 1.75,
      riskLevel: 'Low',
      recommendations: ['Excellent performance', 'Consider honor courses']
    },
    {
      id: 5,
      studentId: '22-00009',
      name: 'Hazel Grace Senobio',
      course: 'Computer Engineering',
      year: 1,
      section: 'BSCpE-1A',
      grades: [73, 71, 75, 74],
      essUGrade: 3.0,
      riskLevel: 'Conditional',
      recommendations: ['Schedule regular meetings', 'Form study group']
    }
  ]);

  const stats = {
    totalStudents: students.length,
    lowRisk: students.filter(s => s.riskLevel === 'Low').length,
    conditionalRisk: students.filter(s => s.riskLevel === 'Conditional').length,
    highRisk: students.filter(s => s.riskLevel === 'High').length,
    averageGrade: students.reduce((sum, s) => sum + s.essUGrade, 0) / students.length
  };

  const handleDataUpload = (newStudents) => {
    setStudents(prev => [...prev, ...newStudents]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="EduTrack" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduTrack</h1>
                <p className="text-sm text-gray-500">Administrator Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invitations">Invite Faculty</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.lowRisk}</div>
                  <p className="text-xs text-muted-foreground">Performing well</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conditional</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.conditionalRisk}</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
                  <p className="text-xs text-muted-foreground">Require intervention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Data uploaded successfully</p>
                      <p className="text-xs text-muted-foreground">3 new students added to system</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">High-risk student identified</p>
                      <p className="text-xs text-muted-foreground">Christian Casaba requires immediate attention</p>
                    </div>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Monthly report generated</p>
                      <p className="text-xs text-muted-foreground">Academic performance analysis completed</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <AnalyticsDashboard students={students} />
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationManagement user={user} targetRole="faculty" />
          </TabsContent>

          <TabsContent value="students">
            <StudentTable students={students} />
          </TabsContent>

          <TabsContent value="reports">
            <ExportReports students={students} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}