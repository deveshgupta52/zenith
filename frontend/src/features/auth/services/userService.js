import api from '../../../utils/axios';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await api.patch('/users/profile', userData);
        return response.data;
    },
    changePassword: async (passwordData) => {
        const response = await api.patch('/users/change-password', passwordData);
        return response.data;
    }
};
