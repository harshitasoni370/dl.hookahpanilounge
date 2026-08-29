import { $, initCommon } from "../common.js";

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

function initOfferMotion() {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const sheet = document.querySelector(".offer-sheet");
  if (!sheet) return;

  gsap.fromTo(
    sheet,
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", clearProps: "transform" }
  );

  const items = sheet.querySelectorAll(
    ".offer-sheet__benefits li, .offer-sheet__list li, .offer-moment, .offer-package, .form-group, .form-check"
  );
  if (!items.length) return;

  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 12 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.07,
      delay: 0.15,
      ease: "power2.out",
      clearProps: "transform",
    }
  );
}

initCommon();
initDrawer();
initOfferMotion();
