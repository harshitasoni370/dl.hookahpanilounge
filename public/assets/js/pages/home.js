import { playHeroIntro } from "../animations.js";
import { $, $$, initCommon, initSiteHeader, showToast } from "../common.js";

function initReserveForm() {
  const form = $("#reserve-form");
  const note = $("#reserve-note");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (note) note.textContent = "Reservation request received. We’ll confirm shortly.";
    showToast("Table reservation submitted");
    form.reset();
  });
}

function initHeroCarousel() {
  const slides = $$(".home-hero__slide");
  const prev = $("#hero-prev");
  const next = $("#hero-next");
  const dotsWrap = $("#hero-dots");
  if (slides.length < 2) return;

  let index = 0;
  let timer = null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `home-hero__dot${i === index ? " is-active" : ""}`;
      btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
      btn.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(btn);
    });
  };

  const goTo = (nextIndex) => {
    slides[index]?.classList.remove("is-active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index]?.classList.add("is-active");
    if (dotsWrap) {
      $$(".home-hero__dot", dotsWrap).forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    }
    restart();
  };

  const restart = () => {
    if (reduced) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 6500);
  };

  prev?.addEventListener("click", () => goTo(index - 1));
  next?.addEventListener("click", () => goTo(index + 1));
  renderDots();
  restart();
}

function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const activeSlide = $(".home-hero__slide.is-active");
  if (activeSlide) {
    gsap.to(".home-hero__slides", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: ".home-hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  gsap.utils
    .toArray(".home-strip, .home-menu, .home-hubs, .home-gallery-teaser, .home-reviews, .home-reserve")
    .forEach((section) => {
      gsap.from(
        section.querySelectorAll(
          ".home-heading, .home-copy, .home-strip__item, .home-menu__card, .home-hub, .home-gallery-teaser__grid figure, .home-google-card, .home-reserve__form, .home-reviews__summary"
        ),
        {
          opacity: 0,
          y: 28,
          duration: 0.65,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        }
      );
    });
}

function initHashScroll() {
  const hash = window.location.hash;
  if (!hash || hash === "#") return;

  const target = document.querySelector(hash);
  if (!target) return;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const scrollToTarget = () => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Native #hash scroll often fails on first load with smooth scrolling + deferred assets
  requestAnimationFrame(() => setTimeout(scrollToTarget, 80));
  window.addEventListener("load", () => setTimeout(scrollToTarget, 120), { once: true });
}

function init() {
  initCommon("home");
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  initSiteHeader();
  playHeroIntro();
  initHeroCarousel();
  initReserveForm();
  initScrollAnimations();
  initHashScroll();
}

document.addEventListener("DOMContentLoaded", init);
