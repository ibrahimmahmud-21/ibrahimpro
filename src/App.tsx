import { useEffect } from "react";
import bodyHtml from "./portfolio-body.html?raw";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzezggv";

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
    const captchaField = document.getElementById("captchaField");
    const captchaQuestionEl = document.getElementById("captchaQuestion");
    const messageEl = form?.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    const captchaInput = form?.querySelector<HTMLInputElement>('input[name="captcha_answer"]');
    const submitBtn = form?.querySelector<HTMLButtonElement>(".submit-btn");

    let captchaAnswer = 0;
    const isVerified = () =>
      !!captchaInput && parseInt(captchaInput.value.trim(), 10) === captchaAnswer;
    const syncVerified = () => {
      const ok = isVerified();
      captchaField?.classList.toggle("verified", ok);
      captchaField?.querySelector<HTMLElement>(".sc-verified")?.setAttribute("aria-hidden", ok ? "false" : "true");
      if (submitBtn && captchaField?.classList.contains("visible")) submitBtn.disabled = !ok;
      if (ok) {
        const err = form?.querySelector<HTMLElement>('.field-error[data-for="captcha"]');
        if (err) err.textContent = "";
      }
    };
    const generateCaptcha = () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const op = Math.random() < 0.5 ? "+" : "×";
      captchaAnswer = op === "+" ? a + b : a * b;
      if (captchaQuestionEl) captchaQuestionEl.textContent = `${a} ${op} ${b} =`;
      if (captchaInput) captchaInput.value = "";
      syncVerified();
    };
    const revealCaptcha = () => {
      if (!captchaField || captchaField.classList.contains("visible")) return;
      generateCaptcha();
      captchaField.classList.add("visible");
      captchaField.setAttribute("aria-hidden", "false");
      syncVerified();
    };
    const onMessageInput = () => {
      if ((messageEl?.value.trim().length ?? 0) >= 10) revealCaptcha();
    };
    messageEl?.addEventListener("input", onMessageInput);
    const onCaptchaInput = () => syncVerified();
    captchaInput?.addEventListener("input", onCaptchaInput);
    const onFormFocusIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.getAttribute("name") === "captcha_answer") return;
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

      const successMsg = "Message sent successfully. Thank you for reaching out! I'll get back to you soon.";

      // Honeypot — silently drop bot submissions
      if (honeypot) {
        form.reset();
        status.textContent = successMsg;
        status.classList.add("success");
        return;
      }

      let ok = true;
      if (name.length < 2) { setError("name", "Please enter your name."); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Please enter a valid email address."); ok = false; }
      if (subject.length < 2) { setError("subject", "Please enter a subject."); ok = false; }
      if (message.length < 10) { setError("message", "Please write at least 10 characters."); ok = false; }
      if (!ok) return;

      revealCaptcha();
      if (!captchaVal || parseInt(captchaVal, 10) !== captchaAnswer) {
        setError("captcha", "Incorrect answer. Please try again.");
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
          captchaField?.classList.remove("visible", "verified");
          captchaField?.setAttribute("aria-hidden", "true");
          status.textContent = successMsg;
          status.classList.add("success");
        } else {
          const json = await res.json().catch(() => null);
          const msg = json?.errors?.[0]?.message || "Something went wrong. Please try again.";
          status.textContent = msg;
          status.classList.add("error");
        }
      } catch {
        status.textContent = "Network error. Please check your connection and try again.";
        status.classList.add("error");
      } finally {
        btn?.classList.remove("loading");
        if (btn) btn.disabled = false;
        syncVerified();
      }
    };
    form?.addEventListener("submit", onSubmit);

    return () => {
      menuBtn?.removeEventListener("click", onMenu);
      links.forEach((a) => a.removeEventListener("click", closeMenu));
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      form?.removeEventListener("submit", onSubmit);
      messageEl?.removeEventListener("input", onMessageInput);
      captchaInput?.removeEventListener("input", onCaptchaInput);
      form?.removeEventListener("focusin", onFormFocusIn);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
