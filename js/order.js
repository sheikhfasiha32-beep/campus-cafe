
const STORAGE_KEY = "cafeOrders";

const form = document.querySelector("#order-form");
const tbody = document.querySelector("#orders-body");
const message = document.querySelector("#message");
const clearButton = document.querySelector("#clear-orders");
const orderCount = document.querySelector("#order-count");

function loadOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function createOrderId() {
  return "ORD-" + Date.now().toString(36).toUpperCase()
    + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = String(value ?? "");
  row.appendChild(cell);
}

function render() {
  let orders = loadOrders();

  // Give older saved orders an ID if they do not already have one.
  let changed = false;

  orders = orders.map(function (order) {
    if (!order.id) {
      changed = true;
      return { ...order, id: createOrderId() };
    }

    return order;
  });

  if (changed) {
    saveOrders(orders);
  }

  tbody.replaceChildren();

  orderCount.textContent =
    "You have placed " + orders.length +
    (orders.length === 1 ? " order." : " orders.");

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

    addCell(row, order.id);
    addCell(row, order.name);
    addCell(row, order.item + " (" + (order.size || "N/A") + ")");
    addCell(row, order.qty);
    addCell(row, order.pickup);

    const extras = Array.isArray(order.extras) ? order.extras : [];
    addCell(row, extras.length ? extras.join(", ") : "None");

    tbody.appendChild(row);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const data = new FormData(form);

  const order = {
    id: createOrderId(),
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || ""),
    item: String(data.get("item") || ""),
    size: String(data.get("size") || ""),
    qty: Number(data.get("qty")),
    extras: data.getAll("extras"),
    pickup: String(data.get("pickup") || ""),
    notes: String(data.get("notes") || "").trim()
  };

  const orders = loadOrders();
  orders.push(order);

  try {
    saveOrders(orders);
    form.reset();

    message.textContent =
      "Thank you, " + order.name +
      "! Your order ID is " + order.id + ".";

    render();
  } catch (error) {
    message.textContent =
      "The order could not be saved. Please check browser storage.";
  }
});

clearButton.addEventListener("click", function () {
  const confirmed = window.confirm(
    "Are you sure you want to delete all saved orders?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  message.textContent = "All saved orders were cleared.";
  render();
});

render();
