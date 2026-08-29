import { getCategoryIcon } from "../icons.js";
import { animateCategoriesIn, bindCategoryHover } from "../animations.js";
import { $, $$, initCommon, loadMenu, showToast } from "../common.js";

function categoryTile(cat, { href, extraClass = "" } = {}) {
  const link = href || `menu.html?cat=${encodeURIComponent(cat.id)}`;
  const classes = ["category-item", extraClass].filter(Boolean).join(" ");
  return `
    <a href="${link}" class="${classes}" aria-label="${cat.name}">
      <span class="category-item__icon">${getCategoryIcon(cat.icon)}</span>
      <span class="category-item__label">${cat.name}</span>
    </a>`;
}

function renderCategories(data) {
  const grid = $("#category-grid");
  if (!grid) return;

  grid.innerHTML = data.categories.map((cat) => categoryTile(cat)).join("");

  requestAnimationFrame(() => {
    animateCategoriesIn(grid);
    bindCategoryHover(grid);
  });
}

function renderShishaSection(data) {
  const section = $("#shisha-section");
  const grid = $("#shisha-grid");
  if (!section || !grid) return;

  const subs = data.shishaCategories || [];
  if (!subs.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;

  $$("[data-shisha-heading-icon]").forEach((el) => {
    el.innerHTML = getCategoryIcon("shisha");
  });

  grid.innerHTML = subs
    .map((cat) =>
      categoryTile(cat, {
        href: `menu.html?cat=shisha&sub=${encodeURIComponent(cat.id)}`,
        extraClass: "category-item--shisha",
      })
    )
    .join("");

  requestAnimationFrame(() => {
    animateCategoriesIn(grid);
    bindCategoryHover(grid);
  });
}

async function init() {
  initCommon("categories");

  try {
    const data = await loadMenu();
    renderCategories(data);
    renderShishaSection(data);
  } catch (err) {
    console.error(err);
    showToast("Could not load menu. Please refresh.");
  }
}

document.addEventListener("DOMContentLoaded", init);
