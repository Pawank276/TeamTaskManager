import mongoose from 'mongoose';

function getMongoUri() {
    return (
        process.env.MONGODB_URI ||
        process.env.MONGODB_URL ||
        process.env.MONGO_URL ||
        process.env.DATABASE_URL ||
        process.env.RAILWAY_MONGODB_URL ||
        ''
    );
}

async function connectDb() {
    const mongoUri = getMongoUri();

    if (!mongoUri) {
        throw new Error('MongoDB connection string is required. Set MONGODB_URI or the Railway MongoDB variable on the backend service.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
}

export default connectDb;
