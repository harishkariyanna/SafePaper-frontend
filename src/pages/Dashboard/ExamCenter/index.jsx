import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import QuizIcon from "@mui/icons-material/Quiz";
import TimerIcon from "@mui/icons-material/Timer";
import DownloadIcon from "@mui/icons-material/Download";
import { jsPDF } from "jspdf";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { examService } from "../../../services/examService";

export default function ExamCenterDashboard() {
  const [loading, setLoading] = useState(true);
  const [examDetails, setExamDetails] = useState(null);
  const [error, setError] = useState(null);
  const [examTime, setExamTime] = useState(null);
  const [canRequestPaper, setCanRequestPaper] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    checkExamDetails();
  }, []);

  useEffect(() => {
    if (examDetails) {
      const examDate = new Date(examDetails.date);
      const [hours, minutes] = examDetails.startTime.split(":");
      examDate.setHours(parseInt(hours), parseInt(minutes));
      setExamTime(examDate.getTime());
    }
  }, [examDetails]);

  const checkExamDetails = async () => {
    try {
      setLoading(true);
      const response = await examService.getExamCenterDetails();
      setExamDetails(response.examDetails);
    } catch (err) {
      setError(err.message || "Failed to fetch exam details");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPaper = async () => {
    try {
      setRequesting(true);
      const response = await examService.requestPaper();
      setExamDetails(response.examDetails);
      checkExamDetails();
    } catch (err) {
      setError(err.message || "Failed to request paper");
    } finally {
      setRequesting(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add exam logo or header
    doc.setFillColor(52, 152, 219); // A nice blue color
    doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

    // Title
    doc.setFont("Poppins", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("SafePaper Exams", 20, 25);

    // Reset text color for rest of the content
    doc.setTextColor(0, 0, 0);

    // Exam Details Section
    let yPosition = 60;

    // Add a subtle background for exam details
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 45, doc.internal.pageSize.width - 30, 45, "F");

    // Exam Details
    doc.setFont("Poppins", "bold");
    doc.setFontSize(12);
    doc.text("Exam Details:", 20, yPosition);

    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    const examDate = new Date(examDetails.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create two columns for exam details
    const leftColumn = [
      `Date: ${examDate}`,
      `Start Time: ${examDetails.startTime}`,
      `End Time: ${examDetails.endTime}`,
    ];

    const rightColumn = [
      `Duration: ${examDetails.duration || "3 hours"}`,
      `Total Questions: ${examDetails.questions.length}`,
      `Total Marks: ${
        examDetails.totalMarks || examDetails.questions.length * 4
      }`,
    ];

    // Print left column
    yPosition += 8;
    leftColumn.forEach((text) => {
      doc.text(text, 20, yPosition);
      yPosition += 7;
    });

    // Print right column
    yPosition = 68;
    rightColumn.forEach((text) => {
      doc.text(text, doc.internal.pageSize.width / 2, yPosition);
      yPosition += 7;
    });

    // Instructions
    yPosition = 100;
    doc.setFont("Poppins", "bold");
    doc.setFontSize(12);
    doc.text("Instructions:", 20, yPosition);

    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    yPosition += 8;
    const instructions = [
      "1. All questions are compulsory.",
      "2. Each question carries equal marks.",
      "3. Choose the most appropriate option.",
      "4. There is no negative marking.",
      "5. Time duration must be strictly followed.",
    ];

    instructions.forEach((instruction) => {
      doc.text(instruction, 20, yPosition);
      yPosition += 7;
    });

    // Add a line before questions begin
    yPosition += 5;
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, doc.internal.pageSize.width - 20, yPosition);

    // Questions Section
    yPosition += 15;
    doc.setFont("Poppins", "bold");
    doc.setFontSize(14);
    doc.text("Questions:", 20, yPosition);
    yPosition += 10;

    // Questions and Options
    const pageHeight = doc.internal.pageSize.height;

    examDetails.questions.forEach((q, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        // Add header to new page
        doc.setFillColor(52, 152, 219);
        doc.rect(0, 0, doc.internal.pageSize.width, 20, "F");
        doc.setFont("Poppins", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text("Exam Questions (Continued)", 20, 15);
        doc.setTextColor(0, 0, 0);
        yPosition = 40;
      }

      // Question
      doc.setFont("Poppins", "bold");
      doc.setFontSize(11);
      const questionText = `${index + 1}. ${q.question}`;
      doc.text(questionText, 20, yPosition);
      yPosition += 10;

      // Options
      doc.setFont("Poppins", "normal");
      doc.setFontSize(10);
      q.options.forEach((opt, optIndex) => {
        // Check if we need a new page for options
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          // Add header to new page
          doc.setFillColor(52, 152, 219);
          doc.rect(0, 0, doc.internal.pageSize.width, 20, "F");
          doc.setFont("Poppins", "bold");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.text("Exam Questions (Continued)", 20, 15);
          doc.setTextColor(0, 0, 0);
          yPosition = 40;
        }
        const optionText = `    ${String.fromCharCode(97 + optIndex)}) ${opt}`;
        doc.text(optionText, 20, yPosition);
        yPosition += 7;
      });

      yPosition += 5; // Extra space between questions
    });

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("Poppins", "normal");
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save("question_paper.pdf");
  };

  // Countdown renderer with improved UI
  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    const isWithin5Minutes = hours === 0 && minutes < 5;
    const hasExpired = completed;

    if (!examDetails.hasDecodedQuestions) {
      setCanRequestPaper(isWithin5Minutes || hasExpired);
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center bg-white p-4 md:p-6 rounded-xl shadow-sm">
          <div className="text-center">
            <div className="bg-primary/10 rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px]">
              <Typography className="text-xl md:text-3xl font-space-grotesk font-bold text-primary">
                {hours.toString().padStart(2, "0")}
              </Typography>
              <Typography className="text-[10px] md:text-xs text-gray-600 font-poppins">
                Hours
              </Typography>
            </div>
          </div>
          <Typography className="text-xl md:text-2xl font-bold text-primary">
            :
          </Typography>
          <div className="text-center">
            <div className="bg-primary/10 rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px]">
              <Typography className="text-xl md:text-3xl font-space-grotesk font-bold text-primary">
                {minutes.toString().padStart(2, "0")}
              </Typography>
              <Typography className="text-[10px] md:text-xs text-gray-600 font-poppins">
                Minutes
              </Typography>
            </div>
          </div>
          <Typography className="text-xl md:text-2xl font-bold text-primary">
            :
          </Typography>
          <div className="text-center">
            <div className="bg-primary/10 rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px]">
              <Typography className="text-xl md:text-3xl font-space-grotesk font-bold text-primary">
                {seconds.toString().padStart(2, "0")}
              </Typography>
              <Typography className="text-[10px] md:text-xs text-gray-600 font-poppins">
                Seconds
              </Typography>
            </div>
          </div>
        </div>

        <Alert
          severity={
            hasExpired ? "warning" : isWithin5Minutes ? "success" : "info"
          }
          className={`border-2 ${
            hasExpired
              ? "border-orange-200 bg-orange-50"
              : isWithin5Minutes
              ? "border-green-200 bg-green-50"
              : "border-primary/20 bg-secondary/20"
          }`}
          icon={
            hasExpired ? (
              <TimerIcon className="text-orange-500" />
            ) : isWithin5Minutes ? (
              <TimerIcon className="text-green-500" />
            ) : (
              <AccessTimeIcon className="text-accent" />
            )
          }
        >
          <Typography className="font-poppins text-sm md:text-base">
            {hasExpired
              ? "Exam time has passed. You can still request the paper."
              : isWithin5Minutes
              ? "Questions can be requested now!"
              : "Paper can be requested within 5 minutes before exam start time"}
          </Typography>
        </Alert>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box className="space-y-6 md:space-y-8 px-4 md:px-8 pb-4 max-w-full overflow-hidden">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-4 md:p-8">
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-4">
              <SchoolIcon
                className="text-accent"
                sx={{ fontSize: { xs: 32, md: 40 }, display: { xs: 'none', md: 'block' } }} 
              />
              <Typography
                variant="h4"
                className="text-xl md:text-2xl lg:text-3xl font-space-grotesk gradient-text font-bold"
              >
                Exam Center Dashboard
              </Typography>
            </div>
            <Typography
              variant="body1"
              className="text-sm md:text-base font-poppins text-gray-600 max-w-2xl"
            >
              Access and manage secure exam papers. Questions will be available
              after successful decryption during the designated exam time
              window.
            </Typography>
          </div>
        </div>

        {/* Time Status Section */}
        {examDetails && !examDetails.hasDecodedQuestions && examTime && (
          <Paper className="p-4 md:p-8 bg-secondary hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 justify-center">
              <TimerIcon
                className="text-accent"
                sx={{ fontSize: { xs: 24, md: 32 } }}
              />
              <Typography
                variant="h6"
                className="text-lg md:text-xl font-space-grotesk font-semibold text-primary"
              >
                Time Status
              </Typography>
            </div>

            <Countdown
              date={examTime}
              renderer={countdownRenderer}
              onComplete={() => setCanRequestPaper(true)}
            />

            {canRequestPaper && (
              <Button
                variant="contained"
                onClick={handleRequestPaper}
                disabled={requesting}
                startIcon={
                  requesting ? <CircularProgress size={20} /> : <QuizIcon />
                }
                className="w-full mt-4 md:mt-6 bg-primary hover:bg-accent transition-all transform py-2 md:py-3"
              >
                {requesting ? "Requesting Paper..." : "Request Questions"}
              </Button>
            )}
          </Paper>
        )}

        {/* Download Questions Section */}
        {examDetails?.hasDecodedQuestions && examDetails.questions && (
          <Paper className="p-4 md:p-6 bg-secondary hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
              <Typography
                variant="h6"
                className="text-lg md:text-xl font-space-grotesk font-semibold text-primary flex items-center gap-2"
              >
                <QuizIcon className="text-accent" />
                Exam Questions Available
              </Typography>
              <Button
                variant="contained"
                onClick={downloadPDF}
                startIcon={<DownloadIcon />}
                className="w-full md:w-auto bg-primary hover:bg-accent transition-all transform"
              >
                Download PDF
              </Button>
            </div>
          </Paper>
        )}

        {error && (
          <Alert severity="error" className="border-2 border-red-200">
            <Typography className="text-sm md:text-base">{error}</Typography>
          </Alert>
        )}

        {!examDetails && (
          <Alert
            severity="info"
            className="bg-secondary/20 border-2 border-primary/20"
            icon={<InfoIcon className="text-accent" />}
          >
            <Typography className="text-sm md:text-base">
              There are no active exams at the moment.
            </Typography>
          </Alert>
        )}
      </Box>
    </DashboardLayout>
  );
}
