import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, setUser } from '../state/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const login = async (credentials) => {
        dispatch(loginStart());
        try {
            const data = await authService.login(credentials);
            dispatch(loginSuccess(data));
            return data;
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            dispatch(loginFailure(message));
            throw err;
        }
    };

    const register = async (userData) => {
        dispatch(loginStart());
        try {
            const data = await authService.register(userData);
            dispatch(loginSuccess(data));
            return data;
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            dispatch(loginFailure(message));
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            dispatch(logoutAction());
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const fetchMe = async () => {
        try {
            const data = await authService.getMe();
            dispatch(setUser(data.user));
        } catch (err) {
            dispatch(logoutAction());
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        fetchMe,
    };
};
