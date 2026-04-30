
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
document.getElementById('checkout-btn')?.addEventListener('click', function() {
    alert("Hệ thống đã ghi nhận yêu cầu mượn " + document.getElementById('subtotal').innerText);
    borrowList = [];
    updateBorrowUI();
});

loadBooks();