/*
 * Prashik Koirala — portfolio interactions
 * Plain JavaScript. No bundler or build command.
 * 1. Navigation and contact work independently of the animation libraries.
 * 2. GSAP owns each reveal once; no competing tweens on the same element.
 * 3. Motion responds to accessibility preferences, even when changed live.
 */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const header = $(".nav");
  const menuButton = $(".nav__toggle");
  const mobileNav = $(".nav__mobile");
  const progress = $(".scroll-progress");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const desktopNav = window.matchMedia("(min-width: 801px)");
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  let lenis = null;
  let menuOpen = false;
  let introPlayed = false;
  let motionContext = null;
  let pointerContext = null;
  let stopSmoothScroll = () => {};
  let stopPointerEffects = () => {};
  const revealed = new WeakSet();
  const revealTweens = new Map();

  $("#year").textContent = String(new Date().getFullYear());

  // Mobile navigation remains keyboard accessible and closes on Escape,
  // outside clicks, link selection, or a move to the desktop breakpoint.
  function setMenu(open, returnFocus = false) {
    menuOpen = open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mobileNav.hidden = !open;
    header.classList.toggle("is-open", open);
    if (returnFocus) menuButton.focus();
  }

  menuButton.addEventListener("click", () => setMenu(!menuOpen));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) setMenu(false, true);
  });
  document.addEventListener("click", (event) => {
    if (menuOpen && !header.contains(event.target)) setMenu(false);
  });
  header.addEventListener("focusout", () => {
    requestAnimationFrame(() => {
      if (menuOpen && !header.contains(document.activeElement)) setMenu(false);
    });
  });
  desktopNav.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  // One inexpensive scroll update for the header, progress line, and nav.
  const navLinks = $$(".nav__links a");
  const watchedSections = $$("main > section[id]");
  let framePending = false;
  let lastActiveId = "";
  function updateScrollUI() {
    const scrollY = window.scrollY;
    header.classList.toggle("is-scrolled", scrollY > 18);
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    const readingLine = scrollY + header.offsetHeight + window.innerHeight * 0.25;
    let activeId = "top";
    watchedSections.forEach((section) => {
      if (section.getBoundingClientRect().top + scrollY <= readingLine) activeId = section.id;
    });
    if (activeId !== lastActiveId) {
      navLinks.forEach((link) => {
        if (link.hash === `#${activeId}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      lastActiveId = activeId;
    }
    framePending = false;
  }
  function queueScrollUI() {
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(updateScrollUI);
    }
  }
  window.addEventListener("scroll", queueScrollUI, { passive: true });
  window.addEventListener("resize", queueScrollUI, { passive: true });
  updateScrollUI();

  function focusDestination(target) {
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
    target.focus({ preventScroll: true });
  }

  // Native anchors are the fallback. Lenis enhances them only when active.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    setMenu(false);
    if (!lenis || link.classList.contains("skip-link")) return;
    event.preventDefault();
    try {
      if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
    } catch {
      // Some file:// contexts disallow history updates. Scrolling still works.
    }
    lenis.scrollTo(target, {
      offset: -(header.offsetHeight + 20),
      duration: 1.05,
      onComplete: () => focusDestination(target),
    });
  });

  // Copy works over HTTPS and has a file:// fallback for local review.
  const copyButton = $(".copy-email");
  const email = $(".email-link").textContent.trim();
  const toast = $(".toast");
  let toastTimer;
  let copyTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
  }
  function legacyCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.readOnly = true;
    field.style.cssText = "position:fixed;left:-9999px;top:0;font-size:16px";
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, field.value.length);
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      /* Link remains usable. */
    }
    field.remove();
    copyButton.focus({ preventScroll: true });
    return copied;
  }
  copyButton.addEventListener("click", async () => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch {
      /* Try the local-file-compatible fallback below. */
    }
    if (!copied) copied = legacyCopy(email);
    if (copied) {
      clearTimeout(copyTimer);
      $("use", copyButton).setAttribute("href", "#icon-check");
      copyButton.setAttribute("aria-label", "Email copied");
      notify("Email address copied.");
      copyTimer = setTimeout(() => {
        $("use", copyButton).setAttribute("href", "#icon-copy");
        copyButton.setAttribute("aria-label", "Copy email address");
      }, 2500);
    } else {
      notify("Select the email address to copy it, or click it to write a message.");
    }
  });

  // If a keyboard user reaches a section during its entrance, reveal it now.
  document.addEventListener("focusin", (event) => {
    let element = event.target.closest("[data-reveal]");
    while (element) {
      revealed.add(element);
      const tween = revealTweens.get(element);
      if (tween) {
        tween.progress(1);
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        revealTweens.delete(element);
      }
      element = element.parentElement ? element.parentElement.closest("[data-reveal]") : null;
    }
  });

  // Pointer motion is subtle and never applied to touch devices.
  function setupPointerEffects() {
    stopPointerEffects();
    stopPointerEffects = () => {};
    if (!gsap || motionPreference.matches || !finePointer.matches) return;
    const listeners = [];
    pointerContext = gsap.context(() => {
      $$("[data-magnetic]").forEach((button) => {
        const xTo = gsap.quickTo(button, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(button, "y", { duration: 0.45, ease: "power3.out" });
        let bounds;
        const enter = () => {
          bounds = button.getBoundingClientRect();
        };
        const move = (event) => {
          if (!bounds) enter();
          xTo((event.clientX - bounds.left - bounds.width / 2) * 0.11);
          yTo((event.clientY - bounds.top - bounds.height / 2) * 0.17);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
          bounds = null;
        };
        button.addEventListener("pointerenter", enter);
        button.addEventListener("pointermove", move);
        button.addEventListener("pointerleave", leave);
        button.addEventListener("blur", leave);
        listeners.push(() => {
          button.removeEventListener("pointerenter", enter);
          button.removeEventListener("pointermove", move);
          button.removeEventListener("pointerleave", leave);
          button.removeEventListener("blur", leave);
        });
      });
    });
    stopPointerEffects = () => {
      listeners.forEach((remove) => remove());
      pointerContext?.revert();
      pointerContext = null;
    };
  }

  function setupMotion() {
    stopSmoothScroll();
    stopSmoothScroll = () => {};
    stopPointerEffects();
    motionContext?.revert();
    motionContext = null;
    revealTweens.clear();
    if (!gsap || motionPreference.matches) return;

    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Wheel smoothing only; native touch scrolling remains intact.
    if (window.Lenis) {
      lenis = new window.Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });
      const activeLenis = lenis;
      const tick = (time) => activeLenis.raf(time * 1000);
      const onScroll = () => ScrollTrigger?.update();
      activeLenis.on("scroll", onScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stopSmoothScroll = () => {
        gsap.ticker.remove(tick);
        activeLenis.off("scroll", onScroll);
        activeLenis.destroy();
        if (lenis === activeLenis) lenis = null;
      };
    }

    motionContext = gsap.context(() => {
      if (!introPlayed && window.scrollY < 80 && !window.location.hash) {
        introPlayed = true;
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero__status", {
            opacity: 0,
            y: 8,
            duration: 0.6,
            clearProps: "transform,opacity",
          })
          .from(
            ".hero__line",
            { yPercent: 110, duration: 0.95, stagger: 0.12, clearProps: "transform" },
            0.12,
          )
          .from(
            ".hero__role, .hero__sub, .hero__actions",
            { opacity: 0, y: 16, duration: 0.7, stagger: 0.12, clearProps: "transform,opacity" },
            0.55,
          )
          .from(".hero__readout", { opacity: 0, duration: 0.8, clearProps: "opacity" }, 0.9);
      }
      if (ScrollTrigger) {
        $$("[data-reveal]").forEach((element) => {
          if (revealed.has(element)) return;
          // Do not hide content above a restored scroll position or deep link.
          if (window.scrollY > 50 && element.getBoundingClientRect().top < window.innerHeight) {
            revealed.add(element);
            return;
          }
          const siblings = [...element.parentElement.children].filter((sibling) =>
            sibling.hasAttribute("data-reveal"),
          );
          const isGrid = element.matches(".skill, .experiment");
          const staggerDelay =
            isGrid && window.innerWidth > 800 ? (siblings.indexOf(element) % 4) * 0.065 : 0;
          const tween = gsap.from(element, {
            y: 24,
            opacity: 0,
            duration: 0.75,
            delay: staggerDelay,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
            onComplete: () => {
              revealed.add(element);
              revealTweens.delete(element);
            },
          });
          revealTweens.set(element, tween);
        });
      }
    });
    setupPointerEffects();
    ScrollTrigger?.refresh();
  }

  // All content starts visible in CSS, including without JS or vendor files.
  // Waiting for the locally bundled font avoids measuring the fallback font.
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 500))]).then(setupMotion);
  motionPreference.addEventListener("change", setupMotion);
  finePointer.addEventListener("change", setupPointerEffects);
  window.addEventListener(
    "load",
    () => {
      ScrollTrigger?.refresh();
      updateScrollUI();
    },
    { once: true },
  );
  document.fonts?.ready.then(() => ScrollTrigger?.refresh());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      lenis?.resize();
      ScrollTrigger?.refresh();
      updateScrollUI();
    }
  });

  // Print the complete document even if scroll reveals have not played yet.
  let restartMotionAfterPrint = false;
  window.addEventListener("beforeprint", () => {
    restartMotionAfterPrint = !motionPreference.matches;
    stopSmoothScroll();
    stopPointerEffects();
    motionContext?.revert();
    motionContext = null;
  });
  window.addEventListener("afterprint", () => {
    if (restartMotionAfterPrint) setupMotion();
  });
})();
