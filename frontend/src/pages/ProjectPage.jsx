import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';

function ProjectPage() {
    const { id } = useParams();
    const { token, user } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [memberForm, setMemberForm] = useState({ email: '', action: 'add' });
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'Todo',
    });

    const loadProject = async () => {
        try {
            setLoading(true);
            const [projectData, taskData] = await Promise.all([
                apiRequest(`/api/projects/${id}`, {}, token),
                apiRequest(`/api/projects/${id}/tasks`, {}, token),
            ]);

            setProject(projectData.project);
            setTasks(taskData.tasks);
        } catch (loadError) {
            setError(loadError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProject();
    }, [id]);

    const isAdmin = user?.role === 'Admin';

    const handleMemberChange = (event) => {
        setMemberForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleTaskChange = (event) => {
        setTaskForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const submitMemberChange = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await apiRequest(`/api/projects/${id}/members`, {
                method: 'POST',
                body: JSON.stringify(memberForm),
            }, token);
            setMemberForm({ email: '', action: 'add' });
            await loadProject();
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    const submitTask = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await apiRequest('/api/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    ...taskForm,
                    projectId: id,
                }),
            }, token);
            setTaskForm({ title: '', description: '', assignedTo: '', dueDate: '', status: 'Todo' });
            await loadProject();
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    const updateStatus = async (taskId, status) => {
        try {
            await apiRequest(`/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            }, token);
            await loadProject();
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    return (
        <Layout title={project ? project.title : 'Project'}>
            {loading ? (
                <p>Loading project...</p>
            ) : (
                <div className="page-stack">
                    {error && <p className="error-text">{error}</p>}

                    {project && (
                        <section className="card">
                            <h2>Project details</h2>
                            <p>{project.description}</p>
                            <p className="muted">Members: {project.members?.length || 0}</p>
                            <div className="member-list">
                                {project.members?.map((member) => (
                                    <span key={member._id} className="member-pill">
                                        {member.name} ({member.role})
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {isAdmin && (
                        <section className="grid cards-2">
                            <div className="card">
                                <h2>Add or remove member</h2>
                                <form className="stack" onSubmit={submitMemberChange}>
                                    <label>
                                        Member email
                                        <input name="email" type="email" value={memberForm.email} onChange={handleMemberChange} required />
                                    </label>
                                    <label>
                                        Action
                                        <select name="action" value={memberForm.action} onChange={handleMemberChange}>
                                            <option value="add">Add</option>
                                            <option value="remove">Remove</option>
                                        </select>
                                    </label>
                                    <button className="primary-button" type="submit">Save member</button>
                                </form>
                            </div>

                            <div className="card">
                                <h2>Create task</h2>
                                <form className="stack" onSubmit={submitTask}>
                                    <label>
                                        Title
                                        <input name="title" value={taskForm.title} onChange={handleTaskChange} required />
                                    </label>
                                    <label>
                                        Description
                                        <input name="description" value={taskForm.description} onChange={handleTaskChange} required />
                                    </label>
                                    <label>
                                        Assign to member
                                        <select name="assignedTo" value={taskForm.assignedTo} onChange={handleTaskChange} required>
                                            <option value="">Select member</option>
                                            {project?.members?.map((member) => (
                                                <option key={member._id} value={member._id}>{member.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Due date
                                        <input name="dueDate" type="date" value={taskForm.dueDate} onChange={handleTaskChange} required />
                                    </label>
                                    <button className="primary-button" type="submit">Create task</button>
                                </form>
                            </div>
                        </section>
                    )}

                    <section className="card">
                        <h2>Tasks</h2>
                        {tasks.length === 0 ? (
                            <p>No tasks available.</p>
                        ) : (
                            <div className="stack">
                                {tasks.map((task) => (
                                    <article className="task-row" key={task._id}>
                                        <div>
                                            <div className="task-heading">
                                                <strong>{task.title}</strong>
                                                <StatusBadge status={task.status} />
                                            </div>
                                            <p>{task.description}</p>
                                            <p className="muted">
                                                Assigned to: {task.assignedTo?.name || 'Unassigned'} · Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <select
                                                value={task.status}
                                                onChange={(event) => updateStatus(task._id, event.target.value)}
                                                disabled={!isAdmin && task.assignedTo?._id !== user?._id}
                                            >
                                                <option value="Todo">Todo</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </Layout>
    );
}

export default ProjectPage;
