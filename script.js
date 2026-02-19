const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");

const syncHeader = () => {
  if (!header) {
    return;
  }
  header.classList.toggle("is-compact", window.scrollY > 18);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (menuToggle && nav) {
  const closeNav = () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (nav.classList.contains("is-open") && !nav.contains(target) && !menuToggle.contains(target)) {
      closeNav();
    }
  });
}

const revealBlocks = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -45px 0px",
  }
);

revealBlocks.forEach((block, idx) => {
  block.style.transitionDelay = `${idx * 55}ms`;
  revealObserver.observe(block);
});

const metrics = document.querySelectorAll(".metric-value[data-target]");
const metricObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const node = entry.target;
      if (!(node instanceof HTMLElement)) {
        return;
      }

      const targetValue = Number(node.dataset.target || "0");
      const suffix = node.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(targetValue * eased)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      observer.unobserve(node);
    });
  },
  {
    threshold: 0.6,
  }
);

metrics.forEach((metric) => metricObserver.observe(metric));
