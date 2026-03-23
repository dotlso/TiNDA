const API = "http://localhost:3000";

let products = [];
let categories = [];
let cart = [];
let currentCategory = null;

// ── Load data ──

async function loadProducts() {
    const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/inventory`),
        fetch(`${API}/categories`)
    ]);

    const prodData = await prodRes.json();
    const catData = await catRes.json();

    products = Array.isArray(prodData) ? prodData : [];
    categories = Array.isArray(catData) ? catData : [];

    buildCategoryNav();
    displayProducts();
}

// ── Category sidebar ──

function buildCategoryNav() {
    const nav = document.getElementById("category-nav");
    nav.innerHTML = "";

    // All button
    const allBtn = document.createElement("button");
    allBtn.className = "cat-btn" + (currentCategory === null ? " active" : "");
    allBtn.textContent = "All";
    allBtn.onclick = () => filterByCategory(null);
    nav.appendChild(allBtn);

    // Category buttons
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "cat-btn" + (currentCategory === cat.id ? " active" : "");
        btn.textContent = cat.name;
        btn.onclick = () => filterByCategory(cat.id);
        nav.appendChild(btn);
    });
}

function filterByCategory(categoryId) {
    currentCategory = categoryId;
    buildCategoryNav();
    displayProducts();
}

// ── Products ──

function displayProducts(productArray = products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    const filtered = currentCategory
        ? productArray.filter(p => p.category_id === currentCategory)
        : productArray;

    if (filtered.length === 0) {
        container.innerHTML = "<p class='empty-msg'>No products found</p>";
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-card-name">${product.name}</div>
            <div class="product-card-price">₱ ${product.price}</div>
            <button class="product-card-btn" onclick="handleAddToCart(${product.id})">+</button>
        `;
        container.appendChild(card);
    });
}

// ── Cart ──

function handleAddToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) addToCart(product);
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    displayCart();
}

function removeFromCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (!existing) return;

    if (existing.quantity > 1) {
        existing.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    displayCart();
}

function displayCart() {
    const container = document.getElementById("cart-list");
    container.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span class="item-name">${item.name}</span>
            <div class="item-qty-controls">
                <button class="qty-btn" onclick="removeFromCart(${item.id})">−</button>
                <span class="item-qty">${item.quantity}</span>
                <button class="qty-btn" onclick="handleAddToCart(${item.id})">+</button>
            </div>
            <span class="item-subtotal">₱ ${item.price * item.quantity}</span>
        `;
        container.appendChild(div);
    });

    document.getElementById("cart-total").textContent =
        `Total: ₱ ${calculateCartTotal()}`;
}

function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ── Modals ──

function openCancelModal() {
    document.getElementById("cancel-modal").style.display = "flex";
}

function closeCancelModal() {
    document.getElementById("cancel-modal").style.display = "none";
}

function confirmCancel() {
    cart = [];
    displayCart();
    closeCancelModal();
}

function openEmptyCartModal() {
    document.getElementById("empty-cart-modal").style.display = "flex";
}

function closeEmptyCartModal() {
    document.getElementById("empty-cart-modal").style.display = "none";
}

function openCompleteModal() {
    document.getElementById("complete-modal").style.display = "flex";
}

function closeCompleteModal() {
    document.getElementById("complete-modal").style.display = "none";
}

function completeSale() {
    if (cart.length === 0) {
        openEmptyCartModal();
        return;
    }
    openCompleteModal();
}

function openDebtCustomerModal() {
    closeCompleteModal();
    document.getElementById("debt-customer-modal").style.display = "flex";
}

function closeDebtCustomerModal() {
    document.getElementById("debt-customer-modal").style.display = "none";
    document.getElementById("debt-customer-name").value = "";
}

async function confirmCompleteSale(paymentType = "paid") {
    // validate customer name if debt
    if (paymentType === "debt") {
        const customerName = document.getElementById("debt-customer-name").value.trim();
        if (!customerName) {
            alert("Please enter a customer name");
            return;
        }
    }

    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const res = await fetch(`${API}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, payment_type: paymentType })
    });

    const data = await res.json();

    if (!res.ok) {
        alert("Error: " + data.error);
        return;
    }

    // if debt, create a debt entry linked to this sale
    if (paymentType === "debt") {
        const customerName = document.getElementById("debt-customer-name").value.trim();
        const total = calculateCartTotal();

        await fetch(`${API}/debts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer: customerName,
                amount: total,
                sale_id: data.sale_id
            })
        });

        closeDebtCustomerModal();
    } else {
        closeCompleteModal();
    }

    cart = [];
    displayCart();
    loadProducts();
}

// ── Init ──

document.addEventListener("DOMContentLoaded", function () {
    loadProducts();

    document.getElementById("cancelOrderBtn").addEventListener("click", function () {
        if (cart.length === 0) {
            openEmptyCartModal();
            return;
        }
        openCancelModal();
    });

    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.toLowerCase().trim();
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        displayProducts(filtered);
    });

    searchInput.addEventListener('input', function () {
        if (searchInput.value.trim() === "") displayProducts();
    });
});