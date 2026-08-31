import {
  loadCart,
  setQty,
  removeFromCart,
  formatAED,
} from "../cart.js";
import { NAV_ICONS } from "../icons.js";
import {
  $,
  initCommon,
  loadMenu,
  showToast,
  updateCartBadges,
  requireCartOrRedirect,
} from "../common.js";

let productLookup = null;

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function ensureProductLookup() {
  if (productLookup) return productLookup;
  try {
    const data = await loadMenu();
    productLookup = new Map((data.products || []).map((p) => [p.id, p]));
  } catch {
    productLookup = new Map();
  }
  return productLookup;
}

function enrichItem(item) {
  if (item.description) return item;
  const product = productLookup?.get(item.id);
  return product?.description ? { ...item, description: product.description } : item;
}

function renderCart() {
  const list = $("#cart-list");
  const panel = $("#cart-panel");
  const empty = $("#cart-empty");
  const items = loadCart().map(enrichItem);

  if (!list) return;

  if (!items.length) {
    list.innerHTML = "";
    panel?.classList.add("hidden");
    empty?.classList.remove("hidden");
    return;
  }

  panel?.classList.remove("hidden");
  empty?.classList.add("hidden");

  list.innerHTML = items
    .map((item) => {
      const desc = item.description
        ? `<p class="cart-item__desc">${escapeHtml(item.description)}</p>`
        : "";
      return `
      <div class="cart-item" data-cart-id="${escapeHtml(item.id)}" role="row">
        <div class="cart-item__product" role="cell">
          <img
            class="cart-item__img"
            src="${escapeHtml(item.image)}"
            alt="${escapeHtml(item.name)}"
            width="72"
            height="72"
            loading="lazy"
          />
          <div class="cart-item__info">
            <h3 class="cart-item__name">${escapeHtml(item.name)}</h3>
            ${desc}
          </div>
        </div>
        <div class="cart-item__price" role="cell">${formatAED(item.price)}</div>
        <div class="cart-item__qty" role="cell">
          <div class="qty-control">
            <button type="button" class="qty-control__btn" data-qty-dec="${escapeHtml(item.id)}" aria-label="Decrease quantity">−</button>
            <span class="qty-control__val">${item.qty}</span>
            <button type="button" class="qty-control__btn" data-qty-inc="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item__remove" role="cell">
          <button type="button" class="cart-remove-btn" data-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)}">
            ${NAV_ICONS.trash}
          </button>
        </div>
      </div>`;
    })
    .join("");

  list.querySelectorAll("[data-qty-inc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = loadCart().find((i) => i.id === btn.dataset.qtyInc);
      if (item) {
        setQty(item.id, item.qty + 1);
        renderCart();
        updateCartBadges();
      }
    });
  });

  list.querySelectorAll("[data-qty-dec]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = loadCart().find((i) => i.id === btn.dataset.qtyDec);
      if (item) {
        setQty(item.id, item.qty - 1);
        renderCart();
        updateCartBadges();
      }
    });
  });

  list.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.remove);
      renderCart();
      updateCartBadges();
      showToast("Item removed");
    });
  });
}

async function init() {
  initCommon("cart");
  await ensureProductLookup();
  renderCart();

  $("#btn-checkout")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (requireCartOrRedirect()) {
      window.location.href =
        "https://wa.me/971509002202?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order";
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
