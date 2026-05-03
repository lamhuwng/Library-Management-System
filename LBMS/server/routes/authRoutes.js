const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Truy vấn dựa trên cấu trúc bảng authentication_system của bạn
        const sql = `
            SELECT a.staff_id, s.name 
            FROM authentication_system a
            JOIN staff s ON a.staff_id = s.staff_id
            WHERE a.Loginid = ? AND a.Password = ?
        `;
        const [rows] = await db.query(sql, [username, password]);

        if (rows.length > 0) {
            res.json({ 
                success: true, 
                user: { 
                    id: rows[0].staff_id, 
                    name: rows[0].name 
                } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu.' });
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
    }
});
module.exports = router;