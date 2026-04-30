import bcrypt from 'bcryptjs';
import User from '../models/User.js';

async function ensureDemoUsers() {
    const users = [
        {
            name: 'Demo Admin',
            email: 'admin@taskmanager.local',
            password: 'Admin123!',
            role: 'Admin',
        },
        {
            name: 'Demo Member',
            email: 'member@taskmanager.local',
            password: 'Member123!',
            role: 'Member',
        },
    ];

    for (const userData of users) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
        });
    }
}

export { ensureDemoUsers };
