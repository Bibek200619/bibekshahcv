document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  scrollProgress.setAttribute("aria-hidden", "true");
  document.body.appendChild(scrollProgress);

  const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    document.documentElement.style.setProperty("--scroll-progress", progress.toString());
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);

  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 80, 420)}ms`;
      observer.observe(element);
    });
  }

  const interactiveCards = document.querySelectorAll(".interactive-card");
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--glow-x", `${x}%`);
      card.style.setProperty("--glow-y", `${y}%`);

      if (!prefersReducedMotion && !card.classList.contains("is-flipped")) {
        const tiltX = ((50 - y) / 50) * 3.5;
        const tiltY = ((x - 50) / 50) * 4.5;
        card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "50%");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  const heroCard = document.querySelector(".hero-card");
  const blobs = document.querySelectorAll(".blob");
  if (!prefersReducedMotion && heroCard) {
    let pointerFrame = 0;

    window.addEventListener(
      "pointermove",
      (event) => {
        if (pointerFrame) {
          return;
        }

        pointerFrame = window.requestAnimationFrame(() => {
          const viewportX = event.clientX / window.innerWidth - 0.5;
          const viewportY = event.clientY / window.innerHeight - 0.5;
          const heroRect = heroCard.getBoundingClientRect();
          const heroX = ((event.clientX - heroRect.left) / heroRect.width) * 100;
          const heroY = ((event.clientY - heroRect.top) / heroRect.height) * 100;

          heroCard.style.setProperty("--hero-glow-x", `${Math.max(0, Math.min(100, heroX))}%`);
          heroCard.style.setProperty("--hero-glow-y", `${Math.max(0, Math.min(100, heroY))}%`);

          blobs.forEach((blob, index) => {
            const strength = (index + 1) * 10;
            blob.style.setProperty("--parallax-x", `${(viewportX * strength).toFixed(2)}`);
            blob.style.setProperty("--parallax-y", `${(viewportY * strength).toFixed(2)}`);
          });

          pointerFrame = 0;
        });
      },
      { passive: true }
    );
  }

  const flipCards = document.querySelectorAll(".flip-card");

  const setFlippedState = (card, shouldFlip) => {
    card.classList.toggle("is-flipped", shouldFlip);
    card.setAttribute("aria-expanded", shouldFlip ? "true" : "false");
    if (shouldFlip) {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    }
  };

  flipCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".repo-link")) {
        return;
      }

      const isFlipped = card.classList.contains("is-flipped");
      flipCards.forEach((otherCard) => {
        if (otherCard !== card) {
          setFlippedState(otherCard, false);
        }
      });
      setFlippedState(card, !isFlipped);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const isFlipped = card.classList.contains("is-flipped");
        flipCards.forEach((otherCard) => {
          if (otherCard !== card) {
            setFlippedState(otherCard, false);
          }
        });
        setFlippedState(card, !isFlipped);
      }

      if (event.key === "Escape") {
        setFlippedState(card, false);
      }
    });
  });
});
