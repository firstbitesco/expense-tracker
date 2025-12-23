const GOOGLE_SHEET_URL = "PASTE_YOUR_SCRIPT_URL_HERE";

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
  const desc = description.value.trim();
  const amt = amount.value;

  if (!desc || !amt) return alert("Fill all fields");

  const expense = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    description: desc,
    amount: Number(amt)
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: JSON.stringify(expense)
  });

  description.value = amount.value = "";
  render();
}

function render() {
  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach(e => {
    total += e.amount;
    expenseList.innerHTML += `
      <div class="item">
        <div>
          <b>${e.description}</b><br>
          <small>${e.date}</small>
        </div>
        <div>
          ₹${e.amount}<br>
          <button class="delete" onclick="remove(${e.id})">X</button>
        </div>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

function remove(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

function exportCSV() {
  let csv = "Date,Description,Amount\n";
  expenses.forEach(e => csv += `${e.date},${e.description},${e.amount}\n`);

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.csv";
  a.click();
}

render();
