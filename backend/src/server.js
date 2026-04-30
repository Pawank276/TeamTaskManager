import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './config/db.js';
import { ensureDemoUsers } from './scripts/seedDemoUsers.js';

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
    await connectDb();
    await ensureDemoUsers();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
