import { playHeroIntro } from "../animations.js";
import { $, showToast, initCommon } from "../common.js";

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

function initViewportAnimations() {
  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.from(".lounge-card", {
    opacity: 0,
    y: 16,
    duration: 0.45,
    stagger: 0.06,
    delay: 0.35,
    ease: "power2.out",
    clearProps: "transform",
  });

  gsap.from(".lounge-panel", {
    opacity: 0,
    y: 14,
    duration: 0.45,
    stagger: 0.1,
    delay: 0.55,
    ease: "power2.out",
  });

  gsap.from(".lounge-highlight", {
    opacity: 0,
    y: 10,
    duration: 0.4,
    stagger: 0.06,
    delay: 0.7,
    ease: "power2.out",
  });
}

function initConnectToast() {
  const cta = $("#connect");
  if (!cta) return;

  cta.addEventListener("click", (e) => {
    const href = cta.getAttribute("href") || "";

    // Legacy in-page Wi-Fi toast
    if (href === "#connect") {
      e.preventDefault();
      const toast = $("#toast");
      if (!toast) return;
      toast.textContent = "Connecting you to free Wi-Fi…";
      toast.classList.add("is-visible");
      clearTimeout(initConnectToast._t);
      initConnectToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2400);
      return;
    }

    // Force full navigation so #reserve is applied on the destination page
    if (/#reserve$/i.test(href)) {
      e.preventDefault();
      window.location.assign(href);
    }
  });
}

function initReserveModal() {
  const modal = $("#reserve-modal");
  const form = $("#reserve-form");
  const note = $("#reserve-note");
  if (!modal) return;

  let lastFocus = null;

  const getFocusable = () =>
    [
      ...modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
    ].filter((el) => !el.hasAttribute("hidden") && el.offsetParent !== null);

  const open = () => {
    if (!modal.hidden) return;
    lastFocus = document.activeElement;
    setDrawerOpen(false);
    modal.hidden = false;
    document.body.classList.add("reserve-modal-open");
    const first = modal.querySelector("input, select, textarea, button");
    (first || modal.querySelector("[data-reserve-close]"))?.focus();

    if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        ".reserve-modal__dialog",
        { opacity: 0, y: 18, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
      );
      gsap.fromTo(".reserve-modal__backdrop", { opacity: 0 }, { opacity: 1, duration: 0.28 });
    }
  };

  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("reserve-modal-open");
    if (note) note.textContent = "";
    lastFocus?.focus?.();
  };

  document.querySelectorAll("[data-reserve-open]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });
  });

  modal.querySelectorAll("[data-reserve-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!modal.hidden) {
        e.preventDefault();
        close();
        return;
      }
      setDrawerOpen(false);
      return;
    }

    if (e.key !== "Tab" || modal.hidden) return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  if (window.location.hash === "#reserve") {
    open();
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  if (!form) return;

  const dateInput = form.querySelector('input[name="date"]');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (note) note.textContent = "Reservation request received. We'll confirm shortly.";
    showToast("Table reservation submitted");
    form.reset();
    setTimeout(close, 1200);
  });
}

function init() {
  initCommon("lounge");
  initDrawer();
  initConnectToast();
  initReserveModal();
  playHeroIntro();
  initViewportAnimations();
}

document.addEventListener("DOMContentLoaded", init);
