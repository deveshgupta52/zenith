import Task from '../models/task.model.js';
import Project from '../models/project.model.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Get projects where user is owner or member
        const projects = await Project.find({
            $or: [{ owner: userId }, { members: userId }]
        });
        const projectIds = projects.map(p => p._id);

        // Get all tasks for these projects
        const tasks = await Task.find({ project: { $in: projectIds } });

        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'Done').length,
            pendingTasks: tasks.filter(t => t.status !== 'Done').length,
            overdueTasks: tasks.filter(t => 
                t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()
            ).length,
            tasksByStatus: {
                todo: tasks.filter(t => t.status === 'To Do').length,
                inProgress: tasks.filter(t => t.status === 'In Progress').length,
                done: tasks.filter(t => t.status === 'Done').length,
            },
            tasksByPriority: {
                low: tasks.filter(t => t.priority === 'Low').length,
                medium: tasks.filter(t => t.priority === 'Medium').length,
                high: tasks.filter(t => t.priority === 'High').length,
            }
        };

        res.status(200).json({ stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
