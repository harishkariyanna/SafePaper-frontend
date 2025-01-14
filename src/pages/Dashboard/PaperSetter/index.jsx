import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TimerIcon from "@mui/icons-material/Timer";
import CreateIcon from "@mui/icons-material/Create";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import CreateQuestion from "./CreateQuestion";
import { questionService } from "../../../services/questionService";

export default function PaperSetterDashboard() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [guardians, setGuardians] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const { getGuardians } = questionService;

  const fetchGuardians = async () => {
    try {
      const response = await getGuardians();
      if (response?.data) {
        setGuardians(response.data);
        setHasSubmitted(response.hasSetQuestions || false);
      }
    } catch (error) {
      console.error("Error fetching guardians:", error);
      setError(error.message || "Failed to fetch guardians");
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, []);

  return (
    <DashboardLayout title="Paper Setter Dashboard">
      <Box className="space-y-6 md:space-y-8 px-4 md:px-8 max-w-full overflow-hidden">
        {/* Hero Section with Enhanced Gradient */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-4 md:p-8">
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-16 md:w-32 h-16 md:h-32 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-4">
              <AssignmentIcon
                className="text-accent"
                sx={{ fontSize: { xs: 32, md: 40 }, display: { xs: 'none', md: 'block' } }} 
              />
              <Typography variant="h4" className="text-xl md:text-2xl lg:text-3xl font-space-grotesk gradient-text font-bold">
                Welcome to Paper Setter Dashboard
              </Typography>
            </div>
            <Typography variant="body1" className="text-sm md:text-base font-poppins text-gray-600 max-w-2xl">
              Create and manage exam questions with our secure, encrypted system. Your questions 
              will be protected using advanced cryptographic techniques and distributed among 
              trusted guardians.
            </Typography>
          </div>
        </div>

        {!showCreateQuestion && !hasSubmitted && (
          <>
            {/* Enhanced Process Steps */}
            <Paper className="p-4 md:p-8 bg-secondary relative overflow-hidden">
              <div className="absolute right-0 top-0 w-16 md:w-32 h-16 md:h-32 bg-accent/5 rounded-bl-full" />
              <Typography
                variant="h5"
                className="text-lg md:text-xl font-space-grotesk font-semibold mb-4 md:mb-6 gradient-text flex items-center gap-2"
              >
                <InfoIcon className="text-accent" />
                Question Setting Process
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative mt-4 md:mt-6">
                {[
                  {
                    step: "1",
                    title: "Create Questions",
                    desc: "Add minimum 3 questions with 4 options each",
                    icon: <CreateIcon className="text-accent" />,
                  },
                  {
                    step: "2",
                    title: "Select Guardians",
                    desc: "Choose 3 trusted guardians for key distribution",
                    icon: <SecurityIcon className="text-accent" />,
                  },
                  {
                    step: "3",
                    title: "Submit Securely",
                    desc: "Questions are encrypted and distributed",
                    icon: <LockIcon className="text-accent" />,
                  },
                ].map((item, index) => (
                  <div key={item.step} className="relative">
                    <Paper className="p-4 md:p-6 bg-secondary bg-opacity-30 border-l-4 border-l-accent hover:shadow-lg transition-all">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        {item.icon}
                        <div>
                          <Typography
                            variant="h6"
                            className="text-base md:text-lg font-space-grotesk font-semibold text-primary"
                          >
                            Step {item.step}: {item.title}
                          </Typography>
                          <Typography variant="body2" className="text-sm md:text-base text-gray-600">
                            {item.desc}
                          </Typography>
                        </div>
                      </div>
                    </Paper>
                  </div>
                ))}
              </div>
            </Paper>

            {/* Important Instructions */}
            <Paper className="p-4 md:p-8 bg-secondary border border-primary/10">
              <Typography
                variant="h6"
                className="text-lg md:text-xl font-space-grotesk font-semibold flex items-center gap-2 text-primary mb-4 md:mb-6"
              >
                <WarningIcon className="text-accent" />
                Important Instructions
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  {[
                    "Questions should be clear and unambiguous",
                    "Each question must have exactly 4 options",
                    "Minimum 3 questions are required",
                  ].map((text, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="text-accent mt-1 flex-shrink-0" sx={{ fontSize: { xs: 20, md: 24 } }} />
                      <Typography variant="body2" className="text-sm md:text-base">
                        {text}
                      </Typography>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    "Select 3 guardians for key distribution",
                    "Review all questions before submission",
                    "Questions cannot be modified after submission",
                  ].map((text, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="text-accent mt-1 flex-shrink-0" sx={{ fontSize: { xs: 20, md: 24 } }} />
                      <Typography variant="body2" className="text-sm md:text-base">
                        {text}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </Paper>

            {/* Enhanced CTA Button */}
            <div className="text-center p-4 md:p-8 bg-secondary rounded-xl">
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowCreateQuestion(true)}
                startIcon={<CreateIcon />}
                className="bg-primary hover:bg-accent transition-all transform hover:scale-105 px-4 md:px-8 py-2 md:py-3 text-sm md:text-base"
              >
                Start Creating Questions
              </Button>
            </div>
          </>
        )}

        {/* Error Alerts */}
        {error && (
          <Alert severity="error" className="mb-4 md:mb-6 border border-red-200">
            <Typography className="text-sm md:text-base">{error}</Typography>
          </Alert>
        )}

        {/* Question Creation Form */}
        {showCreateQuestion && !hasSubmitted && guardians.length > 0 && (
          <div className="w-full md:max-w-5xl mx-auto flex flex-col gap-4">
            <Button
              onClick={() => setShowCreateQuestion(false)}
              variant="outlined"
              className="mb-4 md:mb-6 w-fit text-sm md:text-base"
            >
              Back to Instructions
            </Button>
            <CreateQuestion
              onSuccess={() => setHasSubmitted(true)}
              guardians={guardians}
            />
          </div>
        )}

        {/* Success State */}
        {hasSubmitted && (
          <Alert
            severity="success"
            className="bg-secondary/20 border border-primary/20"
            icon={<AssignmentIcon />}
          >
            <Typography className="text-sm md:text-base">
              You have successfully submitted your questions. Thank you for your contribution!
            </Typography>
          </Alert>
        )}
      </Box>
    </DashboardLayout>
  );
}
