import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async (projectId) => {
        setLoading(true);
        try {
            const data = await taskService.getTasksByProject(projectId);
            setTasks(data.tasks);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await taskService.getMyTasks();
            setTasks(data.tasks);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch your tasks');
        } finally {
            setLoading(false);
        }
    }, []);


    const addTask = async (taskData) => {
        setLoading(true);
        try {
            const data = await taskService.createTask(taskData);
            setTasks(prev => [...prev, data.task]);
            return data.task;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editTask = async (id, taskData) => {
        try {
            const data = await taskService.updateTask(id, taskData);
            setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data.task } : t));
            return data.task;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
            throw err;
        }
    };

    const removeTask = async (id) => {
        try {
            await taskService.deleteTask(id);
            setTasks(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task');
        }
    };

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        fetchMyTasks,
        addTask,
        editTask,
        removeTask,
    };
};

