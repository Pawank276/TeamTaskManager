import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(form),
            });

            login(data.token, data.user);
            navigate('/dashboard');
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="eyebrow">Welcome back</p>
                <h1>Login</h1>
                <form className="stack" onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input name="email" type="email" value={form.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Password
                        <input name="password" type="password" value={form.password} onChange={handleChange} required />
                    </label>
                    {error && <p className="error-text">{error}</p>}
                    <button className="primary-button" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="helper-text">
                    No account yet? <Link to="/signup">Create one</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
