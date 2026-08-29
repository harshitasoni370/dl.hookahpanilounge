/**
 * GSAP + Lottie helpers
 */

let reducedMotion = false;

export function initMotionPrefs() {
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function playHeroIntro() {
  if (typeof gsap === "undefined" || reducedMotion) {
    document.querySelectorAll(".hero-anim").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const bg = document.querySelector(
    ".home-hero__slide.is-active, .home-hero__bg, .hero__bg, .gallery-hero__bg, .about-hero__bg, .lounge-bg__image"
  );

  if (bg) gsap.set(bg, { scale: 1.08 });
  gsap.set(".hero-anim", { opacity: 0, y: 36 });

  if (bg) tl.to(bg, { scale: 1, duration: 2.2, ease: "power2.out" }, 0);

  tl.to(
    ".hero-anim",
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      clearProps: "transform",
    },
    0.25
  );
}

export function animateCategoriesIn(container) {
  if (typeof gsap === "undefined" || reducedMotion || !container) return;

  const items = container.querySelectorAll(".category-item");
  gsap.from(items, {
    opacity: 0,
    y: 28,
    scale: 0.92,
    duration: 0.55,
    stagger: 0.04,
    ease: "power2.out",
    clearProps: "transform",
  });
}

export function animateCardsIn(container) {
  if (typeof gsap === "undefined" || reducedMotion || !container) return;

  const cards = container.querySelectorAll(".product-card, .menu-card");
  gsap.from(cards, {
    opacity: 0,
    y: 40,
    duration: 0.5,
    stagger: 0.06,
    ease: "power2.out",
    clearProps: "transform",
  });
}

export function animateViewEnter(el) {
  if (!el) return;
  if (typeof gsap === "undefined" || reducedMotion) {
    el.style.opacity = "1";
    el.style.transform = "none";
    return;
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
  );
}

export function bindCategoryHover(container) {
  if (typeof gsap === "undefined" || reducedMotion || !container) return;

  container.querySelectorAll(".category-item").forEach((item) => {
    const icon = item.querySelector(".category-item__icon");
    item.addEventListener("mouseenter", () => {
      gsap.to(icon, { scale: 1.12, duration: 0.25, ease: "power2.out" });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(icon, { scale: 1, duration: 0.25, ease: "power2.out" });
    });
  });
}

let confirmAnim = null;

export function playConfirmLottie(container) {
  if (!container) return;

  if (confirmAnim) {
    confirmAnim.destroy?.();
    confirmAnim = null;
  }

  container.innerHTML = "";
  const player = document.createElement("dotlottie-wc");
  player.setAttribute("src", "assets/images/confirm.lottie");
  player.setAttribute("autoplay", "");
  player.style.width = "100%";
  player.style.height = "100%";
  container.appendChild(player);
  confirmAnim = player;
}

export function setupScrollTriggers() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || reducedMotion) {
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
}
