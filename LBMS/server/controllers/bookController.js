const db = require('../config/db');

exports.getAllBooks = async (req, res) => {
    try {
        const [results] = await db.query('SELECT ISBN AS id, Title AS title, AuthNo AS author, quantity FROM Books');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu" });
    }
};

exports.addBook = async (req, res) => {
    const { isbn, title, author, quantity } = req.body;
    try {
        const sql = `INSERT INTO books (ISBN, Title, AuthNo, quantity) VALUES (?, ?, ?, ?)`;
        await db.query(sql, [isbn, title, author, quantity]);
        res.status(200).json({ message: "Thêm thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi database" });
    }
};