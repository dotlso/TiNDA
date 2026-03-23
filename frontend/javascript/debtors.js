let debtors = [];

async function loadDebtors() {
    const res = await fetch("http://localhost:3000/debts");
    debtors = await res.json();
}