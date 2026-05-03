const express = require('express');
const router = express.Router();
const db = require('../config/db');
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT 
                ISBN AS id, 
                Title AS title, 
                AuthNo AS author, 
                quantity AS quantity 
            FROM Books
        `;
        const [results] = await db.query(sql); 
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu" });
    }
});
router.post('/add', async (req, res) => {
    const { isbn, title, author, quantity, category, price } = req.body;
    try {
        // Chú ý: publisher_id nếu chưa có thì để NULL
        const sql = `INSERT INTO books (ISBN, Title, AuthNo, Category, Price, quantity, publisher_id) 
                     VALUES (?, ?, ?, ?, ?, ?, NULL)`;
        
        await db.query(sql, [
            isbn, 
            title, 
            author, 
            category || "Chưa phân loại", 
            price || 0, 
            quantity || 0
        ]);
        
        res.status(200).json({ message: "Thêm thành công!" });
    } catch (error) {
        console.error("Lỗi SQL:", error);
        res.status(500).json({ message: "Lỗi database: " + error.message });
    }
});
module.exports = router;