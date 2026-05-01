import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await userService.getAllUsers();
                setUsers(data.users);
            } catch (err) {
                console.error('Failed to fetch users', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return { users, loading };
};
