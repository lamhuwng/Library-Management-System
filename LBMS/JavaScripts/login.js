window.onload = function() {
    document.getElementById('DN').onclick = async function() {
        // Lấy giá trị từ các ô input
        var pass = document.getElementById('pass').value;
        var user = document.getElementById('user').value;
        var resultDisplay = document.getElementById('KQ');

        // Kiểm tra đầu vào trống
        if (user === "" || pass === "") {
            alert('Vui lòng nhập đủ thông tin đăng nhập!');
            return;
        }

        try {
            // Gửi yêu cầu đăng nhập tới Backend[cite: 7]
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user, // Sẽ tương ứng với Loginid trong SQL
                    password: pass  // Sẽ tương ứng với Password trong SQL
                })
            });

            const data = await response.json();

            if (data.success) {
                // Đăng nhập thành công[cite: 7]
                resultDisplay.innerHTML = "Bạn đã đăng nhập thành công!";
                resultDisplay.style.color = 'green';

                // Lưu thông tin người dùng để dùng ở trang index[cite: 7]
                localStorage.setItem('currentUser', JSON.stringify(data.user));

                // Chuyển hướng sau 1 giây[cite: 7]
                setTimeout(function() {
                    window.location.href = "index.html"; 
                }, 1000);
            } else {
                // Sai thông tin (Server trả về success: false)[cite: 7]
                resultDisplay.innerHTML = data.message || "Sai thông tin đăng nhập hoặc mật khẩu!";
                resultDisplay.style.color = 'red';
            }
        } catch (error) {
            // Lỗi kết nối tới Server
            console.error("Lỗi:", error);
            resultDisplay.innerHTML = "Không thể kết nối đến máy chủ!";
            resultDisplay.style.color = 'orange';
        }
    };
};