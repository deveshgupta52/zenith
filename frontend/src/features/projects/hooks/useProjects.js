import { useState, useCallback } from 'react';
import { projectService } from '../services/projectService';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await projectService.getProjects();
            setProjects(data.projects);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, []);

    const addProject = async (projectData) => {
        setLoading(true);
        try {
            const data = await projectService.createProject(projectData);
            setProjects(prev => [...prev, data.project]);
            return data.project;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editProject = async (id, projectData) => {
        setLoading(true);
        try {
            const data = await projectService.updateProject(id, projectData);
            setProjects(prev => prev.map(p => p._id === id ? data.project : p));
            return data.project;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update project');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeProject = async (id) => {
        try {
            await projectService.deleteProject(id);
            setProjects(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete project');
        }
    };

    return {
        projects,
        loading,
        error,
        fetchProjects,
        addProject,
        editProject,
        removeProject,
    };
};
