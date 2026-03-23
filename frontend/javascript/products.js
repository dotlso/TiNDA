let products = [];

async function loadProducts() {
    const res = await fetch("http://localhost:3000/inventory");
    products = await res.json();
}