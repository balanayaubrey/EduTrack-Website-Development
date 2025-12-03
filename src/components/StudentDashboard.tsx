import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { LogOut, BookOpen, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import logo from "figma:asset/374a0e02cc44c0490007731c6b8a2ce74021479a.png";

export function StudentDashboard({ user, onLogout }) {
  const [studentData, setStudentData] = useState(null);
  const token = localStorage.getItem("edutrack_token");

  useEffect(() => {
    async function load() {
      if (!user?.student_id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/student/${user.student_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const body = await res.json();
        console.log("API RESPONSE:", body);

        if (body.ok && body.student) {
          setStudentData(body.student);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
    }

    load();
  }, [user]);

  if (!studentData) {
    return (
      <div className="p-8 text-center text-gray-700 text-lg">
        Loading student data...
      </div>
    );
  }

  const grades = studentData.grades ?? [];
  const avg = studentData.averageGrade ?? 0;
  const essu = studentData.essUGrade ?? 0;
  const risk = studentData.riskLevel ?? "Low";

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Conditional":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Only keep SUBJECT PERFORMANCE data
  const subjectChart = grades.map((g) => ({
    subject: g.subject,
    grade: g.grade
  }));

  // Grade distribution
  const distribution = {
    "90-100": grades.filter((g) => g.grade >= 90).length,
    "80-89": grades.filter((g) => g.grade >= 80 && g.grade < 90).length,
    "75-79": grades.filter((g) => g.grade >= 75 && g.grade < 80).length,
    below75: grades.filter((g) => g.grade < 75).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logo} className="h-10" />
            <div>
              <h1 className="text-xl font-bold">EduTrack</h1>
              <p className="text-sm text-gray-500">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{studentData.name}</p>
              <p className="text-xs text-gray-500">{studentData.studentId}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-1">
              Welcome back, {studentData.name}!
            </h2>

            <p className="text-blue-100">
              {studentData.course} • Year {studentData.year}
            </p>

            <Badge className={`mt-3 ${getRiskColor(risk)}`}>
              {risk} Risk Status
            </Badge>
          </CardContent>
        </Card>

        {/* Current Semester Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Current Semester Performance</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {grades.map((g, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold">{g.subject}</h4>
                    <span className="font-bold">{g.grade}%</span>
                  </div>
                  <Progress value={g.grade} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Average</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{avg}%</p>
                <p className="text-xs text-gray-500">This semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ESSU Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{essu.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Converted grade</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ONLY Subject Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="grade" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentData.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-blue-700">{rec}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Progress Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Grade Distribution</h4>
              {Object.entries(distribution).map(([range, count]) => (
                <div key={range} className="flex justify-between mb-2">
                  <span className="text-sm">{range}</span>
                  <span className="font-mono">{count}</span>
                </div>
              ))}
            </div>

            {/* Milestones */}
            <div>
              <h4 className="font-semibold mb-3">Academic Milestones</h4>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      avg >= 75 ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <span>Maintain passing grade (≥75%)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      avg >= 85 ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <span>Achieve honor grade (≥85%)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      essu <= 2.0 ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <span>ESSU Good Standing (≤2.0)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
