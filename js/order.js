
// Lab 4: save orders in localStorage and show them safely.
const STORAGE_KEY = "cafeOrders";

const form = document.querySelector("#order-form");
const tbody = document.querySelector("#orders-body");
const message = document.querySelector("#message");
const clearButton = document.querySelector("#clear-orders");

// Read the saved orders. If nothing is saved, use an empty list.
function loadOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// Add one table cell safely.
function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
}

function render() {
  const orders = loadOrders();
  tbody.innerHTML = "";

  if (orders.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "No orders saved yet.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  orders.forEach(function (order) {
    const row = document.createElement("tr");
    addCell(row, order.name);
    addCell(row, order.item);
    addCell(row, String(order.qty));
    addCell(row, order.size);
    addCell(row, order.pickup);
    addCell(row, order.extras.length ? order.extras.join(", ") : "none");
    tbody.appendChild(row);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = new FormData(form);
  const order = {
    name: data.get("customerName").trim(),
    phone: data.get("customerPhone"),
    item: data.get("item"),
    size: data.get("size"),
    qty: Number(data.get("quantity")),
    extras: data.getAll("extras"),
    pickup: data.get("pickupTime"),
    notes: data.get("notes").trim()
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  form.reset();
  message.textContent =
    "Thank you, " + order.name + "! Your order has been saved.";
  render();
});

clearButton.addEventListener("click", function () {
  localStorage.removeItem(STORAGE_KEY);
  message.textContent = "All saved orders were cleared.";
  render();
});

render();
