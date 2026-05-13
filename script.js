const hamburger = document.getElementById("hamburgerBtn");
const nav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Mobile menu */
if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("show");
    document.body.classList.toggle("menu-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
      document.body.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* Scroll reveal */
const revealTargets = document.querySelectorAll(
  ".fade-in, .section-kicker, .section-title, .section-sub, .service-card, .project-card, .process-step, .resume-card"
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal-on-scroll");
  element.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealTargets.forEach((element) => revealObserver.observe(element));

/* Counter animation */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const stat = entry.target;
    const target = Number(stat.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(stat);
  });
}, { threshold: 0.45 });

document.querySelectorAll("[data-count]").forEach((stat) => countObserver.observe(stat));

/* Project filter - grid only, no slider code */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  });
});

/* Active nav link */
const sections = document.querySelectorAll("main section[id]");
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-42% 0px -50% 0px" });

sections.forEach((section) => activeObserver.observe(section));

/* Tilt effect */
if (!prefersReducedMotion && hasFinePointer) {
  const tiltCards = document.querySelectorAll("[data-tilt]");

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 14;
      const rotateX = ((0.5 - y / rect.height)) * 14;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const heroStage = document.querySelector(".hero-stage");
  const floaters = document.querySelectorAll(".floating-card");

  window.addEventListener("mousemove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    if (heroStage) {
      heroStage.style.transform = `translate3d(${x * 18}px, ${y * 18}px, 0)`;
    }

    floaters.forEach((card) => {
      const depth = Number(card.dataset.depth || 0.5);
      card.style.marginLeft = `${x * 18 * depth}px`;
      card.style.marginTop = `${y * 18 * depth}px`;
    });
  });
}

/* Footer year */
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

/* Project video/image modal */
const projectModal = document.getElementById("projectModal");
const projectVideo = document.getElementById("projectVideo");
const projectImage = document.getElementById("projectImage");
const modalTitle = document.getElementById("modalTitle");

function openProjectVideo(videoSrc, title) {
  if (!projectModal || !projectVideo || !modalTitle) return;

  projectModal.classList.add("active", "show-video");
  projectModal.classList.remove("show-image");
  document.body.classList.add("modal-open");

  modalTitle.textContent = title || "Project Demo";

  if (projectImage) {
    projectImage.removeAttribute("src");
  }

  projectVideo.pause();
  projectVideo.removeAttribute("src");
  projectVideo.load();

  const source = document.createElement("source");
  source.src = videoSrc;
  source.type = "video/mp4";

  projectVideo.innerHTML = "";
  projectVideo.appendChild(source);
  projectVideo.load();

  projectVideo.addEventListener("loadeddata", () => {
    projectVideo.play().catch(() => {
      console.log("Autoplay blocked. User can press play.");
    });
  }, { once: true });

  projectModal.setAttribute("aria-hidden", "false");
}

function openProjectImage(imageSrc, title) {
  if (!projectModal || !projectImage || !modalTitle) return;

  projectModal.classList.add("active", "show-image");
  projectModal.classList.remove("show-video");
  document.body.classList.add("modal-open");

  modalTitle.textContent = title || "Project Preview";

  if (projectVideo) {
    projectVideo.pause();
    projectVideo.removeAttribute("src");
    projectVideo.innerHTML = "";
    projectVideo.load();
  }

  projectImage.src = imageSrc;
  projectModal.setAttribute("aria-hidden", "false");
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove("active", "show-video", "show-image");
  document.body.classList.remove("modal-open");

  if (projectVideo) {
    projectVideo.pause();
    projectVideo.removeAttribute("src");
    projectVideo.innerHTML = "";
    projectVideo.load();
  }

  if (projectImage) {
    projectImage.removeAttribute("src");
  }

  projectModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".project-video .open-video").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".project-video");
    if (!card) return;

    const videoSrc = card.dataset.video;
    const title = card.dataset.title;

    if (videoSrc) {
      openProjectVideo(videoSrc, title);
    } else {
      console.log("Video path missing on project card.");
    }
  });
});

document.querySelectorAll(".open-image").forEach((button) => {
  button.addEventListener("click", () => {
    const imageSrc = button.dataset.image;
    const title = button.dataset.title;

    if (imageSrc) {
      openProjectImage(imageSrc, title);
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach((closeBtn) => {
  closeBtn.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalText = submitButton.innerHTML;

    formMessage.textContent = "";
    formMessage.className = "form-message";

    submitButton.disabled = true;
    submitButton.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        formMessage.textContent = "Message sent successfully!";
        formMessage.classList.add("success");
        contactForm.reset();
      } else {
        formMessage.textContent = "Message send nahi hua. Access key check karo.";
        formMessage.classList.add("error");
      }
    } catch (error) {
      formMessage.textContent = "Network error. Please try again.";
      formMessage.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });
}