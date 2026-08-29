import { formatAED } from "../cart.js";
import { $, initCommon, loadOrder } from "../common.js";

function set(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

function formatOrderTime(iso) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "—";

  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${month} ${year}, ${time}`;
}

function formatPhone(countryCode, phone) {
  const code = countryCode || "+971";
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "—";

  if (code === "+971" && digits.length === 9) {
    return `+971 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  if (code === "+91" && digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return `${code} ${digits}`;
}

function formatTable(table) {
  if (!table) return "—";
  const raw = String(table).trim();
  if (/^table\s+/i.test(raw)) return raw;
  return `Table ${raw}`;
}

function renderSummary(order) {
  const list = $("#confirm-summary-list");
  if (!list) return;

  const items = Array.isArray(order.items) ? order.items : [];
  list.innerHTML = items
    .map((item) => {
      const qty = item.qty || 1;
      const lineTotal = (Number(item.price) || 0) * qty;
      return `<li>
        <span><span class="qty">${qty}×</span>${item.name || "Item"}</span>
        <span>${formatAED(lineTotal)}</span>
      </li>`;
    })
    .join("");

  set("#confirm-summary-total", formatAED(order.total || 0));
}

function renderConfirm(order) {
  const customer = order.customer || {};

  set("#confirm-order-id", order.id || "—");
  set("#confirm-order-time", formatOrderTime(order.createdAt));
  set("#confirm-table", formatTable(customer.table));
  set("#confirm-phone", formatPhone(customer.countryCode, customer.phone));
  renderSummary(order);
}

function initSummaryToggle() {
  const btn = $("#btn-view-summary");
  const panel = $("#confirm-summary");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const open = panel.hasAttribute("hidden");
    if (open) panel.removeAttribute("hidden");
    else panel.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function init() {
  initCommon("confirm");

  const order = loadOrder();
  if (!order) {
    window.location.href = "explore-menu.html";
    return;
  }

  renderConfirm(order);
  initSummaryToggle();
}

document.addEventListener("DOMContentLoaded", init);
