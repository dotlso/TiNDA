const API = "http://localhost:3000";

let products = [];
let categories = [];
let currentEditId = null;
let currentDeleteId = null;
let currentFilter = null;

async function loadAndDisplay() {
    const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/inventory`),
        fetch(`${API}/categories`)
    ]);
    products = await prodRes.json();
    categories = await catRes.json();
    displayInventory();
    populateCategoryFilters();
    populateCategoryDropdowns();
}

function displayInventory(productArray = products) {
    const container = document.getElementById("inventory-list");
    container.innerHTML = "";

    const filtered = currentFilter
        ? productArray.filter(p => p.category_id === currentFilter)
        : productArray;

    if (filtered.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:20px; color:#888'>No products found</p>";
        return;
    }

    filtered.forEach(product => {
        const row = document.createElement("div");
        row.classList.add("list-row");

        row.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-stock">${product.stock}</div>
            <div class="product-price">₱ ${product.price}</div>
            <div class="actions">
                <button class="edit-btn" onclick="editInventory(${product.id})">Edit</button>
                <button class="remove-btn" onclick="openDeleteModal(${product.id})">Remove</button>
            </div>
        `;

        container.appendChild(row);
    });
}

// ── Category filters (dropdown) ──

function populateCategoryFilters() {
    const dropdown = document.getElementById("sort-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `
        <div class="sort-option ${!currentFilter ? 'active' : ''}" onclick="filterByCategory(null)">All</div>
    `;

    categories.forEach(cat => {
        const div = document.createElement("div");
        div.className = `sort-option ${currentFilter === cat.id ? 'active' : ''}`;
        div.textContent = cat.name;
        div.onclick = () => filterByCategory(cat.id);
        dropdown.appendChild(div);
    });
}

function toggleSortDropdown() {
    document.getElementById("sort-dropdown").classList.toggle("open");
}

function filterByCategory(categoryId) {
    currentFilter = categoryId;

    const btn = document.querySelector(".sort-btn");
    if (categoryId === null) {
        btn.innerHTML = `<i class='bx bx-filter-alt'></i> Sort by Category <i class='bx bx-chevron-down'></i>`;
    } else {
        const cat = categories.find(c => c.id === categoryId);
        btn.innerHTML = `<i class='bx bx-filter-alt'></i> ${cat.name} <i class='bx bx-chevron-down'></i>`;
    }

    document.getElementById("sort-dropdown").classList.remove("open");
    displayInventory();
    populateCategoryFilters();
}

// ── Category dropdowns in modals ──

function populateCategoryDropdowns() {
    ["add-category", "edit-category"].forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;

        select.innerHTML = `<option value="">-- No Category --</option>`;

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    });
}

// ── Inline category creation ──

function openAddCategoryInline(context) {
    document.getElementById(`${context}-new-cat-box`).style.display = "block";
}

function closeAddCategoryInline(context) {
    document.getElementById(`${context}-new-cat-box`).style.display = "none";
    document.getElementById(`${context}-new-cat-input`).value = "";
}

async function saveNewCategory(context) {
    const input = document.getElementById(`${context}-new-cat-input`);
    const name = input.value.trim();
    if (!name) return;

    const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });

    if (res.ok) {
        const data = await res.json();
        categories.push(data);
        populateCategoryDropdowns();
        populateCategoryFilters();
        document.getElementById(`${context}-category`).value = data.id;
        closeAddCategoryInline(context);
    }
}

// ── Manage categories modal ──

async function addNewCategory() {
    const input = document.getElementById("new-category-name");
    const name = input.value.trim();
    if (!name) return;

    const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });

    if (res.ok) {
        input.value = "";
        closeManageCategoriesModal();
        loadAndDisplay();
    } else {
        const data = await res.json();
        alert("Error: " + data.error);
    }
}

async function deleteCategory(id) {
    await fetch(`${API}/categories/${id}`, { method: "DELETE" });
    await loadAndDisplay();
    openManageCategoriesModal();
}

function openManageCategoriesModal() {
    const container = document.getElementById("category-list-modal");
    container.innerHTML = "";

    categories.forEach(cat => {
        const div = document.createElement("div");
        div.className = "category-item";
        div.innerHTML = `
            <span>${cat.name}</span>
            <button class="delete-cat-btn" onclick="deleteCategory(${cat.id})">Remove</button>
        `;
        container.appendChild(div);
    });

    document.getElementById("manage-categories-modal").style.display = "flex";
}

function closeManageCategoriesModal() {
    document.getElementById("manage-categories-modal").style.display = "none";
}

// ── CRUD ──

function editInventory(id) {
    const product = products.find(p => p.id === id);
    document.getElementById("edit-name").value = product.name;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-stock").value = product.stock;
    document.getElementById("edit-category").value = product.category_id || "";
    currentEditId = id;
    openEditModal();
}

async function saveEdit() {
    const name = document.getElementById("edit-name").value;
    const price = Number(document.getElementById("edit-price").value);
    const stock = Number(document.getElementById("edit-stock").value);
    const category_id = document.getElementById("edit-category").value || null;

    await fetch(`${API}/inventory/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, stock, category_id })
    });

    closeEditModal();
    loadAndDisplay();
}

async function addProduct() {
    const name = document.getElementById("product-name").value;
    const price = Number(document.getElementById("product-price").value);
    const stock = Number(document.getElementById("product-stock").value);
    const category_id = document.getElementById("add-category").value || null;

    await fetch(`${API}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, stock, category_id })
    });

    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-stock").value = "";
    document.getElementById("add-category").value = "";

    closeAddModal();
    loadAndDisplay();
}

async function removeProduct() {
    await fetch(`${API}/inventory/${currentDeleteId}`, { method: "DELETE" });
    closeDeleteModal();
    loadAndDisplay();
}

// ── Modal toggles ──

function openEditModal() {
    document.getElementById("edit-modal").style.display = "flex";
    document.querySelector('.back-btn').style.display = 'none';
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
    document.querySelector('.back-btn').style.display = 'flex';
}

function openAddModal() {
    document.getElementById("add-modal").style.display = "flex";
}

function closeAddModal() {
    document.getElementById("add-modal").style.display = "none";
}

function openDeleteModal(id) {
    currentDeleteId = id;
    document.getElementById("delete-modal").style.display = "flex";
    document.querySelector('.back-btn').style.display = 'none';
}

function closeDeleteModal() {
    document.getElementById("delete-modal").style.display = "none";
    document.querySelector('.back-btn').style.display = 'flex';
}

// ── Init ──

document.addEventListener("DOMContentLoaded", function () {
    loadAndDisplay();

    // close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        const wrapper = document.querySelector(".sort-dropdown-wrapper");
        if (wrapper && !wrapper.contains(e.target)) {
            document.getElementById("sort-dropdown").classList.remove("open");
        }
    });

    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.toLowerCase().trim();
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        displayInventory(filtered);
    });

    searchInput.addEventListener('input', function () {
        if (searchInput.value.trim() === "") displayInventory();
    });
});