import { useEffect } from "react";
import bodyHtml from "./portfolio-body.html?raw";
import { supabase } from "./integrations/supabase/client";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}


export default function App() {
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
      .querySelectorAll(".reveal, .skill-card, .project-card, .learn-card, .build-card, .stat-cell")
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

    // Contact form → Turnstile verification + Formspree (server-side)
    const form = document.getElementById("contactForm") as HTMLFormElement | null;
    const status = document.getElementById("formStatus");
    const captchaField = document.getElementById("captchaField");
    const widgetEl = document.getElementById("turnstileWidget");
    const submitBtn = form?.querySelector<HTMLButtonElement>(".submit-btn");

    let turnstileToken = "";
    let widgetId: string | undefined;
    let cancelled = false;

    const setError = (name: string, msg: string) => {
      const el = form?.querySelector<HTMLElement>(`.field-error[data-for="${name}"]`);
      if (el) el.textContent = msg;
    };
    const clearErrors = () => {
      form?.querySelectorAll<HTMLElement>(".field-error").forEach((el) => (el.textContent = ""));
    };
    const syncSubmit = () => {
      if (submitBtn) submitBtn.disabled = !turnstileToken;
    };
    if (submitBtn) submitBtn.disabled = true;

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.turnstile) return resolve();
        const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject(new Error("load")));
          return;
        }
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.dataset.turnstile = "true";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("load"));
        document.head.appendChild(s);
      });

    const initTurnstile = async () => {
      if (!widgetEl) return;
      try {
        const { data, error } = await supabase.functions.invoke("contact", { method: "GET" });
        const siteKey = (data as { siteKey?: string } | null)?.siteKey;
        if (error || !siteKey) throw new Error("config");
        await loadScript();
        if (cancelled || !window.turnstile) return;
        widgetId = window.turnstile.render(widgetEl, {
          sitekey: siteKey,
          theme: "light",
          callback: (token: string) => {
            turnstileToken = token;
            setError("captcha", "");
            syncSubmit();
          },
          "expired-callback": () => {
            turnstileToken = "";
            syncSubmit();
          },
          "error-callback": () => {
            turnstileToken = "";
            syncSubmit();
            setError("captcha", "Verification could not load. Please retry.");
          },
        });
      } catch {
        if (submitBtn) submitBtn.disabled = false;
        setError("captcha", "Verification could not load. Please refresh and try again.");
      }
    };
    void initTurnstile();

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
      const website = String(data.get("website") || "").trim();

      const successMsg = "Message sent successfully. I’ll get back to you soon.";

      let ok = true;
      if (name.length < 2) { setError("name", "Please enter your name."); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Please enter a valid email address."); ok = false; }
      if (subject.length < 2) { setError("subject", "Please enter a subject."); ok = false; }
      if (message.length < 10) { setError("message", "Please write at least 10 characters."); ok = false; }
      if (!ok) return;

      if (!turnstileToken) {
        setError("captcha", "Please complete the security verification.");
        return;
      }

      submitBtn?.classList.add("loading");
      if (submitBtn) submitBtn.disabled = true;

      try {
        const { data: res, error } = await supabase.functions.invoke("contact", {
          body: { name, email, subject, message, website, turnstileToken },
        });
        const payload = res as { ok?: boolean; error?: string } | null;
        if (!error && payload?.ok) {
          form.reset();
          status.textContent = successMsg;
          status.classList.add("success");
        } else {
          let msg = payload?.error;
          const ctx = (error as { context?: Response } | null)?.context;
          if (!msg && ctx && typeof ctx.json === "function") {
            const body = await ctx.json().catch(() => null);
            msg = body?.error;
          }
          status.textContent = msg || "Something went wrong. Please try again.";
          status.classList.add("error");
        }

      } catch {
        status.textContent = "Network error. Please check your connection and try again.";
        status.classList.add("error");
      } finally {
        submitBtn?.classList.remove("loading");
        turnstileToken = "";
        if (window.turnstile) window.turnstile.reset(widgetId);
        syncSubmit();
      }
    };
    form?.addEventListener("submit", onSubmit);

    return () => {
      cancelled = true;
      menuBtn?.removeEventListener("click", onMenu);
      links.forEach((a) => a.removeEventListener("click", closeMenu));
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      form?.removeEventListener("submit", onSubmit);
    };

  }, []);

  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
