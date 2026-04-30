import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
        status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
        dueDate: { type: Date, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
