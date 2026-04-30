import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './state/AuthContext.jsx';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="center-screen">Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/projects/:id"
                element={
                    <ProtectedRoute>
                        <ProjectPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
    );
}

export default App;
