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

module.exports = router;