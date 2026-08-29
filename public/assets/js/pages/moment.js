import { $, showToast, initCommon } from "../common.js";

const BOOK_URLS = {
  any: "https://wa.me/971585969710?text=Hi%2C%20I%27d%20like%20to%20book%20Make%20It%20Your%20Moment",
  screen:
    "https://wa.me/971585969710?text=Hi%2C%20I%27d%20like%20to%20book%20Shine%20on%20Screen%20(AED%2050)",
  pyro: "https://wa.me/971585969710?text=Hi%2C%20I%27d%20like%20to%20book%20Pyro%20Moment%20(AED%20100)",
  popper:
    "https://wa.me/971585969710?text=Hi%2C%20I%27d%20like%20to%20book%20Party%20Popper%20Moment%20(AED%2050)",
  grand:
    "https://wa.me/971585969710?text=Hi%2C%20I%27d%20like%20to%20book%20The%20Grand%20Moment%20(AED%20175)",
};

function setDrawerOpen(open) {
  const toggle = $("#nav-toggle");
  const drawer = $("#lounge-drawer");
  const backdrop = $("#drawer-backdrop");
  if (!toggle || !drawer || !backdrop) return;

  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  drawer.hidden = !open;
  backdrop.hidden = !open;
  document.body.classList.toggle("lounge-drawer-open", open);
}

function initDrawer() {
  const toggle = $("#nav-toggle");
  const drawer = $("#lounge-drawer");
  const backdrop = $("#drawer-backdrop");
  if (!toggle || !drawer || !backdrop) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setDrawerOpen(!open);
  });

  backdrop.addEventListener("click", () => setDrawerOpen(false));
  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setDrawerOpen(false));
  });
}

function goToBook(id = "any") {
  const url = BOOK_URLS[id] || BOOK_URLS.any;
  window.open(url, "_blank", "noopener,noreferrer");
}

function initBrowse() {
  const grid = $("#moment-grid");
  const search = $("#moment-search");
  const filters = $("#moment-filters");
  const countEl = $("#moment-count");
  const empty = $("#moment-empty");
  if (!grid || !filters) return;

  const cards = Array.from(grid.querySelectorAll(".bg-card"));
  let activeCategory = "all";
  let query = "";

  const render = () => {
    const q = query.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const categories = (card.getAttribute("data-categories") || "").split(/\s+/);
      const name = (card.getAttribute("data-name") || "").toLowerCase();
      const catOk = activeCategory === "all" || categories.includes(activeCategory);
      const searchOk = !q || name.includes(q) || categories.some((c) => c.includes(q));
      const show = catOk && searchOk;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (countEl) {
      countEl.textContent = `${visible} moment${visible === 1 ? "" : "s"}`;
    }
    if (empty) empty.hidden = visible > 0;
    grid.hidden = visible === 0;

    if (
      typeof gsap !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const shown = cards.filter((c) => !c.hidden);
      if (shown.length) {
        gsap.from(shown, {
          opacity: 0,
          y: 18,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }
  };

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    activeCategory = btn.getAttribute("data-filter") || "all";
    filters.querySelectorAll("[data-filter]").forEach((el) => {
      const on = el === btn;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-pressed", String(on));
    });
    render();
  });

  search?.addEventListener("input", () => {
    query = search.value;
    render();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='book']");
    if (!btn) return;
    goToBook(btn.getAttribute("data-id") || "any");
  });

  $("#moment-book-any")?.addEventListener("click", () => goToBook("any"));
  $("#moment-play-featured")?.addEventListener("click", () => goToBook("grand"));

  $("#moment-reset-filters")?.addEventListener("click", () => {
    if (search) {
      search.value = "";
      query = "";
    }
    activeCategory = "all";
    filters.querySelectorAll("[data-filter]").forEach((el) => {
      const on = el.getAttribute("data-filter") === "all";
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-pressed", String(on));
    });
    render();
  });

  render();
}

function initHeroMotion() {
  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.from(".bg-hero > *", {
    opacity: 0,
    y: 20,
    duration: 0.55,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.1,
  });

  gsap.from(".bg-panel, .bg-info, .bg-footer", {
    opacity: 0,
    y: 28,
    duration: 0.55,
    ease: "power2.out",
    delay: 0.25,
    stagger: 0.08,
  });
}

function init() {
  initCommon("moment");
  initDrawer();
  initHeroMotion();
  initBrowse();
}

document.addEventListener("DOMContentLoaded", init);
