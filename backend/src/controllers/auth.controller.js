import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET || 'secret', {
        expiresIn: '30d'
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',

            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',

            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    const isProduction = config.NODE_ENV === 'production';
    res.cookie('token', '', { 
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1 
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
