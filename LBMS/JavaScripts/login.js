window.onload = function(){
    document.getElementById('DN').onclick = function()
    {
        var a = document.getElementById('pass').value;
        var b = document.getElementById('user').value;

        if (a == "" || b == ""){
            alert('Vui lòng nhập đủ thông tin đăng nhập!');
            return;
        } 
        else {
            if (a != "123"){
            document.getElementById('KQ').innerHTML = "Sai thông tin đăng nhập hoặc mật khẩu không đúng!"
            document.getElementById('KQ').style.color = 'red';
            }
            else{
            document.getElementById('KQ').innerHTML = "Bạn đã đăng nhập thành công!"
            document.getElementById('KQ').style.color = 'green';

            setTimeout(function(){
                window.location.href = "index.html";}, 1000);
            }
        };
    }
}

