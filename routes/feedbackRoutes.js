const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// POST - Create feedback
router.post('/', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET - Get all feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
