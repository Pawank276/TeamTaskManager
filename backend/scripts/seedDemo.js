import dotenv from 'dotenv';
import connectDb from '../src/config/db.js';
import { ensureDemoUsers } from '../src/scripts/seedDemoUsers.js';

dotenv.config();

async function run() {
    await connectDb();
    await ensureDemoUsers();
    console.log('Demo users seeded');
    process.exit(0);
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
