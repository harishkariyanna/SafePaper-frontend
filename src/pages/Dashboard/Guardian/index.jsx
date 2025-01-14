import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { examService } from "../../../services/examService";

export default function GuardianDashboard() {
  const [loading, setLoading] = useState(true);
  const [examStatus, setExamStatus] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    try {
      setLoading(true);
      const response = await examService.checkKeyStatus();
      console.log(response);
      setExamStatus(response.status);
      setHasSubmitted(response.hasSubmitted);
      setExamDetails(response.examDetails);
    } catch (err) {
      setError(err.message || "Failed to check key status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitKey = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setRequesting(true);

    try {
      console.log(key);
      const response = await examService.submitGuardianKey({ key });
      if (response.success) {
        setSuccess(true);
        setKey("");
        checkKeyStatus();
      }
    } catch (err) {
      setError(err.message || "Failed to submit key");
    } finally {
      setRequesting(false);
    }
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
      <Box className="space-y-8 w-full">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <SecurityIcon
                className="text-accent"
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  display: { xs: "none", md: "block" },
                }}
              />
              <Typography variant="h4" className="gradient-text font-bold">
                Guardian Dashboard
              </Typography>
            </div>
            <Typography variant="body1" className="text-gray-600 max-w-2xl">
              As a trusted guardian, you play a crucial role in securing the
              exam process. Your key share helps protect and decrypt exam
              questions at the designated time.
            </Typography>
          </div>
        </div>
        {/* Exam Details Section */}
        {examDetails && (
          <Paper className="p-6 bg-secondary hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <p
                variant="h6"
                className="font-bold text-lg md:text-2xl font-space-grotesk text-primary flex items-center gap-2"
              >
                Current Exam Details
              </p>
              <Chip
                label={examDetails.status}
                color={examDetails.status === "active" ? "success" : "default"}
                variant="outlined"
                className="border-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 bg-secondary bg-opacity-30 p-4 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <AccessTimeIcon className="text-primary" />
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography className="font-medium">
                    {new Date(examDetails.date).toLocaleDateString()}
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-secondary bg-opacity-30 p-4 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <AccessTimeIcon className="text-primary" />
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">
                    Time
                  </Typography>
                  <Typography className="font-medium">
                    {examDetails.startTime} - {examDetails.endTime}
                  </Typography>
                </div>
              </div>
            </div>

            {!hasSubmitted ? (
              <div className="md:p-6 bg-secondary bg-opacity-30">
                <Typography
                  variant="h6"
                  className="font-semibold mb-4 text-primary flex items-center gap-2"
                >
                  <LockIcon className="text-accent" />
                  Submit Your Key
                </Typography>

                {error && (
                  <Alert severity="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" className="mb-4">
                    Key submitted successfully
                  </Alert>
                )}

                <form onSubmit={handleSubmitKey} className="space-y-4 mt-4">
                  <TextField
                    fullWidth
                    label="Secret Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                    className="bg-secondary/10"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className="bg-primary hover:bg-accent transition-all transform"
                    startIcon={
                      requesting ? <CircularProgress size={20} /> : <LockIcon />
                    }
                    disabled={requesting}
                  >
                    {requesting ? "Submitting..." : "Submit Key"}
                  </Button>
                </form>
              </div>
            ) : (
              <Alert
                severity="info"
                className="bg-secondary/20 border-2 border-primary/20"
              >
                You have already submitted your key. Thank you!
              </Alert>
            )}
          </Paper>
        )}

        {/* Guardian Role Cards */}
        {!hasSubmitted && (
          <Paper className="p-8 bg-secondary relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-bl-full" />
            <Typography
              variant="h5"
              className="font-semibold mb-6 gradient-text flex items-center gap-2"
            >
              <InfoIcon className="text-accent" />
              Your Responsibilities
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Paper className="p-6 bg-secondary bg-opacity-30 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
                <LockIcon className="text-primary mb-4" sx={{ fontSize: 32 }} />
                <Typography
                  variant="h6"
                  className="font-semibold mb-2 text-primary"
                >
                  Key Management
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Store your key share securely until the exam time
                </Typography>
              </Paper>

              <Paper className="p-6 bg-secondary bg-opacity-30 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
                <AccessTimeIcon
                  className="text-primary mb-4"
                  sx={{ fontSize: 32 }}
                />
                <Typography
                  variant="h6"
                  className="font-semibold mb-2 text-primary"
                >
                  Timely Submission
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Submit your key share during the designated time window
                </Typography>
              </Paper>

              <Paper className="p-6 bg-secondary bg-opacity-30 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
                <SecurityIcon
                  className="text-primary mb-4"
                  sx={{ fontSize: 32 }}
                />
                <Typography
                  variant="h6"
                  className="font-semibold mb-2 text-primary"
                >
                  Security Protocol
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Follow security protocols to maintain exam integrity
                </Typography>
              </Paper>
            </div>
          </Paper>
        )}

        {!examDetails && (
          <Alert
            severity="info"
            className="bg-secondary/20 border-2 border-primary/20"
            icon={<InfoIcon className="text-accent" />}
          >
            <Typography variant="body1">
              There are no active exams at the moment.
            </Typography>
          </Alert>
        )}
      </Box>
    </DashboardLayout>
  );
}
