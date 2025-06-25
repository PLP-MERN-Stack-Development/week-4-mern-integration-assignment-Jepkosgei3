import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/tasks" replace />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/tasks/:id" element={<TaskDetail />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;