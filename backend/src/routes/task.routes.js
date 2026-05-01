import express from 'express';
import { body, validationResult } from 'express-validator';
import { createTask, getTasksByProject, updateTask, deleteTask, getMyTasks } from '../controllers/task.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.use(protect);

router.get('/my-tasks', getMyTasks);

router.route('/')
    .post([
        authorize('ADMIN'),
        body('title').notEmpty().withMessage('Task title is required'),
        body('project').notEmpty().withMessage('Project ID is required'),
        validate
    ], createTask);

router.get('/project/:projectId', getTasksByProject);

router.route('/:id')
    .patch(updateTask)
    .delete([authorize('ADMIN')], deleteTask);

export default router;
