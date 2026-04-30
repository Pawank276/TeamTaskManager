import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';

function SignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
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
            const data = await apiRequest('/api/auth/signup', {
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
                <p className="eyebrow">Start here</p>
                <h1>Signup</h1>
                <form className="stack" onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Email
                        <input name="email" type="email" value={form.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Password
                        <input name="password" type="password" minLength="6" value={form.password} onChange={handleChange} required />
                    </label>
                    {error && <p className="error-text">{error}</p>}
                    <button className="primary-button" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
                <p className="helper-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
