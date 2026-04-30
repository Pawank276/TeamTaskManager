import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const canAccessTaskList = (user) => ({
    ...(user.role === 'Admin' ? {} : { assignedTo: user._id }),
});

const listTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.query;
    const query = canAccessTaskList(req.user);

    if (projectId) {
        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid project id' });
        }

        query.projectId = projectId;
    }

    const tasks = await Task.find(query)
        .sort({ dueDate: 1 })
        .populate('assignedTo', 'name email role')
        .populate('projectId', 'title');

    res.json({ tasks });
});

const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, projectId, status, dueDate } = req.body;

    if (!title || !description || !assignedTo || !projectId || !dueDate) {
        return res.status(400).json({ message: 'All task fields except status are required' });
    }

    if (!isValidObjectId(assignedTo) || !isValidObjectId(projectId)) {
        return res.status(400).json({ message: 'Invalid task references' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const member = await User.findById(assignedTo);
    if (!member) {
        return res.status(404).json({ message: 'Assigned user not found' });
    }

    const projectHasMember = project.members.some((memberId) => memberId.toString() === member._id.toString());
    if (!projectHasMember) {
        return res.status(400).json({ message: 'Assigned user must be a project member' });
    }

    const task = await Task.create({
        title,
        description,
        assignedTo,
        projectId,
        status: ['Todo', 'In Progress', 'Done'].includes(status) ? status : 'Todo',
        dueDate,
        createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email role')
        .populate('projectId', 'title');

    res.status(201).json({ task: populatedTask });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid task id' });
    }

    const { status } = req.body;
    if (!['Todo', 'In Progress', 'Done'].includes(status)) {
        return res.status(400).json({ message: 'Status must be Todo, In Progress, or Done' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only update your assigned tasks' });
    }

    task.status = status;
    await task.save();

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email role')
        .populate('projectId', 'title');

    res.json({ task: populatedTask });
});

export { listTasks, createTask, updateTaskStatus };
