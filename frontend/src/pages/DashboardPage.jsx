import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';

function DashboardPage() {
    const { token, user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [projectForm, setProjectForm] = useState({ title: '', description: '' });

    const loadData = async () => {
        try {
            setLoading(true);
            const [projectData, statsData] = await Promise.all([
                apiRequest('/api/projects', {}, token),
                apiRequest('/api/dashboard/stats', {}, token),
            ]);

            setProjects(projectData.projects);
            setStats(statsData.stats);
        } catch (loadError) {
            setError(loadError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleProjectChange = (event) => {
        setProjectForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const createProject = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await apiRequest('/api/projects', {
                method: 'POST',
                body: JSON.stringify(projectForm),
            }, token);
            setProjectForm({ title: '', description: '' });
            await loadData();
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    return (
        <Layout title="Dashboard">
            {loading ? (
                <p>Loading dashboard...</p>
            ) : (
                <div className="page-stack">
                    {error && <p className="error-text">{error}</p>}

                    <section className="grid cards-3">
                        <div className="card stat-card">
                            <span>Total tasks</span>
                            <strong>{stats?.totalTasks ?? 0}</strong>
                        </div>
                        <div className="card stat-card">
                            <span>Overdue tasks</span>
                            <strong>{stats?.overdueTasks ?? 0}</strong>
                        </div>
                        <div className="card stat-card">
                            <span>Role</span>
                            <strong>{user?.role}</strong>
                        </div>
                    </section>

                    <section className="card">
                        <h2>Tasks by status</h2>
                        <div className="status-list">
                            <span className="status-chip">Todo: {stats?.byStatus?.Todo ?? 0}</span>
                            <span className="status-chip">In Progress: {stats?.byStatus?.['In Progress'] ?? 0}</span>
                            <span className="status-chip">Done: {stats?.byStatus?.Done ?? 0}</span>
                        </div>
                    </section>

                    {user?.role === 'Admin' && (
                        <section className="card">
                            <h2>Create project</h2>
                            <form className="grid form-grid" onSubmit={createProject}>
                                <label>
                                    Title
                                    <input name="title" value={projectForm.title} onChange={handleProjectChange} required />
                                </label>
                                <label>
                                    Description
                                    <input name="description" value={projectForm.description} onChange={handleProjectChange} required />
                                </label>
                                <div>
                                    <button className="primary-button" type="submit">Create project</button>
                                </div>
                            </form>
                        </section>
                    )}

                    <section className="card">
                        <h2>Projects</h2>
                        <div className="stack">
                            {projects.length === 0 ? (
                                <p>No projects yet.</p>
                            ) : (
                                projects.map((project) => (
                                    <Link key={project._id} className="project-row" to={`/projects/${project._id}`}>
                                        <div>
                                            <strong>{project.title}</strong>
                                            <p>{project.description}</p>
                                        </div>
                                        <span>{project.members?.length || 0} members</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            )}
        </Layout>
    );
}

export default DashboardPage;
