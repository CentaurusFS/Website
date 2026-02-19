const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("site-nav");

const setHeaderState = () => {
  if (!header) {
    return;
  }
  header.classList.toggle("is-compact", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuToggle && siteNav) {
  const closeNav = () => {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const nextState = !siteNav.classList.contains("is-open");
    siteNav.classList.toggle("is-open", nextState);
    menuToggle.setAttribute("aria-expanded", String(nextState));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (
      siteNav.classList.contains("is-open") &&
      !siteNav.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeNav();
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");
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
    rootMargin: "0px 0px -60px 0px",
  }
);

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${index * 70}ms`;
  revealObserver.observe(el);
});

const metricValues = document.querySelectorAll(".metric-value[data-target]");
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

      const target = Number(node.dataset.target || "0");
      const suffix = node.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
      observer.unobserve(node);
    });
  },
  {
    threshold: 0.6,
  }
);

metricValues.forEach((node) => metricObserver.observe(node));
