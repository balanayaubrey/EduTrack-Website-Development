const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const dataRoutes = require('./routes/data');
const inviteRoutes = require('./routes/invite');
const studentRoutes = require('./routes/student');
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MOUNT ROUTES (clean + NO DUPLICATES)
app.use('/api/data', dataRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/student', studentRoutes);   // ✅ FIXED (singular)
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
