const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
const authMiddleware = require('../middleware/authMiddleware');

// POST - Create feedback
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newFeedback = new Feedback({
            ...req.body,
            userId: req.userId // ✅ Tie feedback to logged-in user
        });
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET - Get all feedbacks
router.get('/', authMiddleware, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.userId }).sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
