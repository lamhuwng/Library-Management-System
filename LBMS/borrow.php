<?php
// muon_sach.php
header('Content-Type: application/json');

// 1. Nhận chuỗi JSON từ JavaScript gửi lên
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['sachMuon'])) {
    echo json_encode(['success' => false, 'message' => 'Không có sách được chọn.']);
    exit;
}

$maDocGia = $input['maDocGia'];
$sachMuon = $input['sachMuon'];

try {
    // 2. Kết nối Database bằng PDO để dùng Prepared Statement (chống SQL Injection)
    // Lưu ý: Thay 'ThuVien' bằng tên database thực tế của nhóm bạn trong XAMPP
    $pdo = new PDO("mysql:host=localhost;dbname=ThuVien;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
     
    // Bắt đầu Transaction (Nếu có 1 bước lỗi, toàn bộ sẽ Rollback)
    $pdo->beginTransaction();

    foreach ($sachMuon as $sach) {
        $maSach = $sach['id'];
        $soLuong = $sach['count'];
        $ngayMuon = date('Y-m-d');
        $hanTra = date('Y-m-d', strtotime('+14 days')); // Hạn trả 14 ngày

        // Bước 1: Tạo Phiếu Mượn
        $sqlPhieuMuon = "INSERT INTO PhieuMuon (MaDocGia, MaSach, NgayMuon, HanTra, TrangThai) 
                         VALUES (?, ?, ?, ?, 'Đang mượn')";
        $stmt1 = $pdo->prepare($sqlPhieuMuon);
        $stmt1->execute([$maDocGia, $maSach, $ngayMuon, $hanTra]);

        // Bước 2: Giảm số lượng sách sẵn sàng cho mượn
        $sqlTruSach = "UPDATE Sach SET SoLuongSanCo = SoLuongSanCo - ? WHERE MaSach = ?";
        $stmt2 = $pdo->prepare($sqlTruSach);
        $stmt2->execute([$soLuong, $maSach]);
        
        // Bước 3: Tăng số sách độc giả đang giữ (Nếu nhóm bạn có lưu tổng số sách người đó giữ ở bảng DocGia)
        $sqlDocGia = "UPDATE DocGia SET SoSachDangGiu = SoSachDangGiu + ? WHERE MaDocGia = ?";
        $stmt3 = $pdo->prepare($sqlDocGia);
        $stmt3->execute([$soLuong, $maDocGia]);
    }

    // Nếu TẤT CẢ đều ổn, xác nhận Transaction (Commit)
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Đã tạo phiếu mượn và cập nhật kho thành công!']);

} catch (Exception $e) {
    // Nếu lỗi, hủy bỏ toàn bộ thao tác (Rollback)
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>