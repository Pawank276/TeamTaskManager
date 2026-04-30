import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

function Layout({ title, children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-shell">
            <header className="topbar">
                <div>
                    <p className="eyebrow">Team Task Manager</p>
                    <h1>{title}</h1>
                </div>
                <div className="topbar-actions">
                    <Link className="text-link" to="/dashboard">
                        Dashboard
                    </Link>
                    {user?.role === 'Admin' && <span className="role-pill">Admin</span>}
                    {user?.role === 'Member' && <span className="role-pill muted">Member</span>}
                    <button className="secondary-button" type="button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}

export default Layout;
