import api from '../../../utils/axios';

const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

const updateProject = async (id, projectData) => {
    const response = await api.patch(`/projects/${id}`, projectData);
    return response.data;
};

const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

export const projectService = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
};
