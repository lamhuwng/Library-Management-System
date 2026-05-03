const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/auth', authRoutes);
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});