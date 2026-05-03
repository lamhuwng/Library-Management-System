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

function renderLibrary(booksToRender) {
    const bookContainer = document.getElementById('product-list');
    if (!bookContainer) return;
    bookContainer.innerHTML = booksToRender.map(book => {
        const isOutOfStock = book.quantity <= 0;
        return `
            <div class="book-item">
                <h3>${book.title}</h3>
                <p>Tác giả: ${book.author || 'Chưa cập nhật'}</p>
                <p class="stock">Còn lại: ${book.quantity || 0} cuốn</p> 
                <button class="add-btn" ${isOutOfStock ? 'disabled' : ''} 
                    onclick="addToBorrowList('${book.id}')">
                    ${isOutOfStock ? 'Hết sách' : 'Chọn mượn'}
                </button>
            </div>`;
    }).join('');
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
    document.getElementById('home-section').style.display = isHome ? 'block' : 'none';
    document.getElementById('right-panel').style.display = isHome ? 'block' : 'none';
    document.getElementById('return-section').style.display = isHome ? 'none' : 'block';
    
    document.getElementById('nav-home').classList.toggle('active', isHome);
    document.getElementById('nav-return').classList.toggle('active', !isHome);
}
async function filterReturnList() {
    const query = document.getElementById('return-search').value.trim();
    
    // Gọi lại hàm load dữ liệu nhưng truyền thêm tham số tìm kiếm
    await loadAllBorrows(query);
}

// Cập nhật lại hàm loadAllBorrows để chấp nhận tham số search
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
document.getElementById('nav-home').onclick = () => toggleView('home');
document.getElementById('nav-return').onclick = () => {
    toggleView('return');
    loadAllBorrows(); // Tải danh sách khi chuyển trang
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