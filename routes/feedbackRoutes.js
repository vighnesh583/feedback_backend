const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ POST - Allow public (no authMiddleware) to submit feedback
router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, rating, message, discount, discountCode } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId in feedback' });
        }
        if (!name || !email || !message || !discount) return res.status(400).json({ error: 'Missing required fields' });

        const newFeedback = new Feedback({
            userId,
            name,
            email,
            rating,
            message,
            discount,
            discountCode,
            createdAt: new Date(),
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Feedback POST error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET - Admin fetching their own feedback (with token)
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Comes from token
        const feedbacks = await Feedback.find({ userId }).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error('Feedback GET error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
