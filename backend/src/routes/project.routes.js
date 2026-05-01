import express from 'express';
import { body, validationResult } from 'express-validator';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/project.controller.js';
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

router.route('/')
    .get(getProjects)
    .post([
        authorize('ADMIN'),
        body('name').notEmpty().withMessage('Project name is required'),
        validate
    ], createProject);

router.route('/:id')
    .get(getProjectById)
    .patch([authorize('ADMIN')], updateProject)
    .delete([authorize('ADMIN')], deleteProject);

export default router;
