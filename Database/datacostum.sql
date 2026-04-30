INSERT INTO Publisher (name, YearOfPublication) VALUES 
('NXB Trẻ', 2020),
('NXB Giáo Dục', 2022),
('Kim Đồng', 2021);
INSERT INTO Books (ISBN, Title, Edition, Category, Price, AuthNo,Quantity, publisher_id) VALUES 
('978-604-1', 'Lập trình Python cơ bản', '1st', 'IT', 120000, 'TG-001',8, 1),
('978-604-2', 'Cấu trúc dữ liệu và Giải thuật', '2nd', 'IT', 155000, 'TG-002',11, 2),
('978-604-3', 'Thám tử lừng danh Conan', 'Tập 100', 'Manga', 25000, 'Gosho Aoyama',12, 3);
INSERT INTO Staff (name) VALUES 
('Nguyễn Văn Đạt'),
('Trần Thị Thủ Thư');
INSERT INTO Authentication_system (Loginid, Password, staff_id) VALUES 
('admin_dat', 'password123', 1),
('thuthu_01', 'ghidanh2026', 2);
INSERT INTO Readers (Firstname, Lastname, Email, Address, Phone_no) VALUES 
('Luan', 'Vu', 'luanvu@gmail.com', 'Quận 1, TP.HCM', '0901234567'),
('Thanh', 'Tùng', 'tungthanh@gmail.com', 'Quận Thủ Đức', '0988776655');
INSERT INTO Reserve_Return_Date (User_ID, ISBN, ReverseDate, return_date) VALUES 
(1, '978-604-1', '2026-04-25', '2026-05-02'),
(2, '978-604-3', '2026-04-28', NULL); 
INSERT INTO Reports (Book_No, User_id, Issue_Return, staff_id) VALUES 
('978-604-1', 1, 'Đã mượn', 1),
('978-604-3', 2, 'Đang mượn', 2);
