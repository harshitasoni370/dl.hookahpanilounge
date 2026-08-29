import { playHeroIntro } from "../animations.js";
import { $, $$, initCommon, initSiteHeader } from "../common.js";

function initFilters() {
  const buttons = $$(".gallery-filters__btn");
  const items = $$(".gallery-mosaic__item");
  const mosaic = $("#gallery-mosaic");
  if (!buttons.length || !items.length) return;

  const apply = (filter) => {
    mosaic?.classList.toggle("is-filtered", filter !== "all");
    items.forEach((item) => {
      const cats = (item.dataset.category || "").toLowerCase();
      const show = filter === "all" || cats.split(/\s+/).includes(filter);
      item.classList.toggle("is-hidden", !show);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      apply(filter);
    });
  });
}

function initLightbox() {
  const root = $("#gallery-lightbox");
  const image = $("#lightbox-image");
  const caption = $("#lightbox-caption");
  const prev = $("#lightbox-prev");
  const next = $("#lightbox-next");
  if (!root || !image) return;

  const triggers = $$("[data-lightbox]");
  let index = 0;
  let visibleItems = [];

  const getVisible = () =>
    $$(".gallery-mosaic__item").filter((item) => !item.classList.contains("is-hidden"));

  const render = () => {
    const item = visibleItems[index];
    if (!item) return;
    const img = item.querySelector("img");
    if (!img) return;
    image.src = img.currentSrc || img.src;
    image.alt = img.alt || "";
    if (caption) caption.textContent = img.alt || "";
  };

  const open = (startIndex) => {
    visibleItems = getVisible();
    if (!visibleItems.length) return;
    index = Math.max(0, Math.min(startIndex, visibleItems.length - 1));
    root.hidden = false;
    document.body.style.overflow = "hidden";
    render();
    root.querySelector(".gallery-lightbox__close")?.focus();
  };

  const close = () => {
    root.hidden = true;
    document.body.style.overflow = "";
  };

  const step = (delta) => {
    if (!visibleItems.length) return;
    index = (index + delta + visibleItems.length) % visibleItems.length;
    render();
  };

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const figure = btn.closest(".gallery-mosaic__item");
      visibleItems = getVisible();
      const start = visibleItems.indexOf(figure);
      open(start < 0 ? 0 : start);
    });
  });

  root.querySelectorAll("[data-lightbox-close]").forEach((el) => {
    el.addEventListener("click", close);
  });
  prev?.addEventListener("click", () => step(-1));
  next?.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (root.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".gallery-filters__btn", {
    opacity: 0,
    y: 16,
    duration: 0.45,
    stagger: 0.04,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".gallery-filters",
      start: "top 88%",
      once: true,
    },
  });

  gsap.from(".gallery-mosaic__item", {
    opacity: 0,
    y: 28,
    duration: 0.55,
    stagger: 0.06,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".gallery-mosaic",
      start: "top 82%",
      once: true,
    },
  });

  gsap.from(".gallery-cta__inner > *", {
    opacity: 0,
    y: 24,
    duration: 0.55,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".gallery-cta",
      start: "top 85%",
      once: true,
    },
  });
}

function init() {
  initCommon("gallery");
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  initSiteHeader();
  playHeroIntro();
  initFilters();
  initLightbox();
  initScrollAnimations();
}

document.addEventListener("DOMContentLoaded", init);
