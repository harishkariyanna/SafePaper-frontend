import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Autocomplete,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import GroupIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";
import { questionService } from "../../../services/questionService";
import demoQuestions from "../../../data/demoQuestions";

export default function CreateQuestion({ onSuccess, guardians = [] }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { createQuestion } = questionService;

  const [questions, setQuestions] = useState(demoQuestions);
  const [guardianIds, setGuardianIds] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Create Questions", "Select Guardians", "Review & Submit"];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (user?.role !== "paper-setter") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctOption: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[index].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Validating form data");
      // Validations
      for (const question of questions) {
        if (!question.question.trim()) {
          throw new Error("All questions are required");
        }
        if (question.options.some((opt) => !opt.trim())) {
          throw new Error("All options are required for each question");
        }
        if (question.options.length === 4 && !question.correctOption) {
          throw new Error(
            "Correct option is required when all options are provided"
          );
        }
      }
      if (guardianIds.length !== 3) {
        throw new Error("Please select 3 guardians");
      }

      console.log("Submitting questions");
      const questionData = {
        questions: questions,
        guardianIds: guardianIds,
      };
      await createQuestion(questionData);
      console.log("Questions submitted successfully");
      setSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting questions:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const isQuestionsValid = () => {
    return (
      questions.length >= 3 &&
      questions.every(
        (q) =>
          q.question.trim() &&
          q.options.every((opt) => opt.trim()) &&
          q.correctOption
      )
    );
  };

  const isGuardiansValid = () => {
    return guardianIds.length === 3;
  };

  const handleNext = () => {
    if (activeStep === 0 && !isQuestionsValid()) {
      setError(
        "Please complete all questions with options and correct answers"
      );
      return;
    }
    if (activeStep === 1 && !isGuardiansValid()) {
      setError("Please select 3 guardians");
      return;
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  if (success) {
    return (
      <Alert severity="success">
        Questions created successfully! Key shares have been sent to the
        selected guardians.
      </Alert>
    );
  }

  return (
    <Paper className="p-4 md:p-8 bg-secondary/10 mb-4">
      <div className="mb-8">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      {error && (
        <Alert severity="error" className="mb-6 border border-red-200">
          {error}
        </Alert>
      )}

      <Box className="space-y-6">
        {activeStep === 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Typography
                variant="h6"
                className="font-semibold text-primary flex items-center gap-2"
              >
                <QuestionMarkIcon className="text-accent"/>
                Create Questions
              </Typography>
              <Tooltip title="Add at least 3 questions with 4 options each">
                <HelpOutlineIcon className="text-accent cursor-pointer" />
              </Tooltip>
            </div>

            {questions.map((q, index) => (
              <Accordion
                key={index}
                className="border-secondary hover:border-primary/30 transition-all duration-200"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="bg-secondary/5"
                >
                  <div className="flex md:items-center justify-between w-full pr-4 flex-col md:flex-row">
                    <Typography className="font-medium flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm md:text-base">
                        {index + 1}
                      </span>
                      {q.question || "New Question"}
                    </Typography>
                    <Chip
                      label={q.correctOption ? "Complete" : "Incomplete"}
                      size="small"
                      color={q.correctOption ? "success" : "default"}
                      variant="outlined"
                      className="ml-4"
                    />
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Box className="space-y-4">
                    <TextField
                      fullWidth
                      label="Question Text"
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(index, "question", e.target.value)
                      }
                      required
                      multiline
                      rows={2}
                      className="bg-white"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((option, optionIndex) => (
                        <TextField
                          key={optionIndex}
                          label={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                          required
                          className="bg-white"
                        />
                      ))}
                    </div>
                    <TextField
                      select
                      fullWidth
                      value={q.correctOption}
                      onChange={(e) => {
                        handleQuestionChange(
                          index,
                          "correctOption",
                          e.target.value
                        );
                      }}
                      required
                      className="bg-white"
                      SelectProps={{
                        native: true,
                      }}
                      sx={{ mb: 2 }}
                      disabled={!q.options.every(opt => opt.trim())} // Disable if not all options are filled
                    >
                      <option value="" className=" px-2 cursor-pointer">
                        Select correct option
                      </option>
                      {q.options.map((option, optionIndex) => (
                        <option
                          key={optionIndex}
                          value={option}
                          className=" px-2 cursor-pointer"
                        >
                          Option {optionIndex + 1}: {option}
                        </option>
                      ))}
                    </TextField>
                    <div className="flex justify-end">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveQuestion(index)}
                        startIcon={<DeleteOutlineIcon />}
                        className="hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            <div className="flex justify-center">
              <Button
                variant="outlined"
                onClick={handleAddQuestion}
                startIcon={<AddCircleOutlineIcon />}
                className="bg-white hover:bg-secondary/20"
              >
                Add New Question
              </Button>
            </div>
          </>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <GroupIcon className="text-accent" />
              <Typography variant="h6" className="font-semibold text-primary">
                Select Guardians
              </Typography>
            </div>

              <Autocomplete
                multiple
                options={guardians}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                value={guardians.filter((g) => guardianIds.includes(g._id))}
                onChange={(_, newValue) =>
                  setGuardianIds(newValue.map((g) => g._id))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Guardians (3)"
                    error={guardianIds.length > 0 && guardianIds.length !== 3}
                    helperText={
                      guardianIds.length > 0 && guardianIds.length !== 3
                        ? "Please select 3 guardians"
                        : ""
                    }
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                      className="bg-secondary/20"
                    />
                  ))
                }
              />
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <Typography variant="h6" className="font-semibold text-primary mb-4 flex items-center gap-2">
              <SendIcon className="text-accent" />
              Review Your Submission
            </Typography>

              <div className="space-y-6">
                <div>
                  <Typography variant="subtitle1" className="font-medium mb-3 text-primary">
                    Questions Summary
                  </Typography>
                  <div className="space-y-3">
                    {questions.map((q, index) => (
                      <Paper key={index} className="p-4 bg-secondary/5 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <Typography className="font-medium text-gray-800">
                              {q.question}
                            </Typography>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {q.options.map((opt, i) => (
                                <div 
                                  key={i}
                                  className={`p-2 rounded text-xs md:text-sm ${
                                    q.correctOption === opt 
                                      ? 'bg-green-50 border border-green-200' 
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  {opt}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Paper>
                    ))}
                  </div>
                </div>

                <Divider />

                <div>
                  <Typography variant="subtitle1" className="font-medium mb-3 text-primary">
                    Selected Guardians
                  </Typography>
                  <div className="flex gap-2 flex-wrap">
                    {guardians
                      .filter((g) => guardianIds.includes(g._id))
                      .map((guardian) => (
                        <Chip
                          key={guardian._id}
                          label={guardian.name}
                          variant="outlined"
                          className="bg-secondary/20"
                          icon={<GroupIcon className="text-primary" />}
                        />
                      ))}
                  </div>
                </div>

                <Alert severity="info" className="bg-secondary/20 border border-primary/20">
                  Please review all details carefully. Once submitted, questions cannot be modified.
                </Alert>
              </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-accent"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SendIcon />
              }
            >
              Submit Questions
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              className="bg-primary hover:bg-accent"
            >
              Continue
            </Button>
          )}
        </div>
      </Box>
    </Paper>
  );
}
