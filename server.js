const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();

// CORS middleware FIRST
app.use(cors({
    origin: 'https://feedback-reward.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false
}));

// Express JSON parser (no need body-parser)
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://vighneshkhadake:gIrV2bVnCvBiy9SE@cluster0.ltxhibl.mongodb.net/feedback_db?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Handle preflight requests (optional, but safe)
app.options('*', cors());

// Import routes
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
