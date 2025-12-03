import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Download, FileText, Table, BarChart3, CheckCircle } from 'lucide-react';

export function ExportReports({ students }) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [reportType, setReportType] = useState('summary');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const courses = [...new Set(students.map(s => s.course))];
  const riskLevels = ['Low', 'Conditional', 'High'];

  const filteredStudents = students.filter(student => {
    const matchCourse =
      selectedCourses.length === 0 || selectedCourses.includes(student.course);
    const matchRisk =
      selectedRiskLevels.length === 0 || selectedRiskLevels.includes(student.riskLevel);
    return matchCourse && matchRisk;
  });

  const handleCourseChange = (course, checked) => {
    setSelectedCourses(prev =>
      checked ? [...prev, course] : prev.filter(c => c !== course)
    );
  };

  const handleRiskLevelChange = (risk, checked) => {
    setSelectedRiskLevels(prev =>
      checked ? [...prev, risk] : prev.filter(r => r !== risk)
    );
  };

  const generateReportData = () => {
    const stats = {
      totalStudents: filteredStudents.length,
      lowRisk: filteredStudents.filter(s => s.riskLevel === 'Low').length,
      conditionalRisk: filteredStudents.filter(s => s.riskLevel === 'Conditional').length,
      highRisk: filteredStudents.filter(s => s.riskLevel === 'High').length,
    };

    return {
      type: reportType,
      format: exportFormat,
      students: filteredStudents,
      stats
    };
  };

  // -------------------------------------------
  // FIXED EXPORT — REAL PDF, XLSX, CSV DOWNLOAD
  // -------------------------------------------
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus(null);

      const reportData = generateReportData();

      const res = await fetch("http://localhost:5000/api/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: exportFormat,
          students: reportData.students,
        }),
      });

      if (!res.ok) throw new Error("Export failed.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const ext =
        exportFormat === "pdf" ? "pdf" :
        exportFormat === "excel" ? "xlsx" :
        "csv";

      const a = document.createElement("a");
      a.href = url;
      a.download = `edutrack-report.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setExportStatus("success");
    } catch (err) {
      setExportStatus("error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {exportStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Report exported successfully!
          </AlertDescription>
        </Alert>
      )}

      {exportStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            Export failed. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Student Report</SelectItem>
                  <SelectItem value="risk-analysis">Risk Analysis Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Course</label>
              {courses.map(course => (
                <div key={course} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={selectedCourses.includes(course)}
                    onCheckedChange={(checked) => handleCourseChange(course, checked)}
                  />
                  <span>{course}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Filter by Risk Level</label>
              {riskLevels.map(risk => (
                <div key={risk} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={selectedRiskLevels.includes(risk)}
                    onCheckedChange={(checked) => handleRiskLevelChange(risk, checked)}
                  />
                  <span>{risk}</span>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Students included: {filteredStudents.length}</p>

            <Button
              onClick={handleExport}
              className="w-full mt-4"
              disabled={isExporting || filteredStudents.length === 0}
            >
              {isExporting ? "Generating..." : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
