import { $, $$, showToast, initCommon } from "../common.js";

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

const iconPlayers = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.2"/><path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35"/><path d="M16.5 3.7a3.2 3.2 0 0 1 0 6.2"/></svg>`;
const iconClock = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
const iconLevel = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20V8"/></svg>`;
const iconBell = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>`;

function createModal({ title, bodyHtml, confirmLabel, onConfirm }) {
  const existing = $("#bg-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "bg-modal";
  modal.className = "bg-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "bg-modal-title");
  modal.innerHTML = `
    <div class="bg-modal__backdrop" data-bg-close></div>
    <div class="bg-modal__dialog">
      <button type="button" class="bg-modal__close" data-bg-close aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <h2 id="bg-modal-title">${title}</h2>
      <div class="bg-modal__body">${bodyHtml}</div>
      ${
        confirmLabel
          ? `<button type="button" class="bg-modal__confirm" id="bg-modal-confirm">${confirmLabel}</button>`
          : ""
      }
    </div>
  `;
  document.body.appendChild(modal);
  document.body.classList.add("bg-modal-open");

  const onEsc = (e) => {
    if (e.key === "Escape") close();
  };

  const close = () => {
    document.removeEventListener("keydown", onEsc);
    modal.remove();
    document.body.classList.remove("bg-modal-open");
  };

  modal.querySelectorAll("[data-bg-close]").forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", onEsc);

  const confirmBtn = $("#bg-modal-confirm");
  if (confirmBtn && onConfirm) {
    confirmBtn.addEventListener("click", () => {
      const ok = onConfirm(modal);
      if (ok !== false) close();
    });
  }

  const first = modal.querySelector("input, button");
  first?.focus();
  return { modal, close };
}

const CHECKOUT_URL =
  "https://wa.me/971585969710?text=Hi%2C%20I%27d%20like%20to%20request%20a%20board%20game";

function goToCheckout() {
  window.open(CHECKOUT_URL, "_blank", "noopener,noreferrer");
}

function openHowToPlay(game) {
  createModal({
    title: `How to Play — ${game.name}`,
    bodyHtml: `<p class="bg-modal__text">${game.howToPlay}</p>
      <ul class="bg-modal__meta">
        <li>${iconPlayers}<span>Players: ${game.players}</span></li>
        <li>${iconClock}<span>Duration: ${game.duration}</span></li>
        <li>${iconLevel}<span>Difficulty: ${game.difficulty}</span></li>
      </ul>`,
  });
}

function openNotify(game) {
  createModal({
    title: `Notify — ${game.name}`,
    bodyHtml: `
      <p class="bg-modal__text">This game is currently in use. Leave your table number and we'll notify you when it's free.</p>
      <label class="bg-modal__field">
        <span>Table number</span>
        <input type="text" id="bg-table-number" name="table" inputmode="numeric" placeholder="e.g. 12" required maxlength="10" autocomplete="off" />
      </label>
    `,
    confirmLabel: "Notify Me",
    onConfirm: (modal) => {
      const table = modal.querySelector("#bg-table-number");
      if (!table?.value.trim()) {
        table?.focus();
        showToast("Please enter your table number");
        return false;
      }
      showToast(`We'll notify table ${table.value.trim()} when ${game.name} is available`);
      return true;
    },
  });
}

function renderCard(game) {
  const available = game.status === "available";
  const actions = available
    ? `<div class="bg-card__actions">
        <button type="button" class="bg-card__btn bg-card__btn--outline" data-action="howto" data-id="${game.id}">How to Play</button>
        <button type="button" class="bg-card__btn bg-card__btn--solid" data-action="request" data-id="${game.id}">Request Game</button>
      </div>`
    : `<div class="bg-card__actions bg-card__actions--single">
        <button type="button" class="bg-card__btn bg-card__btn--notify" data-action="notify" data-id="${game.id}">
          ${iconBell}
          <span>Notify When Available</span>
        </button>
      </div>`;

  return `
    <article class="bg-card" data-categories="${game.categories.join(" ")}" data-name="${game.name.toLowerCase()}" data-id="${game.id}">
      <div class="bg-card__media bg-card__media--${game.cover}">
        <img
          src="assets/images/games/${game.cover}.webp"
          alt="${game.name} board game"
          width="640"
          height="400"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="bg-card__body">
        <h3 class="bg-card__title">${game.name}</h3>
        <ul class="bg-card__meta">
          <li>${iconPlayers}<span>Players: ${game.players}</span></li>
          <li>${iconClock}<span>Duration: ${game.duration}</span></li>
          <li>${iconLevel}<span>Difficulty: ${game.difficulty}</span></li>
        </ul>
        <div class="bg-card__status bg-card__status--${available ? "available" : "busy"}">
          <span class="bg-card__status-dot" aria-hidden="true"></span>
          <span>${available ? "Available" : "In Use"}</span>
        </div>
        ${actions}
      </div>
    </article>
  `;
}

function filterGames(games, category, query) {
  const q = query.trim().toLowerCase();
  return games.filter((game) => {
    const catOk = category === "all" || game.categories.includes(category);
    const searchOk =
      !q ||
      game.name.toLowerCase().includes(q) ||
      game.difficulty.toLowerCase().includes(q) ||
      game.categories.some((c) => c.includes(q));
    return catOk && searchOk;
  });
}

function updateEmptyState(count) {
  const empty = $("#bg-empty");
  const grid = $("#bg-grid");
  if (!empty || !grid) return;
  empty.hidden = count > 0;
  grid.hidden = count === 0;
}

function initBrowse(data) {
  const grid = $("#bg-grid");
  const search = $("#bg-search");
  const filters = $("#bg-filters");
  const countEl = $("#bg-count");
  if (!grid || !filters) return;

  let activeCategory = "all";
  let query = "";

  const render = () => {
    const list = filterGames(data.games, activeCategory, query);
    grid.innerHTML = list.map(renderCard).join("");
    updateEmptyState(list.length);
    if (countEl) {
      countEl.textContent = `${list.length} game${list.length === 1 ? "" : "s"}`;
    }

    if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.from(".bg-card", {
        opacity: 0,
        y: 18,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "all",
      });
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
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const game = data.games.find((g) => g.id === id);
    if (!game) return;
    const action = btn.getAttribute("data-action");
    if (action === "howto") openHowToPlay(game);
    if (action === "request") goToCheckout();
    if (action === "notify") openNotify(game);
  });

  $("#bg-request-any")?.addEventListener("click", goToCheckout);

  $("#bg-play-featured")?.addEventListener("click", goToCheckout);

  $("#bg-reset-filters")?.addEventListener("click", () => {
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

async function init() {
  initCommon("board-games");
  initDrawer();
  initHeroMotion();

  try {
    const res = await fetch("assets/data/board-games.json");
    if (!res.ok) throw new Error("Failed to load games");
    const data = await res.json();
    initBrowse(data);
  } catch (err) {
    console.error(err);
    showToast("Unable to load games. Please refresh.");
    const empty = $("#bg-empty");
    if (empty) {
      empty.hidden = false;
      empty.querySelector("p").textContent = "Unable to load games right now.";
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
