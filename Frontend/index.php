<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Trang web dành cho SV</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div id="LB">
    <h2>Đăng nhập hệ thống</h2>
    <form method="POST" action="">
        <table>
            <tbody>
                <tr>
                    <td>Tên đăng nhập: </td>
                    <td><input type="text" name="user" placeholder="..." id="user"></td>
                </tr>
                <tr>
                    <td>Mật khẩu: </td>
                    <td><input type="password" name="pass" placeholder="..." id="pass"></td>
                </tr>
            </tbody>
        </table>
        <input type="submit" name="login" id="DN" value="Đăng nhập">
    </form>
    
    <br>
    <a href="https://example.com" target="_blank">Bạn quên mật khẩu?</a>

    <h3 id="KQ">
        <?php
        if (isset($_POST['login'])) {
            $username = $_POST['user'];
            $password = $_POST['pass'];

            // Kiểm tra đăng nhập (Ví dụ đơn giản)
            if ($password == "123456") {
                echo "Đăng nhập thành công! Chào mừng " . htmlspecialchars($username);
            } else {
                echo "Sai tên đăng nhập hoặc mật khẩu!";
            }
        }
        ?>
    </h3>
</div>
</body>
</html>