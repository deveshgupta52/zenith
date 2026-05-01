import api from '../../../utils/axios';

const getTasksByProject = async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
};

const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

const updateTask = async (id, taskData) => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
};

const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

const getMyTasks = async () => {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
};

export const taskService = {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    getMyTasks,
};
