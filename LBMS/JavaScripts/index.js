// 1. Dữ liệu Danh mục Sách
const libraryBooks = [
    { id: 101, title: "Lập trình Web nâng cao", author: "Vũ Đức Long", quantity: 5 },
    { id: 102, title: "Cơ sở dữ liệu MySQL", author: "Trần Hoàng Huy", quantity: 2 },
    { id: 103, title: "Nhập môn Công nghệ phần mềm", author: "Trương Lâm Hưng", quantity: 0 },
    { id: 104, title: "Cấu trúc dữ liệu và Giải thuật", author: "Phan Ngọc Khoa", quantity: 8 },
    { id: 105, title: "Khai phá dữ liệu", author: "Trương Hà Vũ Hiệu", quantity: 3 }
];

let borrowList = [];

// Hàm định dạng hiển thị
function formatUnit(count) {
    return count + ' cuốn';
}

// 2. Hàm Tìm kiếm nhanh (Khớp với onkeyup="liveSearch()")
function liveSearch() {
    const query = document.getElementById('library-search').value.toLowerCase();
    const filteredBooks = libraryBooks.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    renderLibrary(filteredBooks); // Gọi lại hàm render với danh sách đã lọc
}

// 3. Hiển thị Danh mục sách (Cập nhật để nhận tham số danh sách)
function renderLibrary(booksToRender = libraryBooks) {
    const bookContainer = document.getElementById('product-list');
    if (!bookContainer) return;
    
    bookContainer.innerHTML = '';

    if (booksToRender.length === 0) {
        bookContainer.innerHTML = '<p class="empty-msg">Không tìm thấy sách phù hợp.</p>';
        return;
    }

    booksToRender.forEach(book => {
        const isOutOfStock = book.quantity === 0;
        const card = document.createElement('div');
        card.className = 'book-item';
        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>Tác giả: ${book.author}</p>
            <p class="stock">Còn lại: ${book.quantity}</p>
            <button class="add-btn" 
                ${isOutOfStock ? 'disabled' : ''} 
                onclick="addToBorrowList(${book.id})">
                ${isOutOfStock ? 'Hết sách' : 'Chọn mượn'}
            </button>
        `;
        bookContainer.appendChild(card);
    });
}

// 4. Thêm sách vào danh sách chờ mượn
function addToBorrowList(bookId) {
    const book = libraryBooks.find(b => b.id === bookId);
    const existingEntry = borrowList.find(item => item.id === bookId);

    if (existingEntry) {
        if (existingEntry.count < book.quantity) {
            existingEntry.count += 1;
        } else {
            alert("Số lượng mượn không được vượt quá số lượng trong kho!");
        }
    } else {
        borrowList.push({ ...book, count: 1 });
    }
    updateBorrowUI();
}

// 5. Cập nhật giao diện Giỏ mượn (Panel bên phải)
function updateBorrowUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const btnCheckout = document.getElementById('checkout-btn');
    
    cartItemsContainer.innerHTML = '';

    if (borrowList.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Chưa chọn sách nào.</p>';
        btnCheckout.disabled = true;
    } else {
        btnCheckout.disabled = false;
        borrowList.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="item-info">
                    <strong>${item.title}</strong>
                    <p>SL: ${item.count}</p>
                </div>
                <button class="remove-btn" onclick="removeFromList(${item.id})">Xóa</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }
    calculateTotalBooks();
}

function removeFromList(bookId) {
    borrowList = borrowList.filter(item => item.id !== bookId);
    updateBorrowUI();
}

function calculateTotalBooks() {
    let totalCount = 0;
    borrowList.forEach(item => totalCount += item.count);
    document.getElementById('subtotal').innerText = formatUnit(totalCount);
}

// 6. Xử lý sự kiện Xác nhận mượn
document.getElementById('checkout-btn').addEventListener('click', function() {
    alert("Hệ thống đã ghi nhận yêu cầu mượn " + document.getElementById('subtotal').innerText);
    borrowList = [];
    updateBorrowUI();
});

// Khởi tạo ban đầu
renderLibrary();