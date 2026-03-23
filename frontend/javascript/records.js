const API = "http://localhost:3000";

async function loadAndDisplayRecords() {
    try {
        const res = await fetch(`${API}/reports/transactions`);
        const records = await res.json();

        const container = document.getElementById("records-body");

        if (!Array.isArray(records) || records.length === 0) {
            container.innerHTML = "<p style='text-align:center; padding:20px; color:#888'>No sales recorded yet</p>";
            return;
        }

        container.innerHTML = "";

        records.forEach(record => {
            const row = document.createElement("div");
            row.classList.add("list-row");

            const isPaid = record.payment_type === "paid" || !record.payment_type;
            const tag = isPaid
                ? `<span class="tag tag-paid">Paid</span>`
                : `<span class="tag tag-debt">Debt</span>`;

            row.innerHTML = `
                <div class="sale-id">${record.id}</div>
                <div class="sale-date">${record.date}</div>
                <div class="sale-items">${record.items}</div>
                <div class="sale-total">₱ ${record.total}</div>
                <div class="sale-tag">${tag}</div>
            `;

            container.appendChild(row);
        });

    } catch (err) {
        console.error("Failed to load records:", err);
    }
}

async function loadBestSellers() {
    try {
        const res = await fetch(`${API}/reports/sales`);
        const records = await res.json();

        const container = document.getElementById("best-sellers");
        if (!container) return;

        container.innerHTML = "<h3>Best Sellers</h3>";

        if (!Array.isArray(records) || records.length === 0) {
            container.innerHTML += "<p style='padding:10px; color:#888'>No data yet</p>";
            return;
        }

        records.forEach(item => {
            const div = document.createElement("div");
            div.textContent = `${item.name} — Sold: ${item.total_sold}, Revenue: ₱${item.revenue}`;
            container.appendChild(div);
        });

    } catch (err) {
        console.error("Failed to load best sellers:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAndDisplayRecords();
    loadBestSellers();
});