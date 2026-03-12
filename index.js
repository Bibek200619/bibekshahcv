document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

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
    });
  });

  const flipCards = document.querySelectorAll(".flip-card");

  const setFlippedState = (card, shouldFlip) => {
    card.classList.toggle("is-flipped", shouldFlip);
    card.setAttribute("aria-expanded", shouldFlip ? "true" : "false");
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
