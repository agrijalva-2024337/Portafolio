const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav__links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const onScroll = () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 24);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const sections = document.querySelectorAll("main > section, main > footer");
const navAnchors = document.querySelectorAll(".nav__links a[data-link]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navAnchors.forEach((a) => {
        a.classList.toggle("active", a.dataset.link === id);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const skillBarGroups = document.querySelectorAll(".skill-bars");

if (skillBarGroups.length) {
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-animated");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );
  skillBarGroups.forEach((group) => skillObserver.observe(group));
}

// Slider de vistas
const slider = document.getElementById("vistasSlider");
if (slider) {
  const track = slider.querySelector(".slider__track");
  const slides = [...slider.querySelectorAll(".slider__slide")];
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  const dotsWrap = document.getElementById("sliderDots");
  const currentEl = document.getElementById("sliderCurrent");
  const totalEl = document.getElementById("sliderTotal");
  let index = 0;

  totalEl.textContent = String(slides.length);

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider__dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `Ir a vista ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll(".slider__dot")];

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
    dots.forEach((d, n) => d.classList.toggle("is-active", n === index));
    currentEl.textContent = String(index + 1);
  };

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  // swipe en móvil
  let startX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  track.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      goTo(dx < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );

  // teclado cuando el slider está enfocado
  slider.tabIndex = 0;
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });
}
