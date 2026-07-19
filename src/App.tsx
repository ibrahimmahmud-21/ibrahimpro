import { useEffect, useRef } from "react";
import bodyHtml from "./portfolio-body.html?raw";
import { applyTranslations, detectInitialLang, LANG_KEY, localizeNumber, t, type Lang } from "./i18n";

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

    // Theme toggle
    const themeBtn = document.getElementById("themeToggle");
    const onTheme = () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
    };
    themeBtn?.addEventListener("click", onTheme);

    // Respect system changes only if user hasn't chosen
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_KEY)) return;
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    mq?.addEventListener?.("change", onSystem);

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

    // ---- i18n ----
    let currentLang: Lang = detectInitialLang();
    const rootEl = ref.current;
    const yearEl = document.getElementById("footerYear");
    const footerRightsEl = document.getElementById("footerRights");
    const langToggle = document.getElementById("langToggle");

    const updateFooterYear = () => {
      const year = new Date().getFullYear();
      if (yearEl) yearEl.textContent = localizeNumber(currentLang, year);
      if (footerRightsEl) {
        footerRightsEl.textContent = t(currentLang, "footer.rights", {
          year: localizeNumber(currentLang, year),
        });
      }
    };
    const updateLangToggle = () => {
      langToggle?.querySelectorAll<HTMLElement>(".lang-opt").forEach((el) => {
        el.classList.toggle("active", el.getAttribute("data-lang") === currentLang);
      });
    };
    const applyLang = (lang: Lang, animate = false) => {
      currentLang = lang;
      const run = () => {
        if (rootEl) applyTranslations(rootEl, lang);
        updateFooterYear();
        updateLangToggle();
        // Re-render captcha in current language if visible
        if (captchaField?.classList.contains("visible")) generateCaptcha();
      };
      if (animate && rootEl) {
        rootEl.classList.add("lang-switching");
        window.setTimeout(() => {
          run();
          window.setTimeout(() => rootEl.classList.remove("lang-switching"), 20);
        }, 180);
      } else {
        run();
      }
    };
    const onLangClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(".lang-opt");
      const picked = target?.getAttribute("data-lang") as Lang | null;
      const next: Lang = picked ?? (currentLang === "en" ? "bn" : "en");
      if (next === currentLang) return;
      try { localStorage.setItem(LANG_KEY, next); } catch { /* ignore */ }
      applyLang(next, true);
    };
    langToggle?.addEventListener("click", onLangClick);


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
    const captchaField = document.getElementById("captchaField");
    const captchaQuestionEl = document.getElementById("captchaQuestion");
    const messageEl = form?.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    const captchaInput = form?.querySelector<HTMLInputElement>('input[name="captcha_answer"]');

    let captchaAnswer = 0;
    const generateCaptcha = () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const op = Math.random() < 0.5 ? "+" : "×";
      captchaAnswer = op === "+" ? a + b : a * b;
      if (captchaQuestionEl) {
        captchaQuestionEl.textContent = t(currentLang, "form.captcha_question", {
          a: localizeNumber(currentLang, a),
          b: localizeNumber(currentLang, b),
          op,
        });
      }
      if (captchaInput) captchaInput.value = "";
    };
    const revealCaptcha = () => {
      if (!captchaField || captchaField.classList.contains("visible")) return;
      generateCaptcha();
      captchaField.classList.add("visible");
      captchaField.setAttribute("aria-hidden", "false");
    };
    const onMessageInput = () => {
      if ((messageEl?.value.trim().length ?? 0) >= 10) revealCaptcha();
    };
    messageEl?.addEventListener("input", onMessageInput);
    const onFormFocusIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.getAttribute("name") === "captcha_answer") return;
      // If user tabs toward submit, ensure captcha shown
      if (target?.tagName === "BUTTON") revealCaptcha();
    };
    form?.addEventListener("focusin", onFormFocusIn);

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
      const honeypot = String(data.get("website") || "").trim();
      const captchaVal = String(data.get("captcha_answer") || "").trim();

      // Honeypot — silently drop bot submissions
      if (honeypot) {
        form.reset();
        status.textContent = t(currentLang, "status.success");
        status.classList.add("success");
        return;
      }

      let ok = true;
      if (name.length < 2) { setError("name", t(currentLang, "err.name")); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", t(currentLang, "err.email")); ok = false; }
      if (subject.length < 2) { setError("subject", t(currentLang, "err.subject")); ok = false; }
      if (message.length < 10) { setError("message", t(currentLang, "err.message")); ok = false; }
      if (!ok) return;

      revealCaptcha();
      if (!captchaVal || parseInt(captchaVal, 10) !== captchaAnswer) {
        setError("captcha", t(currentLang, "err.captcha"));
        generateCaptcha();
        return;
      }


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
          status.textContent = t(currentLang, "status.success");
          status.classList.add("success");
        } else {
          const json = await res.json().catch(() => null);
          const msg = json?.errors?.[0]?.message || t(currentLang, "status.fail");
          status.textContent = msg;
          status.classList.add("error");
        }
      } catch {
        status.textContent = t(currentLang, "status.network");
        status.classList.add("error");
      } finally {
        btn?.classList.remove("loading");
        if (btn) btn.disabled = false;
      }
    };
    form?.addEventListener("submit", onSubmit);

    // Initial i18n render
    applyLang(currentLang, false);

    return () => {
      menuBtn?.removeEventListener("click", onMenu);
      links.forEach((a) => a.removeEventListener("click", closeMenu));
      themeBtn?.removeEventListener("click", onTheme);
      mq?.removeEventListener?.("change", onSystem);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      form?.removeEventListener("submit", onSubmit);
      messageEl?.removeEventListener("input", onMessageInput);
      form?.removeEventListener("focusin", onFormFocusIn);
    };
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
