Dưới đây là nội dung file `README.md` được định dạng chuẩn Markdown để fen có thể copy trực tiếp vào dự án của mình. File này đã được tối ưu để mô tả đúng cấu trúc thư mục và logic mà fen đã xây dựng[cite: 6, 7, 8, 9].

```markdown
# 📚 LibManage - Hệ Thống Quản Lý Thư Viện

Dự án quản lý thư viện mã nguồn mở, cho phép thủ thư và độc giả quản lý danh mục sách trực tuyến. Hệ thống kết nối dữ liệu thực tế từ MySQL thông qua Backend Node.js[cite: 6, 9].

## 📂 Cấu trúc thư mục dự án
```text
.
├── JavaScripts/
│   └── index.js          # Xử lý logic Frontend (Tìm kiếm, Giỏ mượn)[cite: 7]
├── server/
│   ├── config/
│   │   └── db.js         # Kết nối cơ sở dữ liệu MySQL[cite: 6]
│   ├── routes/
│   │   └── bookRoutes.js # API lấy dữ liệu từ bảng Books[cite: 8]
│   └── server.js         # File chạy chính của Backend[cite: 9]
├── css/
│   └── style.css         # Giao diện ứng dụng[cite: 8]
├── index.html            # Trang chủ hiển thị danh mục sách[cite: 8]
├── database.sql          # Script tạo Database và bảng Books[cite: 8]
└── .gitignore            # Loại bỏ node_modules khi push lên GitHub
```

## 🛠 Hướng dẫn thiết lập

### 1. Cơ sở dữ liệu (MySQL)
*   Sử dụng **XAMPP** để khởi động MySQL (Port mặc định: 3306 hoặc 3307)[cite: 6].
*   Tạo Database tên: `library_management_db`[cite: 6].
*   Chạy script trong file `database.sql` để tạo bảng `Books` với các trường: `ISBN`, `Title`, `AuthNo`, `Price`, `quantity`[cite: 8].

### 2. Cài đặt Backend (Node.js)
1.  Di chuyển vào thư mục server: `cd server`
2.  Cài đặt các thư viện cần thiết (không cần push node_modules):[cite: 7]
    ```bash
    npm install
    ```
3.  Khởi động server:[cite: 9]
    ```bash
    node server.js
    ```
    *Server sẽ lắng nghe tại cổng 5000.*

### 3. Khởi chạy giao diện
*   Mở file `index.html` trên trình duyệt[cite: 8].
*   Hệ thống sẽ tự động gọi API `http://localhost:5000/api/books` để hiển thị danh sách sách[cite: 7, 9].

## ✨ Các tính năng nổi bật
*   **Dữ liệu Real-time:** Hiển thị thông tin sách trực tiếp từ Database[cite: 7, 8].
*   **Quản lý tồn kho:** Hiển thị số lượng sách còn lại thay vì giá tiền; tự động vô hiệu hóa nút mượn nếu số lượng bằng 0[cite: 7].
*   **Tìm kiếm thông minh:** Chức năng `liveSearch` cho phép tìm kiếm theo Tên, Tác giả hoặc mã ISBN[cite: 7, 9].
*   **Giỏ hàng (Borrow List):** Lưu tạm thời các sách muốn mượn và tính tổng số lượng[cite: 7].

## ⚠️ Lưu ý quan trọng
*   Người dùng khi tải code về **bắt buộc** phải chạy lệnh `npm install` để tải lại các thư viện nằm trong `package.json`[cite: 7].
*   Đảm bảo cổng kết nối trong `config/db.js` khớp với cổng của MySQL trong XAMPP[cite: 6].

---
*Phát triển bởi: **Luanvu***
```

### Cách sử dụng:
1.  Mở VS Code.
2.  Tạo một file mới tên là `README.md` ở thư mục ngoài cùng của dự án.
3.  Dán đoạn code trên vào và lưu lại. 
4.  Khi fen push lên GitHub, đoạn code này sẽ biến thành một trang giới thiệu cực đẹp cho dự án của fen!