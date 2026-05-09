let libraryBooks = [];
let borrowList = [];
let allBorrows = [];

// --- 1. KHỞI TẠO & XÁC THỰC ---
(function init() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        const user = JSON.parse(userData);
        const nameDisplay = document.querySelector('.user-info strong');
        if (nameDisplay) nameDisplay.innerText = user.name;
    } else {
        window.location.href = 'Login.html';
    }
    loadBooks(); // Tải sách ngay khi vào trang
})();

// --- 2. LOGIC MƯỢN SÁCH (TRANG CHỦ) ---
async function loadBooks() {
    try {
        const response = await fetch('http://localhost:5000/api/books');
        libraryBooks = await response.json();
        renderLibrary(libraryBooks); 
    } catch (error) {
        document.getElementById('product-list').innerHTML = '<p class="empty-msg">Lỗi kết nối server.</p>';
    }
}
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    const btn = document.getElementById('admin-toggle-btn');
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        btn.innerText = '✖ Đóng Quản lý';
        btn.style.backgroundColor = '#ccc';
    } else {
        panel.style.display = 'none';
        btn.innerText = '⚙️ Quản lý kho sách';
        btn.style.backgroundColor = ''; // Trả về màu mặc định
    }
}
function renderLibrary(booksToRender) {
    const bookContainer = document.getElementById('product-list');
    const template = document.getElementById('book-item-template');
    if (!bookContainer || !template) return;
    bookContainer.innerHTML = '';
    booksToRender.forEach(book => {
        const clone = template.content.cloneNode(true); 
         clone.querySelector('.book-title').innerText = book.title;
        clone.querySelector('.book-author').innerText = `Tác giả: ${book.author || 'Chưa cập nhật'}`;    
        const quantity = book.quantity || 0;
        clone.querySelector('.stock-info').innerText = `Còn lại: ${quantity} cuốn`;
        const btn = clone.querySelector('.add-btn');
        const isOutOfStock = quantity <= 0;
        btn.innerText = isOutOfStock ? 'Hết sách' : 'Chọn mượn';
        btn.disabled = isOutOfStock;
        btn.onclick = () => addToBorrowList(book.id);
        bookContainer.appendChild(clone);
    });
}

function liveSearch() {
    const query = document.getElementById('library-search').value.toLowerCase();
    const filtered = libraryBooks.filter(b => 
        (b.title?.toLowerCase().includes(query)) || (b.id?.toLowerCase().includes(query))
    );
    renderLibrary(filtered);
}

function addToBorrowList(bookId) {
    const book = libraryBooks.find(b => b.id === bookId);
    if (!book || book.quantity <= 0) return;

    const existing = borrowList.find(item => item.id === bookId);
    if (existing) {
        if (existing.count < book.quantity) existing.count++;
        else alert("Vượt quá số lượng trong kho!");
    } else {
        borrowList.push({ ...book, count: 1 });
    }
    updateBorrowUI();
}

function updateBorrowUI() {
    const cartItems = document.getElementById('cart-items');
    const btnCheckout = document.getElementById('checkout-btn');
    const subtotalEl = document.getElementById('subtotal');
    
    if (!cartItems) return;
    cartItems.innerHTML = borrowList.map(item => `
        <div class="cart-item">
            <div class="item-info"><strong>${item.title}</strong><p>SL: ${item.count}</p></div>
            <button class="remove-btn" onclick="removeFromList('${item.id}')">Xóa</button>
        </div>`).join('') || '<p class="empty-msg">Chưa chọn sách nào.</p>';

    const total = borrowList.reduce((sum, item) => sum + item.count, 0);
    if (subtotalEl) subtotalEl.innerText = `${total} cuốn`;
    if (btnCheckout) btnCheckout.disabled = borrowList.length === 0;
}

function removeFromList(bookId) {
    borrowList = borrowList.filter(item => item.id !== bookId);
    updateBorrowUI();
}

document.getElementById('checkout-btn')?.addEventListener('click', async () => {
    const readerId = document.getElementById('reader-id-input').value.trim();
    if (!readerId) return alert("Vui lòng nhập Mã độc giả!");

    const payload = {
        User_ID: readerId, 
        sachMuon: borrowList.map(item => ({ ISBN: item.id || item.ISBN, count: item.count }))
    };

    try {
        const response = await fetch('http://localhost:5000/api/borrow/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
            alert("Mượn sách thành công!");
            borrowList = [];
            document.getElementById('reader-id-input').value = "";
            updateBorrowUI();
            loadBooks();
        }
    } catch (e) { alert("Lỗi kết nối server!"); }
});

// --- 3. QUẢN LÝ TRẢ SÁCH & ĐIỀU HƯỚNG ---
function toggleView(view) {
    const isHome = view === 'home';
    const isReturn = view === 'return';
    const isAdmin = view === 'admin';
    document.getElementById('home-section').style.display = isHome ? 'block' : 'none';
    document.getElementById('right-panel').style.display = isHome ? 'block' : 'none'; // Panel giỏ mượn chỉ hiện ở Home
    document.getElementById('return-section').style.display = isReturn ? 'block' : 'none';
    document.getElementById('admin-book-section').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('nav-home').classList.toggle('active', isHome);
    document.getElementById('nav-return').classList.toggle('active', isReturn);
    document.getElementById('admin-nav-link').classList.toggle('active', isAdmin);
}
async function filterReturnList() {
    const query = document.getElementById('return-search').value.trim();
    await loadAllBorrows(query);
}

async function loadAllBorrows(searchQuery = "") {
    try {
        const url = searchQuery 
            ? `http://localhost:5000/api/borrow/all-borrows?search=${encodeURIComponent(searchQuery)}`
            : 'http://localhost:5000/api/borrow/all-borrows';
            
        const response = await fetch(url);
        allBorrows = await response.json();
        renderReturnTable(allBorrows);
    } catch (error) {
        console.error("Lỗi tải danh sách mượn:", error);
    }
}
async function loadAdminBooks(searchQuery = "") {
    try {
        const url = searchQuery 
            ? `http://localhost:5000/api/books?search=${encodeURIComponent(searchQuery)}`
            : 'http://localhost:5000/api/books';
            
        const response = await fetch(url);
        const books = await response.json();
        renderAdminTable(books); // Hàm này vẽ dữ liệu vào bảng
    } catch (error) {
        console.error("Lỗi tải danh sách sách kho:", error);
    }
}
document.getElementById('nav-home').onclick = () => toggleView('home');
document.getElementById('nav-return').onclick = () => {
    toggleView('return');
    loadAllBorrows(); 
};
document.getElementById('admin-nav-link').onclick = () => {
    toggleView('admin');
    loadAdminBooks(); 
};  


function renderReturnTable(data) {
    const tbody = document.getElementById('master-return-list');
    if (!tbody) return;
    
    tbody.innerHTML = data.map(item => {
        const format = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : "Chưa rõ";
        const isOverdue = new Date(item.return_date) < new Date();

        return `
            <tr class="return-table-row">
                <td class="reader-id-cell">${item.reader_id}</td>
                <td>${item.reader_name || 'N/A'}</td>
                <td class="book-title-cell">${item.book_title}</td>
                <td>
                    <span class="${isOverdue ? 'status-overdue' : 'status-normal'}">
                        ${format(item.return_date)}
                    </span>
                </td>
                <td>${format(item.borrow_date)}</td>
                <td>
                    <button onclick="executeReturnBook(${item.id}, '${item.ISBN}')" class="ret-btn">
                        Thu hồi
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
async function executeReturnBook(recordId, isbn) {
    if (!confirm(`Thu hồi sách ${isbn}?`)) return;
    try {
        const res = await fetch('http://localhost:5000/api/borrow/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: recordId, ISBN: isbn })
        });
        if ((await res.json()).success) {
            alert("Thành công!");
            loadAllBorrows();
            loadBooks();
        }
    } catch (e) { alert("Lỗi kết nối!"); }
}
async function handleAdminAdd() {
    const bookData = {
        isbn: document.getElementById('admin-isbn').value,
        title: document.getElementById('admin-title').value,
        author: document.getElementById('admin-author').value,
        quantity: document.getElementById('admin-quantity').value,
        category: "General", // Giá trị tạm thời
        price: 0             // Giá trị tạm thời
    };

    try {
         const response = await fetch('http://localhost:5000/api/books/add', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            alert("Đã thêm sách thành công!");
            await loadBooks(); 
            document.querySelectorAll('#admin-book-section input').forEach(i => i.value = '');
        } else {
            const err = await response.json();
            alert("Lỗi: " + err.message);
        }
    } catch (error) {
        console.log("Lỗi kết nối:", error);
    }
}