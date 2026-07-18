import { useEffect, useRef } from "react";
import bodyHtml from "./portfolio-body.html?raw";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzezggv";
const THEME_KEY = "theme-preference";

// Apply theme early to avoid flash
(() => {
  if (typeof document === "undefined") return;
  try {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const theme = stored ?? (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

export default function App() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile nav toggle
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");
    const onMenu = () => navMenu?.classList.toggle("open");
    menuBtn?.addEventListener("click", onMenu);
    const links = navMenu?.querySelectorAll("a") ?? [];
    const closeMenu = () => navMenu?.classList.remove("open");
    links.forEach((a) => a.addEventListener("click", closeMenu));

    // Reveal on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll(".reveal, .skill-card, .project-card, .learn-card, .stat-cell")
      .forEach((el) => io.observe(el));

    // Footer year
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Scroll progress + back to top
    const backBtn = document.getElementById("backToTop");
    const progressBar = document.querySelector<HTMLElement>("#scrollProgress i");
    const onScroll = () => {
      if (window.scrollY > 400) backBtn?.classList.add("visible");
      else backBtn?.classList.remove("visible");
      if (progressBar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        progressBar.style.width = pct + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Contact form → Formspree
    const form = document.getElementById("contactForm") as HTMLFormElement | null;
    const status = document.getElementById("formStatus");
    const clearErrors = () => {
      form?.querySelectorAll<HTMLElement>(".field-error").forEach((el) => (el.textContent = ""));
    };
    const setError = (name: string, msg: string) => {
      const el = form?.querySelector<HTMLElement>(`.field-error[data-for="${name}"]`);
      if (el) el.textContent = msg;
    };

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      if (!form || !status) return;
      clearErrors();
      status.textContent = "";
      status.className = "form-status";

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const subject = String(data.get("subject") || "").trim();
      const message = String(data.get("message") || "").trim();

      let ok = true;
      if (name.length < 2) { setError("name", "Please enter your name."); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Enter a valid email address."); ok = false; }
      if (subject.length < 2) { setError("subject", "Add a short subject."); ok = false; }
      if (message.length < 10) { setError("message", "Message should be at least 10 characters."); ok = false; }
      if (!ok) return;

      const btn = form.querySelector<HTMLButtonElement>(".submit-btn");
      btn?.classList.add("loading");
      if (btn) btn.disabled = true;

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          form.reset();
          status.textContent = "Message sent successfully. Thank you for reaching out! I'll get back to you soon.";
          status.classList.add("success");
        } else {
          const json = await res.json().catch(() => null);
          const msg = json?.errors?.[0]?.message || "Submission failed. Please try again.";
          status.textContent = msg;
          status.classList.add("error");
        }
      } catch {
        status.textContent = "Network error. Please check your connection and try again.";
        status.classList.add("error");
      } finally {
        btn?.classList.remove("loading");
        if (btn) btn.disabled = false;
      }
    };
    form?.addEventListener("submit", onSubmit);

    return () => {
      menuBtn?.removeEventListener("click", onMenu);
      links.forEach((a) => a.removeEventListener("click", closeMenu));
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      form?.removeEventListener("submit", onSubmit);
    };
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
