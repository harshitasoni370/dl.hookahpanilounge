import { getCartCount, loadCart } from "./cart.js";
import { NAV_ICONS } from "./icons.js";
import { initMotionPrefs, setupScrollTriggers } from "./animations.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const CHECKOUT_KEY = "ff_checkout_v1";
const ORDER_KEY = "ff_last_order_v1";

let menuCache = null;

export async function loadMenu() {
  if (menuCache) return menuCache;
  const res = await fetch("assets/data/menu.json");
  if (!res.ok) throw new Error("Failed to load menu data");
  menuCache = await res.json();
  return menuCache;
}

export function showToast(message) {
  let toast = $("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

export function updateCartBadges() {
  const count = getCartCount();
  $$("[data-cart-count]").forEach((el) => {
    el.textContent = String(count);
    el.classList.toggle("is-visible", count > 0);
  });
}

export function injectNavIcons() {
  $$("[data-icon]").forEach((el) => {
    const key = el.dataset.icon;
    if (NAV_ICONS[key]) el.innerHTML = NAV_ICONS[key];
  });
}

export function setActiveNav(_page) {
  /* bottom nav removed — kept for API compatibility */
}

export function initHeaderScroll() {
  const header = $(".hero__top");
  if (!header) return;

  const enterAt = 16;
  const leaveAt = 4;
  let scrolled = false;

  const sync = () => {
    const y = window.scrollY;
    if (!scrolled && y > enterAt) {
      scrolled = true;
      header.classList.add("is-scrolled");
    } else if (scrolled && y <= leaveAt) {
      scrolled = false;
      header.classList.remove("is-scrolled");
    }
  };

  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

export function initSiteHeader() {
  const header = $("#site-header");
  const toggle = $("#nav-toggle");
  const nav = $("#site-nav");
  if (!header) return;

  const sync = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };
  sync();
  window.addEventListener("scroll", sync, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }
}

export function saveCheckout(data) {
  const prev = loadCheckout();
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify({ ...prev, ...data }));
}

export function loadCheckout() {
  try {
    return JSON.parse(sessionStorage.getItem(CHECKOUT_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveOrder(order) {
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function loadOrder() {
  try {
    return JSON.parse(sessionStorage.getItem(ORDER_KEY) || "null");
  } catch {
    return null;
  }
}

export function requireCartOrRedirect() {
  if (!loadCart().length) {
    showToast("Add something delicious first");
    window.location.href = "menu.html";
    return false;
  }
  return true;
}

export function initCommon(page) {
  initMotionPrefs();
  setupScrollTriggers();
  injectNavIcons();
  updateCartBadges();
  setActiveNav(page);
  initHeaderScroll();
}
