const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const feedbackRoutes = require('./routes/feedbackRoutes');

// ✅ Allow frontend origin only (CORS whitelist)
const allowedOrigins = ['https://feedback-reward.vercel.app'];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
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

// ✅ Preflight requests
app.options('*', cors());

// ✅ JSON Parser
app.use(express.json());

// ✅ Debugging (Optional in dev)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl} from ${req.headers.origin}`);
  next();
});

// ✅ Routes
app.use('/api/feedback', feedbackRoutes);

// ✅ Async MongoDB Connection + Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Stop server
  }
};

startServer();
