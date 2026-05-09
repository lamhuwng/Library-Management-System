const db = require('../config/db');

// --- 1. XỬ LÝ MƯỢN SÁCH (CHECKOUT) ---
exports.checkout = async (req, res) => {
    const { User_ID, sachMuon } = req.body;

    if (!User_ID || !sachMuon || !Array.isArray(sachMuon) || sachMuon.length === 0) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin người mượn hoặc sách.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        for (let sach of sachMuon) {
            const isbn = sach.ISBN || sach.isbn || sach.id; 
            const count = sach.count || 1;

            if (!isbn) {
                console.error("❌ DỮ LIỆU BỊ THIẾU MÃ SÁCH:", sach);
                throw new Error("Không tìm thấy mã sách (ISBN) trong giỏ hàng gửi lên.");
            }

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

            // Bước 2: Trừ số lượng sách
            const sqlTruSach = "UPDATE Books SET Quantity = Quantity - ? WHERE ISBN = ? AND Quantity >= ?";
            const [result] = await connection.query(sqlTruSach, [count, isbn, count]);

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
};

// --- 2. LẤY DANH SÁCH ĐANG MƯỢN ---
exports.getAllBorrows = async (req, res) => {
    try {
        const { search } = req.query;
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
};

// --- 3. XỬ LÝ TRẢ SÁCH (RETURN) ---
exports.returnBook = async (req, res) => {
    const { id, ISBN } = req.body; 

    if (!id || !ISBN) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin phiếu mượn hoặc mã sách.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const sqlDelete = "DELETE FROM Reserve_Return_Date WHERE id = ?";
        const [delResult] = await connection.query(sqlDelete, [id]);

        if (delResult.affectedRows === 0) {
            throw new Error("Không tìm thấy phiếu mượn này.");
        }

        const sqlUpdateStock = "UPDATE Books SET Quantity = Quantity + 1 WHERE ISBN = ?";
        await connection.query(sqlUpdateStock, [ISBN]);

        await connection.commit();
        res.json({ success: true, message: 'Trả sách thành công!' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};