/*
 * Constellation Field — Canvas 2D adaptation of the supplied ThreeUI HTML.
 * Source: https://threeui.com/backgrounds/constellation-field/constellation-field
 * The React preset is mapped to this standalone renderer; no React component
 * is mounted. The dark palette comes from the portfolio's CSS variables.
 */
(() => {
  "use strict";

  const canvas = document.getElementById("constellationCanvas");
  const hero = canvas?.closest(".hero");
  if (!canvas || !hero) return;

  let ctx;
  try {
    ctx = canvas.getContext("2d");
  } catch {
    return;
  }
  if (!ctx) return;

  // Animation preset. Hero shading in style.css keeps the copy readable.
  const settings = {
    speed: 1.33,
    size: 0.78,
    strokeWidth: 1.0,
    length: 1.0,
    density: 1.0,
    opacity: 1.0,
    hue: 0,
    saturation: 1.0,
    brightness: 1.45,
  };
  const host = canvas.parentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const color = getComputedStyle(hero).getPropertyValue("--accent").trim() || "#f5a623";
  const linkDistance = 160 * settings.length;
  const frameInterval = 1000 / 30;
  const pointer = { x: 0, y: 0, active: false };
  let width = 0;
  let height = 0;
  let pixelRatio = 0;
  let nodes = [];
  let frameId = 0;
  let previousTime = null;
  let elapsed = 0;
  let printing = false;
  let suspended = false;
  const initialBounds = hero.getBoundingClientRect();
  let inView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;

  canvas.style.filter = `hue-rotate(${settings.hue}deg) saturate(${settings.saturation}) brightness(${settings.brightness})`;

  function clearPointer() {
    pointer.active = false;
  }

  function canAnimate() {
    return (
      width > 0 &&
      height > 0 &&
      inView &&
      !document.hidden &&
      !reducedMotion.matches &&
      !printing &&
      !suspended
    );
  }

  function stop() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = null;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = settings.strokeWidth;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    // Links and dots share the same positions in each frame.
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const squaredDistance = dx * dx + dy * dy;
        if (squaredDistance >= linkDistance * linkDistance) continue;
        const distance = Math.sqrt(squaredDistance);
        ctx.globalAlpha = (1 - distance / linkDistance) * 0.6 * settings.opacity;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    nodes.forEach((node) => {
      const pulse = 0.78 + Math.sin(elapsed + node.phase) * 0.22;
      ctx.globalAlpha = pulse * 0.28 * settings.opacity;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = pulse * settings.opacity;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function advance(seconds) {
    elapsed += seconds * settings.speed;
    const attraction = 1 - Math.pow(0.995, seconds * 60);
    nodes.forEach((node) => {
      node.x += node.vx * seconds;
      node.y += node.vy * seconds;
      if (pointer.active) {
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        if (dx * dx + dy * dy < 220 * 220) {
          node.x += dx * attraction;
          node.y += dy * attraction;
        }
      }
      if (node.x < 0 || node.x > width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(height, node.y));
      }
    });
  }

  function tick(time) {
    frameId = 0;
    if (!canAnimate()) {
      previousTime = null;
      return;
    }
    frameId = requestAnimationFrame(tick);
    if (previousTime === null) {
      previousTime = time;
      return;
    }
    const delta = time - previousTime;
    if (delta < frameInterval) return;
    previousTime = time;
    advance(Math.min(delta, 50) / 1000);
    draw();
  }

  function syncAnimation() {
    stop();
    clearPointer();
    if (width <= 0 || height <= 0 || !inView || document.hidden || printing || suspended) return;
    // A single still frame remains when the user asks for reduced motion.
    draw();
    if (canAnimate()) frameId = requestAnimationFrame(tick);
  }

  function resize() {
    const bounds = host.getBoundingClientRect();
    const nextWidth = Math.max(0, Math.round(bounds.width));
    const nextHeight = Math.max(0, Math.round(bounds.height));
    const nextRatio = Math.min(window.devicePixelRatio || 1, 2);
    if (nextWidth === width && nextHeight === height && nextRatio === pixelRatio) return;
    const oldWidth = width || nextWidth || 1;
    const oldHeight = height || nextHeight || 1;
    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextRatio;
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (!width || !height) {
      nodes = [];
      stop();
      return;
    }

    // Adapt to the hero's area, with a lower cap on small screens.
    const limit = width < 600 ? 40 : 85;
    const count = Math.min(
      limit,
      Math.round(Math.max(18, (width * height) / 10000) * settings.density),
    );
    nodes = nodes.slice(0, count);
    nodes.forEach((node) => {
      node.x *= width / oldWidth;
      node.y *= height / oldHeight;
    });
    while (nodes.length < count) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 18 * settings.speed,
        vy: (Math.random() - 0.5) * 18 * settings.speed,
        radius: (Math.random() * 2.4 + 1.8) * settings.size,
        phase: Math.random() * Math.PI * 2,
      });
    }
    syncAnimation();
  }

  hero.addEventListener(
    "pointermove",
    (event) => {
      if (!canAnimate() || !finePointer.matches || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active =
        pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", clearPointer);
  hero.addEventListener("pointercancel", clearPointer);
  window.addEventListener("scroll", clearPointer, { passive: true });
  window.addEventListener("blur", clearPointer);
  finePointer.addEventListener("change", clearPointer);
  reducedMotion.addEventListener("change", syncAnimation);
  document.addEventListener("visibilitychange", syncAnimation);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("beforeprint", () => {
    printing = true;
    syncAnimation();
  });
  window.addEventListener("afterprint", () => {
    printing = false;
    syncAnimation();
  });
  window.addEventListener("pagehide", () => {
    suspended = true;
    syncAnimation();
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    const bounds = hero.getBoundingClientRect();
    inView = bounds.bottom > 0 && bounds.top < window.innerHeight;
    resize();
    syncAnimation();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncAnimation();
    });
    observer.observe(hero);
  } else {
    window.addEventListener(
      "scroll",
      () => {
        const bounds = hero.getBoundingClientRect();
        const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        if (visible !== inView) {
          inView = visible;
          syncAnimation();
        }
      },
      { passive: true },
    );
  }
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(host);
  }
  resize();
})();
