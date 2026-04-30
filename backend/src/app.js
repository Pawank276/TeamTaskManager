import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
