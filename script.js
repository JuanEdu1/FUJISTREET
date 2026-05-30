/* ============================================================
   FUJISTREET — interacciones
   ============================================================ */

// --- Menú móvil ---
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// --- Reveal al hacer scroll ---
const revealEls = document.querySelectorAll("[data-reveal]");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);
revealEls.forEach((el) => io.observe(el));

// Hero visible de inmediato (sin esperar scroll)
window.addEventListener("load", () => {
  document
    .querySelectorAll(".hero [data-reveal]")
    .forEach((el) => el.classList.add("in"));
});

// --- Reels: reproducir/pausar al tocar ---
document.querySelectorAll(".reel").forEach((reel) => {
  const video = reel.querySelector("video");
  const playBtn = reel.querySelector(".reel__play");

  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';

  const toggle = () => {
    if (!video || reel.classList.contains("reel--empty")) return;
    if (video.paused) {
      video.play();
      playBtn.innerHTML = ICON_PAUSE;
    } else {
      video.pause();
      playBtn.innerHTML = ICON_PLAY;
    }
  };

  playBtn?.addEventListener("click", toggle);
  // Auto-play silencioso cuando el reel entra en pantalla
  if (video) {
    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !reel.classList.contains("reel--empty")) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );
    vio.observe(reel);
  }
});

// --- Botón de sonido (video de Esencia) ---
const ICON_MUTED =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 5V4L9 9H5zm11.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" opacity=".35"/><path d="M3 3l18 18-1.4 1.4-4-4V20l-5-5H5V9h1.6L1.6 4.4 3 3z"/></svg>';
const ICON_SOUND =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8s-3-7.8-7-8.8z"/></svg>';

document.querySelectorAll(".vid-sound").forEach((btn) => {
  const video = btn.closest(".esencia__media")?.querySelector("video");
  btn.addEventListener("click", () => {
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.play().catch(() => {});
    btn.innerHTML = video.muted ? ICON_MUTED : ICON_SOUND;
    btn.setAttribute("aria-label", video.muted ? "Activar sonido" : "Silenciar");
  });
});

// --- Lightbox del menú ---
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const cards = Array.from(document.querySelectorAll(".card"));
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = (i + cards.length) % cards.length;
  const img = cards[lbIndex].querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

cards.forEach((card, i) => {
  card.addEventListener("click", () => openLightbox(i));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

lbClose?.addEventListener("click", closeLightbox);
lbPrev?.addEventListener("click", () => openLightbox(lbIndex - 1));
lbNext?.addEventListener("click", () => openLightbox(lbIndex + 1));
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
});

// --- Sombra del nav al hacer scroll ---
const nav = document.querySelector(".nav");
let lastY = 0;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (y > 20) nav.style.boxShadow = "0 8px 24px -16px rgba(0,0,0,0.4)";
    else nav.style.boxShadow = "none";
    lastY = y;
  },
  { passive: true }
);
