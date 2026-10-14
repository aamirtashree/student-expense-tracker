const STORAGE_KEY = "pocketpal-expenses-v1";
const BUDGET_KEY = "pocketpal-budget-v1";

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const emptyState = document.getElementById("emptyState");
const filterCategory = document.getElementById("filterCategory");
const budgetInput = document.getElementById("budgetInput");
const formMessage = document.getElementById("formMessage");

const categoryIcons = {
  Food: "🍜",
  Travel: "🚌",
  Education: "📚",
  Shopping: "🛍️",
  Bills: "🧾",
  Other: "✨"
};

let expenses = loadExpenses();
let budget = loadBudget();

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function loadBudget() {
  const saved = Number(localStorage.getItem(BUDGET_KEY));
  return Number.isFinite(saved) && saved >= 0 ? saved : 5000;
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount);
}

function currentMonthExpenses() {
  const now = new Date();
  return expenses.filter((expense) => {
    const date = new Date(`${expense.date}T00:00:00`);
    return date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  });
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function updateSummary() {
  const monthExpenses = currentMonthExpenses();
  const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - total;
  const percentage = budget > 0 ? Math.min((total / budget) * 100, 100) : (total > 0 ? 100 : 0);

  document.getElementById("totalSpent").textContent = formatMoney(total);
  document.getElementById("remaining").textContent = formatMoney(remaining);
  document.getElementById("remaining").style.color = remaining < 0 ? "#e05265" : "";
  document.getElementById("transactionCount").textContent = monthExpenses.length;
  document.getElementById("budgetPercent").textContent = `${Math.round(budget > 0 ? (total / budget) * 100 : (total > 0 ? 100 : 0))}%`;
  document.getElementById("budgetBar").style.width = `${percentage}%`;
  document.getElementById("budgetHint").textContent =
    total > budget ? `You are ${formatMoney(total - budget)} over budget.` :
    total === 0 ? "You’re off to a fresh start!" :
    `${formatMoney(Math.max(remaining, 0))} left in your budget.`;
  budgetInput.value = budget;
}

function renderExpenses() {
  const selectedCategory = filterCategory.value;
  const filtered = expenses
    .filter((expense) => selectedCategory === "All" || expense.category === selectedCategory)
    .sort((a, b) => b.createdAt - a.createdAt);

  expenseList.innerHTML = "";
  emptyState.style.display = filtered.length ? "none" : "block";

  filtered.forEach((expense) => {
    const item = document.createElement("div");
    item.className = "expense-item";

    const icon = document.createElement("div");
    icon.className = "category-icon";
    icon.textContent = categoryIcons[expense.category] || "✨";

    const info = document.createElement("div");
    info.className = "expense-info";
    const title = document.createElement("div");
    title.className = "expense-title";
    title.textContent = expense.description;
    const meta = document.createElement("div");
    meta.className = "expense-meta";
    meta.textContent = `${expense.category} · ${formatDate(expense.date)}`;
    info.append(title, meta);

    const right = document.createElement("div");
    right.className = "expense-right";
    const amount = document.createElement("div");
    amount.className = "expense-amount";
    amount.textContent = formatMoney(expense.amount);
    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${expense.description}`);
    remove.addEventListener("click", () => deleteExpense(expense.id));
    right.append(amount, remove);

    item.append(icon, info, right);
    expenseList.appendChild(item);
  });

  document.getElementById("listCount").textContent =
    `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;
}

function refresh() {
  updateSummary();
  renderExpenses();
}

function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  saveExpenses();
  refresh();
}

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = document.getElementById("description").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("expenseDate").value;

  if (!description || !Number.isFinite(amount) || amount <= 0 || !date) {
    formMessage.style.color = "#d15b70";
    formMessage.textContent = "Please enter a description, valid amount, and date.";
    return;
  }

  expenses.push({
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    description,
    amount,
    category,
    date,
    createdAt: Date.now()
  });

  saveExpenses();
  expenseForm.reset();
  document.getElementById("expenseDate").value = new Date().toISOString().slice(0, 10);
  formMessage.style.color = "#21a67a";
  formMessage.textContent = "Expense added successfully!";
  refresh();
});

document.getElementById("saveBudgetBtn").addEventListener("click", () => {
  const value = Number(budgetInput.value);
  if (!Number.isFinite(value) || value < 0) {
    formMessage.style.color = "#d15b70";
    formMessage.textContent = "Enter a valid budget amount.";
    return;
  }
  budget = value;
  localStorage.setItem(BUDGET_KEY, String(budget));
  formMessage.style.color = "#21a67a";
  formMessage.textContent = "Monthly budget saved!";
  updateSummary();
});

filterCategory.addEventListener("change", renderExpenses);

document.getElementById("clearAllBtn").addEventListener("click", () => {
  if (!expenses.length) return;
  const confirmed = window.confirm("Delete all saved expenses? This cannot be undone.");
  if (!confirmed) return;
  expenses = [];
  saveExpenses();
  refresh();
  formMessage.textContent = "All expenses cleared.";
});

document.getElementById("todayLabel").textContent = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric"
});
document.getElementById("expenseDate").value = new Date().toISOString().slice(0, 10);
refresh();
