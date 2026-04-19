let books = JSON.parse(localStorage.getItem('books')) || [];

const renderTable = () => {
    const tbody = document.getElementById('adminList');
    tbody.innerHTML = books.map((book, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>
                <button class="btn-delete" onclick="deleteBook(${index})">Xóa</button>
            </td>
        </tr>
    `).join('');
    
    localStorage.setItem('books', JSON.stringify(books));
};

// Hàm thêm sách
document.getElementById('btnAdd').onclick = () => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    if (title && author) {
        books.push({ title, author });
        renderTable();
        document.getElementById('title').value = "";
        document.getElementById('author').value = "";
    } else {
        alert("Vui lòng nhập đầy đủ thông tin!");
    }
};

// Hàm xóa sách
window.deleteBook = (index) => {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
        books.splice(index, 1);
        renderTable();
    }
};

renderTable();