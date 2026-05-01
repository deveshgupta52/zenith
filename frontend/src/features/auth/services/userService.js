import api from '../../../utils/axios';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    }
};
