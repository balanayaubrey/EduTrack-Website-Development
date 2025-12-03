const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

// ----------------------------------------
// EXPORT ROUTE
// ----------------------------------------
router.post("/export", async (req, res) => {
  try {
    const { format, students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "No data provided." });
    }

    // Normalize students for consistency
    const data = students.map((s) => ({
      studentId: s.studentId || s.student_id || "",
      name: s.name || `${s.first_name || ""} ${s.last_name || ""}`,
      course: s.course || "",
      year: s.year || "",
      averageGrade: Number(s.averageGrade || 0),
      essUGrade: Number(s.essUGrade || s.essu_grade || 0),
      riskLevel: s.riskLevel || s.risk_level || "",
      recommendations: Array.isArray(s.recommendations)
        ? s.recommendations.join(" | ")
        : "",
    }));

    // ============================
    // CSV EXPORT
    // ============================
    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(data);

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename=edutrack-report.csv`);

      return res.send(csv);
    }

    // ============================
    // EXCEL EXPORT (XLSX)
    // ============================
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("EduTrack Report");

      sheet.columns = [
        { header: "Student ID", key: "studentId", width: 15 },
        { header: "Name", key: "name", width: 25 },
        { header: "Course", key: "course", width: 25 },
        { header: "Year", key: "year", width: 10 },
        { header: "Average Grade", key: "averageGrade", width: 15 },
        { header: "ESSU Grade", key: "essUGrade", width: 12 },
        { header: "Risk Level", key: "riskLevel", width: 12 },
        { header: "Recommendations", key: "recommendations", width: 40 },
      ];

      // Add rows
      data.forEach((d) => sheet.addRow(d));

      // Style header
      sheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=edutrack-report.xlsx`
      );

      return res.send(Buffer.from(buffer));
    }

    // ============================
    // PDF EXPORT (BEAUTIFUL PDF)
    // ============================
    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=edutrack-report.pdf"
      );

      const doc = new PDFDocument({ margin: 40 });
      doc.pipe(res);

      // Title
      doc.fontSize(22).fillColor("#1e40af").text("EduTrack Student Report");
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor("#6b7280");
      doc.text(`Generated: ${new Date().toLocaleString()}`);
      doc.moveDown(1);

      // Column headers
      doc.fontSize(11).fillColor("#111827").font("Helvetica-Bold");
      doc.text("Student", 40, doc.y);
      doc.text("Course", 180, doc.y);
      doc.text("Avg %", 300, doc.y);
      doc.text("ESSU", 350, doc.y);
      doc.text("Risk", 400, doc.y);

      doc.moveTo(40, doc.y + 12)
        .lineTo(550, doc.y + 12)
        .stroke("#d1d5db");

      doc.moveDown(1);
      doc.font("Helvetica");

      let y = doc.y;

      data.forEach((s, i) => {
        if (y > 720) {
          doc.addPage();
          y = 60;
        }

        doc.fillColor("#111827").text(s.name, 40, y);
        doc.fillColor("#6b7280").fontSize(9).text(s.studentId, 40, y + 12);

        doc.fontSize(10).fillColor("#374151").text(s.course, 180, y);

        doc.text(`${s.averageGrade.toFixed(1)}%`, 300, y);
        doc.text(s.essUGrade.toFixed(2), 350, y);

        // Color logic
        let riskColor = "#6b7280";
        if (s.riskLevel === "Low") riskColor = "#10b981";
        if (s.riskLevel === "Conditional") riskColor = "#f59e0b";
        if (s.riskLevel === "High") riskColor = "#ef4444";

        doc.fillColor(riskColor).text(s.riskLevel, 400, y);

        y += 40;
      });

      doc.end();
      return;
    }

    return res.status(400).json({ error: "Invalid export format." });
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    res.status(500).json({ error: "Export failed due to server error." });
  }
});

module.exports = router;
