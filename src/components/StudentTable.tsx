import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function StudentTable({ students }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Normalize backend → frontend fields
  const normalize = (s) => ({
    id: s.id || s.student_id,
    studentId: s.studentId || s.student_id || "",
    name: s.name || `${s.first_name || ""} ${s.last_name || ""}`.trim(),
    course: s.course || "",
    year: Number(s.year) || "",
    essUGrade: Number(s.essUGrade || s.essu_grade || 0),
    riskLevel: s.riskLevel || s.risk_level || "",
    grades: s.grades || s.raw_grades || [],
    recommendations: s.recommendations || [],
  });

  const normalized = students.map(normalize);

  const filteredStudents = normalized.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk =
      riskFilter === 'all' || student.riskLevel.toLowerCase() === riskFilter;

    const matchesYear =
      yearFilter === 'all' || student.year.toString() === yearFilter;

    return matchesSearch && matchesRisk && matchesYear;
  });

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'conditional': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'conditional': return <Clock className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "bg-green-100 text-green-800 border-green-300";
    if (grade >= 80) return "bg-blue-100 text-blue-800 border-blue-300";
    if (grade >= 75) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getGradeDisplay = (grades) => {
    if (!grades || grades.length === 0) return 'N/A';
    const avg = grades.reduce((sum, g) => sum + Number(g), 0) / grades.length;
    return avg.toFixed(1);
  };

  return (
    <div className="space-y-4">
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, ID, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Year Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="1">Year 1</SelectItem>
            <SelectItem value="2">Year 2</SelectItem>
            <SelectItem value="3">Year 3</SelectItem>
            <SelectItem value="4">Year 4</SelectItem>
            <SelectItem value="5">Year 5</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="conditional">Conditional</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredStudents.length} of {normalized.length} students
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Info</TableHead>
                  <TableHead>Course & Year</TableHead>
                  <TableHead>Average Grade</TableHead>
                  <TableHead>ESSU Grade</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.studentId}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{student.course}</div>
                        <div className="text-sm text-gray-500">Year {student.year}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-sm">
                        {getGradeDisplay(student.grades)}%
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-sm font-medium">
                        {student.essUGrade.toFixed(2)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getRiskColor(student.riskLevel)} flex items-center space-x-1`}
                      >
                        {getRiskIcon(student.riskLevel)}
                        <span>{student.riskLevel}</span>
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Student Details - {student.name}</DialogTitle>
                            <DialogDescription>
                              View detailed information about the student's academic performance, risk assessment, and recommendations.
                            </DialogDescription>
                          </DialogHeader>

                          {selectedStudent && (
                            <div className="space-y-6">
                              
                              {/* Basic Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm text-gray-500">Student ID</label>
                                  <p className="font-mono">{selectedStudent.studentId}</p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">Name</label>
                                  <p>{selectedStudent.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">Course</label>
                                  <p>{selectedStudent.course}</p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">Year Level</label>
                                  <p>Year {selectedStudent.year}</p>
                                </div>
                              </div>

                              {/* 🔥 Color-Coded Grades */}
                              <div>
                                <label className="text-sm text-gray-500">Grades</label>

                                <div className="grid grid-cols-3 gap-3 mt-2">
                                  {selectedStudent.grades?.map((g, i) => {
                                    const grade = Number(g);
                                    return (
                                      <div
                                        key={i}
                                        className={`p-3 rounded-lg border text-center font-medium ${getGradeColor(
                                          grade
                                        )}`}
                                      >
                                        <div className="text-xs opacity-70">Subject {i + 1}</div>
                                        <div className="text-lg">{grade}%</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Risk */}
                              <div>
                                <label className="text-sm text-gray-500">Risk Assessment</label>
                                <Badge
                                  variant="outline"
                                  className={`${getRiskColor(selectedStudent.riskLevel)} flex items-center space-x-1 mt-2`}
                                >
                                  {getRiskIcon(selectedStudent.riskLevel)}
                                  <span>{selectedStudent.riskLevel} Risk</span>
                                </Badge>
                              </div>

                              {/* 🔥 Highlighted Recommendations */}
                              {selectedStudent.recommendations?.length > 0 && (
                                <div>
                                  <label className="text-sm text-gray-500">Recommendations</label>

                                  <div className="space-y-3 mt-3">
                                    {selectedStudent.recommendations.map((rec, i) => (
                                      <div
                                        key={i}
                                        className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200 shadow-sm"
                                      >
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <p className="text-sm text-blue-900">{rec}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
