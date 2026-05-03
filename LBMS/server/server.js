const express = require('express');
const cors = require('cors');

// Import các routes
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); // Đọc dữ liệu JSON từ body

// Khai báo Routes
app.use('/api/books', bookRoutes);   // Quản lý sách (Xem, Thêm, Xóa)
app.use('/api/borrow', borrowRoutes); // Quản lý mượn trả
app.use('/api/auth', authRoutes);     // Đăng nhập, đăng ký[cite: 1]

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});