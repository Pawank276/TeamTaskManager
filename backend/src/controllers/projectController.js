import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const canAccessProject = async (projectId, user) => {
    if (user.role === 'Admin') {
        return Project.findById(projectId).populate('members', 'name email role');
    }

    return Project.findOne({ _id: projectId, members: user._id }).populate('members', 'name email role');
};

const listProjects = asyncHandler(async (req, res) => {
    const query = req.user.role === 'Admin' ? {} : { members: req.user._id };
    const projects = await Project.find(query)
        .sort({ createdAt: -1 })
        .populate('members', 'name email role')
        .populate('createdBy', 'name email role');

    res.json({ projects });
});

const createProject = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const project = await Project.create({
        title,
        description,
        createdBy: req.user._id,
        members: [req.user._id],
    });

    const populatedProject = await Project.findById(project._id)
        .populate('members', 'name email role')
        .populate('createdBy', 'name email role');

    res.status(201).json({ project: populatedProject });
});

const getProjectById = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid project id' });
    }

    const project = await canAccessProject(req.params.id, req.user);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
});

const updateProjectMembers = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid project id' });
    }

    const { email, action } = req.body;
    if (!email || !action) {
        return res.status(400).json({ message: 'Email and action are required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const member = await User.findOne({ email: email.toLowerCase() });
    if (!member) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'add') {
        await Project.updateOne({ _id: project._id }, { $addToSet: { members: member._id } });
    } else if (action === 'remove') {
        await Project.updateOne({ _id: project._id }, { $pull: { members: member._id } });
    } else {
        return res.status(400).json({ message: 'Action must be add or remove' });
    }

    const updatedProject = await Project.findById(project._id)
        .populate('members', 'name email role')
        .populate('createdBy', 'name email role');

    res.json({ project: updatedProject });
});

const getProjectTasks = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid project id' });
    }

    const project = await canAccessProject(req.params.id, req.user);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const taskQuery = { projectId: req.params.id };
    if (req.user.role !== 'Admin') {
        taskQuery.assignedTo = req.user._id;
    }

    const tasks = await Task.find(taskQuery)
        .sort({ dueDate: 1 })
        .populate('assignedTo', 'name email role')
        .populate('projectId', 'title');

    res.json({ tasks });
});

export { listProjects, createProject, getProjectById, updateProjectMembers, getProjectTasks };
