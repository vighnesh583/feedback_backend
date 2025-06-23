const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();

// ✅ Allow only your Vercel frontend
const allowedOrigins = ['https://feedback-reward.vercel.app'];

// ✅ CORS middleware setup
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman) or from allowedOrigins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false
}));

// ✅ Handle preflight requests (important for OPTIONS method)
app.options('*', cors());

// ✅ JSON parser for incoming requests
app.use(express.json());

// ✅ Debug middleware (optional, remove in production)
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl} from ${req.headers.origin}`);
    next();
});

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://vighneshkhadake:gIrV2bVnCvBiy9SE@cluster0.ltxhibl.mongodb.net/feedback_db?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// ✅ Routes
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
