import { addToCart, formatAED } from "../cart.js";
import { getCategoryIcon } from "../icons.js";
import { animateCardsIn } from "../animations.js";
import { $, $$, initCommon, loadMenu, showToast, updateCartBadges } from "../common.js";

const state = {
  data: null,
  activeCategory: "starters",
  vegFilter: "veg",
};

function getCatFromUrl() {
  return new URLSearchParams(location.search).get("cat") || "starters";
}

function syncTabLabels() {
  const cat = state.data?.categories.find((c) => c.id === state.activeCategory);
  const name = cat?.name || "Items";
  const vegBtn = $('[data-veg-filter="veg"]');
  const nonBtn = $('[data-veg-filter="nonveg"]');
  if (vegBtn) vegBtn.textContent = `Vegetarian ${name}`;
  if (nonBtn) nonBtn.textContent = `Non-Vegetarian ${name}`;
}

function renderCategoryBar() {
  const bar = $("#menu-category-bar");
  if (!bar || !state.data) return;

  bar.innerHTML = state.data.categories
    .map(
      (cat) => `
      <a href="menu.html?cat=${encodeURIComponent(cat.id)}"
         class="menu-categories__item ${cat.id === state.activeCategory ? "is-active" : ""}"
         aria-label="${cat.name}">
        <span class="menu-categories__icon">${getCategoryIcon(cat.icon)}</span>
        <span class="menu-categories__label">${cat.name}</span>
      </a>`
    )
    .join("");

  const active = bar.querySelector(".menu-categories__item.is-active");
  active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function renderMenu() {
  if (!state.data) return;

  const cat = state.data.categories.find((c) => c.id === state.activeCategory);
  const title = $("#menu-title");
  const subtitle = $("#menu-subtitle");

  if (title) title.textContent = cat ? cat.name : "Menu";
  if (subtitle) {
    subtitle.textContent = cat?.blurb
      || `Explore our handcrafted vegetarian & non-vegetarian ${(cat?.name || "items").toLowerCase()}.`;
  }

  syncTabLabels();
  renderCategoryBar();

  let products = state.data.products.filter((p) => p.category === state.activeCategory);
  if (state.vegFilter === "veg") products = products.filter((p) => p.veg);
  if (state.vegFilter === "nonveg") products = products.filter((p) => !p.veg);

  const grid = $("#product-grid");
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = `<p class="menu-grid__empty">No items in this selection.</p>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (p) => `
      <article class="menu-card" data-product="${p.id}">
        <div class="menu-card__media">
          <img src="${p.image}" alt="${p.name}" loading="lazy" width="400" height="300" />
        </div>
        <div class="menu-card__body">
          <h3 class="menu-card__name">${p.name}</h3>
          <p class="menu-card__desc">${p.description}</p>
          <div class="menu-card__footer">
            <span class="menu-card__price">${formatAED(p.price)}</span>
            <button type="button" class="menu-card__add" data-add="${p.id}">+ Add to Cart</button>
          </div>
        </div>
      </article>`
    )
    .join("");

  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = state.data.products.find((p) => p.id === btn.dataset.add);
      if (!product) return;
      addToCart(product);
      updateCartBadges();
      showToast(`${product.name} added to cart`);
      gsap?.fromTo?.(btn, { scale: 0.96 }, { scale: 1, duration: 0.25, ease: "back.out(2)" });
    });
  });

  requestAnimationFrame(() => animateCardsIn(grid));
}

async function init() {
  initCommon("menu");
  state.activeCategory = getCatFromUrl();

  $$("[data-veg-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.vegFilter = btn.dataset.vegFilter;
      $$("[data-veg-filter]").forEach((b) => {
        const active = b.dataset.vegFilter === state.vegFilter;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      renderMenu();
    });
  });

  try {
    state.data = await loadMenu();
    if (!state.data.categories.some((c) => c.id === state.activeCategory)) {
      state.activeCategory = state.data.categories.find((c) => c.id === "starters")?.id
        || state.data.categories[0]?.id
        || "starters";
    }
    renderMenu();
  } catch (err) {
    console.error(err);
    showToast("Could not load menu. Please refresh.");
  }
}

document.addEventListener("DOMContentLoaded", init);
