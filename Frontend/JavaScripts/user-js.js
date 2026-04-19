// Gia lap lay du lieu tu Database
function loadBooks() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const list = document.getElementById('book-list');
    
    list.innerHTML = ""; //xoa nd cu

    // Loc sach theo tu khoa (gia lap AJAX load du lieu dong)
    const filtered = books.filter(b => 
        b.title.toLowerCase().includes(searchTerm) || 
        b.author.toLowerCase().includes(searchTerm)
    );

    filtered.forEach(book => {
        list.innerHTML += `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p>Tác giả: ${book.author}</p>
            </div>`;
    });
}

document.getElementById('searchInput').addEventListener('input', loadBooks);

window.onload = loadBooks;