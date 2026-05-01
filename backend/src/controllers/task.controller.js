import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email');
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
            .populate('assignedTo', 'name email');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id })
            .populate('project', 'name');
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
