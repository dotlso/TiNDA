const API = "http://localhost:3000";

let debtors = [];
let currentDebtorId = null;
let currentDebtorDeleteId = null;

async function loadAndDisplayDebts() {
    try {
        const res = await fetch(`${API}/debts`);
        const data = await res.json();
        debtors = Array.isArray(data) ? data : [];
        displayDebts();
    } catch (err) {
        console.error("Failed to load debts:", err);
        debtors = [];
        displayDebts();
    }
}

function displayDebts() {
    const container = document.getElementById("debt-list");
    container.innerHTML = "";

    if (debtors.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:20px; color:#888'>No debts recorded yet</p>";
        return;
    }

    debtors.forEach(debtor => {
        const debtCard = document.createElement("div");
        debtCard.className = "debt-row";

        debtCard.innerHTML = `
            <button class="delete-btn" onclick="openRemoveDebtorModal(${debtor.id})">×</button>
            <span>${debtor.customer}</span>
            <span>₱${debtor.amount}</span>
            <button class="pay-btn" onclick="openPayDebtModal(${debtor.id})">Pay</button>
            <button class="add-btn" onclick="openAddDebtModal(${debtor.id})">Add</button>
        `;

        container.appendChild(debtCard);
    });
}

async function payDebt() {
    const payment = Number(document.getElementById("pay-debt").value);
    const debtor = debtors.find(d => d.id === currentDebtorId);

    if (!debtor || payment <= 0 || debtor.amount < payment) return;

    const newAmount = debtor.amount - payment;

    if (newAmount === 0) {
        // fully paid — update sale to paid and delete the debt
        await fetch(`${API}/debts/${currentDebtorId}/pay`, {
            method: "PUT"
        });
        await fetch(`${API}/debts/${currentDebtorId}`, {
            method: "DELETE"
        });
    } else {
        // partially paid — update the amount
        await fetch(`${API}/debts/${currentDebtorId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: newAmount })
        });
    }

    closePayDebtModal();
    loadAndDisplayDebts();
}

async function addDebt() {
    const additional = Number(document.getElementById("add-debt").value);
    const debtor = debtors.find(d => d.id === currentDebtorId);

    if (!debtor || additional <= 0) return;

    const newAmount = debtor.amount + additional;

    await fetch(`${API}/debts/${currentDebtorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newAmount })
    });

    closeAddDebtModal();
    loadAndDisplayDebts();
}

async function removeDebtor() {
    await fetch(`${API}/debts/${currentDebtorDeleteId}`, {
        method: "DELETE"
    });

    closeRemoveDebtorModal();
    loadAndDisplayDebts();
}

function openPayDebtModal(id) {
    currentDebtorId = id;
    document.getElementById("payDebt-modal").style.display = "flex";
}

function closePayDebtModal() {
    document.getElementById("payDebt-modal").style.display = "none";
}

function openAddDebtModal(id) {
    currentDebtorId = id;
    document.getElementById("addDebt-modal").style.display = "flex";
}

function closeAddDebtModal() {
    document.getElementById("addDebt-modal").style.display = "none";
}

function openRemoveDebtorModal(id) {
    currentDebtorDeleteId = id;
    document.getElementById("removeDebtor-modal").style.display = "flex";
}

function closeRemoveDebtorModal() {
    document.getElementById("removeDebtor-modal").style.display = "none";
}

function displayDebts() {
    const container = document.getElementById("debt-list");
    container.innerHTML = "";

    if (debtors.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:20px; color:#888'>No debts recorded yet</p>";
        return;
    }

    debtors.forEach(debtor => {
        const debtCard = document.createElement("div");
        debtCard.className = "debt-row";

            debtCard.innerHTML = `
        <span>${debtor.customer}</span>
        <span class="sale-ref">${debtor.sale_id ? `#${debtor.sale_id}` : '—'}</span>
        <span>₱${debtor.amount}</span>
        <button class="pay-btn" onclick="openPayDebtModal(${debtor.id})">Pay</button>
        <button class="add-btn" onclick="openAddDebtModal(${debtor.id})">Add</button>
        `;

        container.appendChild(debtCard);
    });
}
document.addEventListener("DOMContentLoaded", loadAndDisplayDebts);