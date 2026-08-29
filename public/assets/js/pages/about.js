import { playHeroIntro } from "../animations.js";
import { $, initCommon, initSiteHeader } from "../common.js";

function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".about-page .home-strip__item", {
    opacity: 0,
    y: 20,
    duration: 0.45,
    stagger: 0.06,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about-page .home-strip",
      start: "top 88%",
      once: true,
    },
  });

  gsap.from(".about-welcome__media, .about-welcome__content > *", {
    opacity: 0,
    y: 28,
    duration: 0.55,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about-welcome",
      start: "top 82%",
      once: true,
    },
  });

  gsap.from(".about-stats li", {
    opacity: 0,
    y: 18,
    duration: 0.45,
    stagger: 0.07,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about-stats",
      start: "top 88%",
      once: true,
    },
  });

  gsap.from(".about-special__card", {
    opacity: 0,
    y: 24,
    duration: 0.5,
    stagger: 0.07,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: {
      trigger: ".about-special__grid",
      start: "top 82%",
      once: true,
    },
  });

  gsap.from(".about-vibe__gallery figure, .about-vibe__content > *", {
    opacity: 0,
    y: 24,
    duration: 0.5,
    stagger: 0.07,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: {
      trigger: ".about-vibe",
      start: "top 80%",
      once: true,
    },
  });

  gsap.from(".about-closing__inner > *, .about-page .gallery-cta__inner > *", {
    opacity: 0,
    y: 18,
    duration: 0.5,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about-closing",
      start: "top 88%",
      once: true,
    },
  });
}

function init() {
  initCommon("about");
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  initSiteHeader();
  playHeroIntro();
  initScrollAnimations();
}

document.addEventListener("DOMContentLoaded", init);
