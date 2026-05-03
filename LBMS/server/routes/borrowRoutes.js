const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Đường dẫn tới file config db.js của bạn

router.post('/checkout', async (req, res) => {
    const { User_ID, sachMuon } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!User_ID || !sachMuon || !Array.isArray(sachMuon) || sachMuon.length === 0) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin người mượn hoặc sách.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        for (let sach of sachMuon) {
            // TỰ ĐỘNG DÒ TÌM: Lấy ISBN, nếu không có thì tìm isbn (thường), nếu không có nữa thì lấy id
            const isbn = sach.ISBN || sach.isbn || sach.id; 
            const count = sach.count || 1;

            // Nếu vẫn undefined, in thẳng cục data lỗi ra màn hình Terminal để bắt tận tay
            if (!isbn) {
                console.error("❌ DỮ LIỆU BỊ THIẾU MÃ SÁCH:", sach);
                throw new Error("Không tìm thấy mã sách (ISBN) trong giỏ hàng gửi lên.");
            }

            // Tính toán ngày mượn (hôm nay) và ngày trả (14 ngày sau)
            const ngayMuon = new Date().toISOString().slice(0, 10);
            const ngayTra = new Date();
            ngayTra.setDate(ngayTra.getDate() + 14);
            const hanTra = ngayTra.toISOString().slice(0, 10);

            // Bước 1: Ghi vào bảng Reserve_Return_Date
            const sqlPhieuMuon = `
                INSERT INTO Reserve_Return_Date (User_ID, ISBN, ReverseDate, return_date) 
                VALUES (?, ?, ?, ?)
            `;
            await connection.query(sqlPhieuMuon, [User_ID, isbn, ngayMuon, hanTra]);

            // Bước 2: Trừ số lượng sách (Quantity)
            const sqlTruSach = "UPDATE Books SET Quantity = Quantity - ? WHERE ISBN = ? AND Quantity >= ?";
            const [result] = await connection.query(sqlTruSach, [count, isbn, count]);

            // Nếu không trừ được (do sai ISBN hoặc hết sách)
            if (result.affectedRows === 0) {
                throw new Error(`Sách với mã ISBN '${isbn}' đã hết hoặc không đủ số lượng.`);
            }
        }

        await connection.commit();
        res.json({ success: true, message: 'Ghi nhận yêu cầu mượn sách thành công!' });

    } catch (error) {
        await connection.rollback();
        console.error("❌ Lỗi Transaction:", error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
});
// Lấy toàn bộ danh sách đang mượn của tất cả độc giả
router.get('/all-borrows', async (req, res) => {
    try {
        const { search } = req.query; // Lấy từ khóa tìm kiếm từ URL
        let sql = `
            SELECT 
                r.id, r.User_ID as reader_id, 
                CONCAT(rd.Firstname, ' ', rd.Lastname) as reader_name, 
                r.ISBN, b.Title as book_title, 
                r.ReverseDate as borrow_date, r.return_date 
            FROM Reserve_Return_Date r
            JOIN Books b ON r.ISBN = b.ISBN
            LEFT JOIN readers rd ON r.User_ID = rd.User_ID
        `;

        const params = [];
        if (search) {
            sql += ` WHERE rd.Firstname LIKE ? OR rd.Lastname LIKE ? OR b.Title LIKE ? OR r.User_ID LIKE ?`;
            const searchVal = `%${search}%`;
            params.push(searchVal, searchVal, searchVal, searchVal);
        }

        sql += ` ORDER BY r.ReverseDate DESC`;
        
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lọc dữ liệu" });
    }
});
// API thực hiện trả sách
router.post('/return', async (req, res) => {
    const { id, ISBN } = req.body; 

    // Kiểm tra đầu vào: id là mã phiếu mượn, ISBN là mã sách
    if (!id || !ISBN) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin phiếu mượn hoặc mã sách.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Bước 1: Xóa bản ghi mượn sách khỏi bảng Reserve_Return_Date
        const sqlDelete = "DELETE FROM Reserve_Return_Date WHERE id = ?";
        const [delResult] = await connection.query(sqlDelete, [id]);

        if (delResult.affectedRows === 0) {
            throw new Error("Không tìm thấy phiếu mượn này hoặc đã được xử lý trước đó.");
        }

        // Bước 2: Cộng lại số lượng sách vào kho (Quantity + 1)
        const sqlUpdateStock = "UPDATE Books SET Quantity = Quantity + 1 WHERE ISBN = ?";
        await connection.query(sqlUpdateStock, [ISBN]);

        await connection.commit();
        res.json({ success: true, message: 'Trả sách thành công, kho đã được cập nhật!' });
    } catch (error) {
        await connection.rollback();
        console.error("Lỗi khi xử lý trả sách:", error.message);
        res.status(500).json({ success: false, message: error.message || 'Không thể xử lý trả sách.' });
    } finally {
        connection.release();
    }
});
module.exports = router;