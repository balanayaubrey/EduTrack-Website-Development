import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { LogOut, Users, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react';
import { StudentTable } from './StudentTable';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ExportReports } from './ExportReports';
import { InvitationManagement } from './InvitationManagement';
import { DataUpload } from './DataUpload';
import logo from 'figma:asset/374a0e02cc44c0490007731c6b8a2ce74021479a.png';

export function FacultyDashboard({ user, onLogout }) {
  const [myStudents, setMyStudents] = useState([
    
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalStudents: myStudents.length,
    lowRisk: myStudents.filter(s => s.riskLevel === 'Low').length,
    conditionalRisk: myStudents.filter(s => s.riskLevel === 'Conditional').length,
    highRisk: myStudents.filter(s => s.riskLevel === 'High').length,
    averageGrade:
      myStudents.reduce((sum, s) => {
        const avg = s.grades?.reduce((a, b) => a + b, 0) / s.grades?.length || 0;
        return sum + avg;
      }, 0) / myStudents.length
  };

  const atRiskStudents = myStudents.filter(
    s => s.riskLevel === 'High' || s.riskLevel === 'Conditional'
  );

  // 🔥 FIXED – this no longer crashes
  const handleDataUpload = (newStudents) => {
  if (!Array.isArray(newStudents)) {
    console.error("Invalid data received:", newStudents);
    return;
  }

  // ✔ Replace ALL students with backend result
  setMyStudents(newStudents);
};


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="EduTrack" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduTrack</h1>
                <p className="text-sm text-gray-500">Faculty Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Faculty Member</p>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                    <p className="text-blue-100">
                      You're currently monitoring {stats.totalStudents} students.
                      {stats.highRisk + stats.conditionalRisk > 0
                        ? ` ${stats.highRisk + stats.conditionalRisk} need attention.`
                        : ' All students are performing well!'}
                    </p>
                  </div>
                  <BookOpen className="h-16 w-16 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">My Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Under your guidance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Performing Well</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.lowRisk}</div>
                  <p className="text-xs text-muted-foreground">Low risk students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.conditionalRisk}</div>
                  <p className="text-xs text-muted-foreground">Conditional</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageGrade.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Overall performance</p>
                </CardContent>
              </Card>
            </div>

            <AnalyticsDashboard students={myStudents} />
          </TabsContent>

          {/* Upload */}
          <TabsContent value="upload">
            <DataUpload onUpload={handleDataUpload} />
          </TabsContent>

          {/* Student List */}
          <TabsContent value="students">
            <StudentTable students={myStudents} />
          </TabsContent>

          {/* Invitations */}
          <TabsContent value="invitations">
            <InvitationManagement user={user} targetRole="student" />
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <ExportReports students={myStudents} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
