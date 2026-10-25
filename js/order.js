
"use strict";

const form = document.getElementById("order-form");
const ordersList = document.getElementById("orders-list");
const message = document.getElementById("message");
const clearOrdersButton = document.getElementById("clear-orders");

const STORAGE_KEY = "campusCafeOrders";

function getOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const orders = JSON.parse(saved);

    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Could not read saved orders:", error);
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error("Could not save orders:", error);
    showMessage(
      "Orders could not be saved. Please check your browser storage.",
      "error"
    );
    return false;
  }
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function renderOrders() {
  const orders = getOrders();
  ordersList.replaceChildren();

  if (orders.length === 0) {
    const row = document.createElement("tr");
    const cell = createCell("No orders yet.");
    cell.colSpan = 7;
    row.appendChild(cell);
    ordersList.appendChild(row);
    return;
  }

  orders.forEach(function (order) {
    const row = document.createElement("tr");

    row.appendChild(createCell(order.customerName));
    row.appendChild(createCell(order.item));
    row.appendChild(createCell(String(order.quantity)));
    row.appendChild(createCell(order.size));
    row.appendChild(createCell(order.pickup));
    row.appendChild(
      createCell(order.extras.length ? order.extras.join(", ") : "None")
    );

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-order";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete this order");

    deleteButton.addEventListener("click", function () {
      deleteOrder(order.id);
    });

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    ordersList.appendChild(row);
  });
}

function deleteOrder(id) {
  const remainingOrders = getOrders().filter(function (order) {
    return order.id !== id;
  });

  if (saveOrders(remainingOrders)) {
    renderOrders();
    showMessage("Order deleted successfully.", "success");
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  const order = {
    id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8),
    customerName: String(formData.get("customerName")).trim(),
    phone: String(formData.get("phone")).trim(),
    item: String(formData.get("item")),
    quantity: Number(formData.get("quantity")),
    size: String(formData.get("size")),
    extras: formData.getAll("extras").map(String),
    pickup: String(formData.get("pickup")),
    notes: String(formData.get("notes") || "").trim()
  };

  if (
    !order.customerName ||
    !order.phone ||
    !order.item ||
    !Number.isInteger(order.quantity) ||
    order.quantity < 1 ||
    order.quantity > 20 ||
    !order.size ||
    !order.pickup
  ) {
    showMessage("Please check all required fields.", "error");
    return;
  }

  const orders = getOrders();
  orders.push(order);

  if (saveOrders(orders)) {
    renderOrders();
    form.reset();
    showMessage("Your order has been saved successfully.", "success");
  }
});

form.addEventListener("reset", function () {
  showMessage("", "");
});

clearOrdersButton.addEventListener("click", function () {
  const orders = getOrders();

  if (orders.length === 0) {
    showMessage("There are no saved orders to clear.", "error");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete all saved orders?"
  );

  if (!confirmed) {
    return;
  }

  if (saveOrders([])) {
    renderOrders();
    showMessage("All saved orders have been cleared.", "success");
  }
});

renderOrders();
