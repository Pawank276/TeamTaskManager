import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  const taskQuery = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };
  const tasks = await Task.find(taskQuery).select('status dueDate');

  const stats = {
    totalTasks: tasks.length,
    byStatus: {
      Todo: 0,
      'In Progress': 0,
      Done: 0,
    },
    overdueTasks: 0,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    stats.byStatus[task.status] += 1;

    const dueDate = new Date(task.dueDate);
    if (dueDate < today && task.status !== 'Done') {
      stats.overdueTasks += 1;
    }
  });

  res.json({ stats });
});

export { getDashboardStats };
