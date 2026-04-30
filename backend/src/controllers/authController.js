import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
});

const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'Member',
    });

    res.status(201).json({
        token: generateToken(user._id),
        user: sanitizeUser(user),
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
        token: generateToken(user._id),
        user: sanitizeUser(user),
    });
});

const me = asyncHandler(async (req, res) => {
    res.json({ user: sanitizeUser(req.user) });
});

export { signup, login, me };
