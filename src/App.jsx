import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import Login from './pages/Login/Login';
import PrivateRoute from './components/PrivateRoute';
import PaperSetterDashboard from './pages/Dashboard/PaperSetter';
import GuardianDashboard from './pages/Dashboard/Guardian';
import ExamCenterDashboard from './pages/Dashboard/ExamCenter';
import Unauthorized from './pages/Unauthorized';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Paper Setter Routes */}
          <Route path="/app/paper-setter/*" element={
            <PrivateRoute allowedRoles={['paper-setter']}>
              <Routes>
                <Route path="dashboard" element={<PaperSetterDashboard />} />
                {/* Add other paper setter routes here */}
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </PrivateRoute>
          } />

          {/* Guardian Routes */}
          <Route path="/app/guardian/*" element={
            <PrivateRoute allowedRoles={['guardian']}>
              <Routes>
                <Route path="dashboard" element={<GuardianDashboard />} />
                {/* Add other guardian routes here */}
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </PrivateRoute>
          } />

          {/* Exam Center Routes */}
          <Route path="/app/exam-center/*" element={
            <PrivateRoute allowedRoles={['exam-center']}>
              <Routes>
                <Route path="dashboard" element={<ExamCenterDashboard />} />
                {/* Add other exam center routes here */}
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </PrivateRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/unauthorized" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
