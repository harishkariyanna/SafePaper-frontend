import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography, IconButton } from '@mui/material';
import PaperSetterForm from './components/PaperSetterForm';
import GuardianForm from './components/GuardianForm';
import ExamCenterForm from './components/ExamCenterForm';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';
import CreateIcon from '@mui/icons-material/Create';
import './Login.scss';

function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
    >
      {value === index && <Box className="p-6">{children}</Box>}
    </div>
  );
}

export default function Login() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTabIcon = (index) => {
    switch(index) {
      case 0: return <CreateIcon className="text-inherit" />;
      case 1: return <SecurityIcon className="text-inherit" />;
      case 2: return <SchoolIcon className="text-inherit" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />
        <div className="absolute inset-0 opacity-[0.15]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl animate-blob"
              style={{
                backgroundColor: i % 2 ? 'var(--color-primary)' : 'var(--color-accent)',
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}
        </div>
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <Paper elevation={24} className="w-full max-w-md rounded-2xl overflow-hidden relative z-10 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
        <div className="bg-primary text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-90" />
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
              <LockIcon sx={{ fontSize: 32 }} className="text-white" />
            </div>
            <Typography variant="h4" className="font-space-grotesk font-bold">
              SafePaper Login
            </Typography>
            <Typography variant="body2" className="mt-2 opacity-80 font-poppins">
              Secure Exam Management System
            </Typography>
          </div>
        </div>
        
        <Box className="bg-white">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="login tabs"
            className="border-b border-gray-200"
            sx={{
              '& .MuiTab-root': {
                fontFamily: 'Space Grotesk',
                fontSize: '0.95rem',
                fontWeight: 500,
                py: 2.5,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(var(--color-primary-rgb), 0.04)',
                },
              },
              '& .Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: 'primary.main',
              },
            }}
          >
            {['Paper Setter', 'Guardian', 'Exam Center'].map((label, index) => (
              <Tab
                key={label}
                label={
                  <div className="flex items-center gap-2">
                    {getTabIcon(index)}
                    {label}
                  </div>
                }
              />
            ))}
          </Tabs>

          <div className="bg-secondary/5">
            <CustomTabPanel value={activeTab} index={0}>
              <PaperSetterForm />
            </CustomTabPanel>
            <CustomTabPanel value={activeTab} index={1}>
              <GuardianForm />
            </CustomTabPanel>
            <CustomTabPanel value={activeTab} index={2}>
              <ExamCenterForm />
            </CustomTabPanel>
          </div>
        </Box>
      </Paper>
    </div>
  );
}
