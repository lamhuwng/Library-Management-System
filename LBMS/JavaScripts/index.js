
let libraryBooks = [];
let borrowList = [];
async function loadBooks() {
    try {
        const response = await fetch('http://localhost:5000/api/books');
        libraryBooks = await response.json();
        renderLibrary(libraryBooks); 
    } catch (error) {
        console.error("Lỗi kết nối server:", error);
        document.getElementById('product-list').innerHTML = '<p class="empty-msg">Không thể kết nối Backend.</p>';
    }
}
function renderLibrary(booksToRender) {
    const bookContainer = document.getElementById('product-list');
    if (!bookContainer) return;
    bookContainer.innerHTML = '';

    if (!booksToRender || booksToRender.length === 0) {
        bookContainer.innerHTML = '<p class="empty-msg">Không tìm thấy sách phù hợp.</p>';
        return;
    }
    booksToRender.forEach(book => {
          const isOutOfStock = book.quantity <= 0;
        
        const card = document.createElement('div');
        card.className = 'book-item';
        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>Tác giả: ${book.author || 'Chưa cập nhật'}</p>
            <p class="stock">Còn lại: ${book.quantity || 0} cuốn</p> 
            <button class="add-btn" 
                ${isOutOfStock ? 'disabled' : ''} 
                onclick="addToBorrowList('${book.id}')">
                ${isOutOfStock ? 'Hết sách' : 'Chọn mượn'}
            </button>
        `;
        bookContainer.appendChild(card);
    });
}
function liveSearch() {
    const query = document.getElementById('library-search').value.toLowerCase();
    const filteredBooks = libraryBooks.filter(book => 
        (book.title && book.title.toLowerCase().includes(query)) || 
        (book.author && book.author.toLowerCase().includes(query)) ||
        (book.id && book.id.toLowerCase().includes(query)) 
    );
    renderLibrary(filteredBooks);
}


function addToBorrowList(bookId) {
    const book = libraryBooks.find(b => b.id === bookId);
    if (!book) return;

    const existingEntry = borrowList.find(item => item.id === bookId);

    if (existingEntry) {
        if (existingEntry.count < book.quantity) {
            existingEntry.count += 1;
        } else {
            alert("Số lượng mượn đã đạt giới hạn hiện có trong thư viện!");
        }
    } else {
        if (book.quantity > 0) {
            borrowList.push({ ...book, count: 1 });
        }
    }
    updateBorrowUI();
}
function updateBorrowUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const btnCheckout = document.getElementById('checkout-btn');
    const subtotalEl = document.getElementById('subtotal');
    
    if (!cartItemsContainer || !btnCheckout) return;

    cartItemsContainer.innerHTML = '';

    if (borrowList.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Chưa chọn sách nào.</p>';
        btnCheckout.disabled = true;
        if (subtotalEl) subtotalEl.innerText = '0 cuốn';
    } else {
        btnCheckout.disabled = false;
        let totalCount = 0;

        borrowList.forEach(item => {
            totalCount += item.count;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="item-info">
                    <strong>${item.title}</strong>
                    <p>SL: ${item.count}</p>
                </div>
                <button class="remove-btn" onclick="removeFromList('${item.id}')">Xóa</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
        
        if (subtotalEl) subtotalEl.innerText = totalCount + ' cuốn';
    }
}

function removeFromList(bookId) {
    borrowList = borrowList.filter(item => item.id !== bookId);
    updateBorrowUI();
}
document.getElementById('checkout-btn')?.addEventListener('click', async function() {
    // Nếu giỏ hàng trống thì không làm gì cả
    if (borrowList.length === 0) return;

    try {
        // Gửi dữ liệu xuống file backend PHP
        const response = await fetch('muon_sach.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                maDocGia: 1, // Tạm fix cứng mã độc giả là 1 (Luan Vu)
                sachMuon: borrowList 
            })
        });

        // Chờ PHP phản hồi kết quả về
        const data = await response.json();

        // Xử lý giao diện dựa trên kết quả
        if (data.success) {
            alert("Thành công: " + data.message);
            borrowList = []; // Xóa sạch giỏ hàng
            updateBorrowUI(); // Cập nhật lại giao diện panel bên phải[cite: 19]
            
            // Gọi lại loadBooks() để cập nhật lại số lượng sách tồn kho mới nhất[cite: 19]
            loadBooks(); 
        } else {
            alert("Lỗi từ hệ thống: " + data.message);
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Không thể kết nối đến máy chủ xử lý mượn sách!");
    }
});

loadBooks();