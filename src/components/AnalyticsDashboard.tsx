import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';

export function AnalyticsDashboard({ students }) {
  // Risk distribution data
  const riskData = [
    {
      name: 'Low Risk',
      value: students.filter(s => s.riskLevel === 'Low').length,
      color: '#10b981'
    },
    {
      name: 'Conditional',
      value: students.filter(s => s.riskLevel === 'Conditional').length,
      color: '#f59e0b'
    },
    {
      name: 'High Risk',
      value: students.filter(s => s.riskLevel === 'High').length,
      color: '#ef4444'
    }
  ];

  // Course performance data
  const courseData = students.reduce((acc, student) => {
    const course = student.course;
    if (!acc[course]) {
      acc[course] = { course, students: [], avgGrade: 0, lowRisk: 0, conditionalRisk: 0, highRisk: 0 };
    }
    acc[course].students.push(student);
    
    // Count risk levels
    if (student.riskLevel === 'Low') acc[course].lowRisk++;
    else if (student.riskLevel === 'Conditional') acc[course].conditionalRisk++;
    else acc[course].highRisk++;
    
    return acc;
  }, {});

  const coursePerformance = Object.values(courseData).map(data => ({
    course: data.course,
    total: data.students.length,
    avgGrade: data.students.reduce((sum, s) => sum + (s.grades?.reduce((a, b) => a + b, 0) / s.grades?.length || 0), 0) / data.students.length,
    lowRisk: data.lowRisk,
    conditionalRisk: data.conditionalRisk,
    highRisk: data.highRisk
  }));

  // Year level performance
  const yearData = students.reduce((acc, student) => {
    const year = `Year ${student.year}`;
    if (!acc[year]) {
      acc[year] = { year, students: [], avgGrade: 0, riskCounts: { Low: 0, Conditional: 0, High: 0 } };
    }
    acc[year].students.push(student);
    acc[year].riskCounts[student.riskLevel]++;
    return acc;
  }, {});

  const yearPerformance = Object.values(yearData).map(data => ({
    year: data.year,
    total: data.students.length,
    avgGrade: data.students.reduce((sum, s) => sum + (s.grades?.reduce((a, b) => a + b, 0) / s.grades?.length || 0), 0) / data.students.length,
    lowRisk: data.riskCounts.Low,
    conditionalRisk: data.riskCounts.Conditional,
    highRisk: data.riskCounts.High
  }));

  // Grade distribution data
  const gradeDistribution = [];
  const gradeRanges = [
    { range: '90-100', min: 90, max: 100 },
    { range: '80-89', min: 80, max: 90 },
    { range: '70-79', min: 70, max: 80 },
    { range: '60-69', min: 60, max: 70 },
    { range: 'Below 60', min: 0, max: 60 }
  ];

  gradeRanges.forEach(({ range, min, max }) => {
    const count = students.filter(student => {
      const avgGrade = student.grades?.reduce((a, b) => a + b, 0) / student.grades?.length || 0;
      return avgGrade >= min && avgGrade < max;
    }).length;
    gradeDistribution.push({ range, count });
  });

  // Trend data (simulated historical data)
  const trendData = [
    { month: 'Jan', lowRisk: 45, conditionalRisk: 25, highRisk: 15 },
    { month: 'Feb', lowRisk: 48, conditionalRisk: 22, highRisk: 12 },
    { month: 'Mar', lowRisk: 52, conditionalRisk: 20, highRisk: 10 },
    { month: 'Apr', lowRisk: 55, conditionalRisk: 18, highRisk: 8 },
    { month: 'May', lowRisk: 58, conditionalRisk: 15, highRisk: 7 },
    { month: 'Jun', lowRisk: 60, conditionalRisk: 12, highRisk: 5 }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {riskData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lowRisk" stackId="a" fill="#10b981" name="Low Risk" />
                <Bar dataKey="conditionalRisk" stackId="a" fill="#f59e0b" name="Conditional" />
                <Bar dataKey="highRisk" stackId="a" fill="#ef4444" name="High Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}