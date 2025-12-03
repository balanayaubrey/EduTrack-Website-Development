import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { StudentTable } from './StudentTable';
import axios from "axios";


export function DataUpload({ onUpload }) {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // ✔ FIX: useRef for TRUE clickable file input
  const fileInputRef = useRef(null);

  const handleChooseFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const uploadToBackend = async (file) => {
  try {
    setUploadStatus("uploading");
    setProgress(30);

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:5000/api/data/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setProgress(90);

    // ✔ FIX — backend returns students, NOT inserted
    const groupedStudents = res.data.students;

    if (!Array.isArray(groupedStudents)) {
      throw new Error("Backend did not return student array");
    }

    setProcessedData(groupedStudents);
    onUpload(groupedStudents);

    setProgress(100);
    setUploadStatus("success");
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    setValidationErrors(["Upload failed. Check your Excel file format."]);
    setUploadStatus("error");
  }
};


  const convertToESSUGrade = (numericGrade) => {
    if (numericGrade >= 95) return 1.0;
    if (numericGrade >= 90) return 1.25;
    if (numericGrade >= 85) return 1.5;
    if (numericGrade >= 80) return 1.75;
    if (numericGrade >= 75) return 2.0;
    if (numericGrade >= 70) return 3.0;
    if (numericGrade >= 65) return 3.5;
    if (numericGrade >= 60) return 4.0;
    return 5.0;
  };

  const classifyRiskLevel = (essUGrade) => {
    if (essUGrade <= 3.0) return 'Low';
    if (essUGrade <= 3.5) return 'Conditional';
    return 'High';
  };

  const generateRecommendations = (riskLevel, grades) => {
    if (riskLevel === 'Low') {
      return [
        'Continue good study habits',
        'Consider advanced courses',
        'Maintain consistent performance'
      ];
    }
    if (riskLevel === 'Conditional') {
      return [
        'Improve study habits',
        'Attend tutoring sessions',
        'Meet with academic advisor'
      ];
    }
    return [
        'Immediate academic intervention needed',
        'Weekly monitoring recommended',
        'Attend intensive tutoring program'
    ];
  };

  const validateStudentData = (data) => {
    const errors = [];
    const requiredFields = ['studentId', 'name', 'course', 'year'];

    data.forEach((student, index) => {
      requiredFields.forEach((field) => {
        if (!student[field]) {
          errors.push(`Row ${index + 1}: Missing ${field}`);
        }
      });
    });

    return errors;
  };

  // SIMULATION – You will eventually replace this with your backend call
  

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) uploadToBackend(file);
};


  const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const file = e.dataTransfer.files?.[0];
  if (file) uploadToBackend(file);
};


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Student Data</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {uploadStatus === 'idle' && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

              <h3 className="text-lg font-medium mb-2">Upload Student Records</h3>
              <p className="text-gray-500 mb-4">Drag & drop CSV/Excel or click below</p>

              {/* ✔ FIXED HIDDEN INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".csv,.xlsx,.xls"
              />

              {/* ✔ FIXED BUTTON */}
              <Button onClick={handleChooseFileClick}>
                <FileText className="mr-2 h-4 w-4" />
                Choose File
              </Button>

              <p className="text-xs text-gray-400 mt-2">
                Supported: CSV, Excel (.xlsx, .xls)
              </p>
            </div>
          )}

          {/* existing success/error/progress UI remains unchanged */}
        </CardContent>
      </Card>

      {processedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentTable students={processedData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
