import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleNavigate = () => {
    if (!user) {
      navigate('/');
    } else {
      // Updated navigation paths
      switch (user.role) {
        case 'paper-setter':
          navigate('/app/paper-setter/dashboard');
          break;
        case 'guardian':
          navigate('/app/guardian/dashboard');
          break;
        case 'exam-center':
          navigate('/app/exam-center/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 64,
              color: 'error.main',
              mb: 2,
            }}
          />
          
          <Typography variant="h4" gutterBottom color="error">
            Access Denied
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have permission to access this page. Please check your credentials or contact support if you believe this is an error.
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            {user ? `Current role: ${user.role}` : 'Not logged in'}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigate}
            sx={{ mt: 2 }}
          >
            {user ? 'Go to Dashboard' : 'Go to Login'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
