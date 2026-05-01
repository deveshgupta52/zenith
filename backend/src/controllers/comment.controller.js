import Comment from '../models/comment.model.js';

export const createComment = async (req, res) => {
    try {
        const { content, task } = req.body;
        const comment = await Comment.create({
            content,
            task,
            user: req.user.id
        });
        const populatedComment = await Comment.findById(comment._id).populate('user', 'name');
        res.status(201).json({ comment: populatedComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommentsByTask = async (req, res) => {
    try {
        const comments = await Comment.find({ task: req.params.taskId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
