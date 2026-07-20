export type Lang = "en" | "bn";

export const LANG_KEY = "lang-preference";

export const SUPPORTED_LANGS: Lang[] = ["en", "bn"];

type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  en: {
    // Nav
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.learning": "Learning",
    "nav.contact": "Contact",
    "nav.toggleTheme": "Toggle theme",
    "nav.toggleThemeTitle": "Toggle light/dark theme",
    "nav.toggleMenu": "Toggle menu",
    "nav.toggleLang": "Switch language",
    // Hero
    "hero.kicker": "Currently learning",
    "hero.title": "Building toward cyber security.",
    "hero.lead":
      "I'm Ibrahim — a Class 10 student learning how systems are built, secured, and broken, one deliberate step at a time.",
    "hero.cta": "Get in touch →",
    // About
    "about.marker": "01 — About",
    "about.title": "Still early, still honest.",
    "about.p1":
      "I'm a Class 10 student who spends free time figuring out how things actually work — web pages, networks, and the fundamentals of keeping systems secure.",
    "about.p2":
      "I'm not chasing a polished résumé. The interest is genuine: understanding how a network holds together, how it can be attacked, and how a defender closes the gap.",
    "about.p3":
      "What's shown here is exactly where I stand — some skills basic, some further along.",
    "about.fact1.k": "Stage",
    "about.fact1.v": "Class 10 Student · SSC 2027 Candidate",
    "about.fact2.k": "Focus",
    "about.fact2.v": "Cybersecurity Enthusiast",
    "about.fact3.k": "Method",
    "about.fact3.v": "Learn by taking things apart, then rebuild them correctly",
    // Skills
    "skills.marker": "02 — Skills",
    "skills.title": "What I've got so far",
    "skills.coding": "Coding",
    "skills.coding.level": "Intermediate",
    "skills.coding.desc": "HTML, CSS, JavaScript. Small tools, clean structure, real projects.",
    "skills.ai": "AI Productivity",
    "skills.ai.level": "Advanced",
    "skills.ai.desc": "Prompting, agents, and using models as leverage for real work.",
    "skills.sec": "Cyber Security",
    "skills.sec.level": "Learning",
    "skills.sec.desc": "Networks, defenses, offensive fundamentals — one lab at a time.",
    // Learning
    "learn.marker": "03 — Currently Learning",
    "learn.title": "Modules in progress",
    "learn.mod1.tag": "Module 01",
    "learn.mod1.title": "Cyber Security",
    "learn.mod1.desc": "Networks, defenses, offensive fundamentals — one lab at a time.",
    "learn.mod2.tag": "Module 02",
    "learn.mod2.title": "AI",
    "learn.mod2.desc": "Prompting, agents, and using models as leverage for real work.",
    "learn.mod3.tag": "Module 03",
    "learn.mod3.title": "Programming",
    "learn.mod3.desc": "Web fundamentals, scripting, and shipping small tools that solve problems.",
    // Project
    "project.marker": "04 — Project",
    "project.title": "Live work",
    "project.tag.type": "Web App",
    "project.tag.category": "Cyber Security",
    "project.status": "Live",
    "project.apkguard.visit_aria": "Visit APKGuard website",
    "project.apkguard.img_alt": "APKGuard — Android APK security scanner preview",
    "project.apkguard.desc":
      "A web-based Android APK security scanner that analyzes uploaded APK files to identify malware indicators, suspicious permissions, and potential security risks — helping users make safer installation decisions before touching their device.",
    "project.visit": "Visit Website →",
    // Contact
    "contact.marker": "05 — Contact",
    "contact.title": "Let's talk",
    "contact.left.title": "Reach out",
    "contact.left.desc": "Questions, ideas, or want to talk cyber security? I read everything.",
    "contact.linkedin_aria": "Visit LinkedIn profile (opens in new tab)",
    "form.name": "Name",
    "form.email": "Email",
    "form.subject": "Subject",
    "form.message": "Message",
    "form.captcha_label": "Quick check:",
    "form.captcha_title": "Security Check",
    "form.captcha_subtitle": "Please solve this simple question before sending your message.",
    "form.captcha_answer_label": "Your answer",
    "form.captcha_question": "{a} {op} {b} = ?",
    "form.submit": "Send Message",
    // Validation & status
    "err.name": "Please enter your name.",
    "err.email": "Enter a valid email address.",
    "err.subject": "Add a short subject.",
    "err.message": "Message should be at least 10 characters.",
    "err.captcha": "Please solve the quick check to continue.",
    "status.success": "Message sent successfully. Thank you for reaching out! I'll get back to you soon.",
    "status.fail": "Submission failed. Please try again.",
    "status.network": "Network error. Please check your connection and try again.",
    // Footer
    "footer.rights": "© {year} Ibrahim Mahmud — All Rights Reserved",
    "footer.tagline": "Student · Builder · Cyber Security in Draft",
  },
  bn: {
    "nav.about": "পরিচিতি",
    "nav.skills": "দক্ষতা",
    "nav.learning": "শিখছি",
    "nav.contact": "যোগাযোগ",
    "nav.toggleTheme": "থিম পরিবর্তন",
    "nav.toggleThemeTitle": "লাইট/ডার্ক থিম পরিবর্তন",
    "nav.toggleMenu": "মেনু",
    "nav.toggleLang": "ভাষা পরিবর্তন",
    "hero.kicker": "এখন শিখছি",
    "hero.title": "সাইবার সিকিউরিটির পথে।",
    "hero.lead":
      "আমি ইব্রাহিম — দশম শ্রেণির একজন শিক্ষার্থী, ধাপে ধাপে শিখছি কীভাবে সিস্টেম তৈরি হয়, সুরক্ষিত হয় এবং ভাঙা যায়।",
    "hero.cta": "যোগাযোগ করুন →",
    "about.marker": "০১ — পরিচিতি",
    "about.title": "শুরুতেই আছি, তবে সৎভাবে।",
    "about.p1":
      "আমি দশম শ্রেণির একজন ছাত্র, অবসর সময়ে বোঝার চেষ্টা করি জিনিসগুলো আসলে কীভাবে কাজ করে — ওয়েব পেজ, নেটওয়ার্ক এবং সিস্টেম সুরক্ষার মূল ভিত্তি।",
    "about.p2":
      "চাকচিক্যপূর্ণ রেজিউমের পেছনে ছুটছি না। আগ্রহটা সত্যিকারের — বুঝতে চাই একটা নেটওয়ার্ক কীভাবে দাঁড়িয়ে থাকে, কীভাবে আক্রান্ত হয়, আর কীভাবে একজন ডিফেন্ডার সেই ফাঁক বন্ধ করে।",
    "about.p3":
      "এখানে যা দেখানো হয়েছে তা ঠিক আমার বর্তমান অবস্থান — কিছু দক্ষতা প্রাথমিক, কিছু কিছুটা এগিয়ে।",
    "about.fact1.k": "পর্যায়",
    "about.fact1.v": "দশম শ্রেণির শিক্ষার্থী · এসএসসি ২০২৭ পরীক্ষার্থী",
    "about.fact2.k": "মনোযোগ",
    "about.fact2.v": "সাইবার সিকিউরিটি উৎসাহী",
    "about.fact3.k": "পদ্ধতি",
    "about.fact3.v": "জিনিস খুলে বোঝা, তারপর সঠিকভাবে গড়ে তোলা",
    "skills.marker": "০২ — দক্ষতা",
    "skills.title": "এখন পর্যন্ত যা শিখেছি",
    "skills.coding": "কোডিং",
    "skills.coding.level": "মাঝারি",
    "skills.coding.desc": "HTML, CSS, JavaScript। ছোট টুল, পরিষ্কার গঠন, সত্যিকারের প্রজেক্ট।",
    "skills.ai": "এআই প্রোডাক্টিভিটি",
    "skills.ai.level": "উন্নত",
    "skills.ai.desc": "প্রম্পটিং, এজেন্ট এবং কাজে গতি আনতে এআই মডেলের ব্যবহার।",
    "skills.sec": "সাইবার সিকিউরিটি",
    "skills.sec.level": "শিখছি",
    "skills.sec.desc": "নেটওয়ার্ক, প্রতিরক্ষা এবং অফেন্সিভ ফান্ডামেন্টাল — একটি করে ল্যাব ধরে।",
    "learn.marker": "০৩ — এখন শিখছি",
    "learn.title": "চলমান মডিউল",
    "learn.mod1.tag": "মডিউল ০১",
    "learn.mod1.title": "সাইবার সিকিউরিটি",
    "learn.mod1.desc": "নেটওয়ার্ক, প্রতিরক্ষা এবং অফেন্সিভ ফান্ডামেন্টাল — একটি করে ল্যাব ধরে।",
    "learn.mod2.tag": "মডিউল ০২",
    "learn.mod2.title": "এআই",
    "learn.mod2.desc": "প্রম্পটিং, এজেন্ট এবং কাজে গতি আনতে এআই মডেলের ব্যবহার।",
    "learn.mod3.tag": "মডিউল ০৩",
    "learn.mod3.title": "প্রোগ্রামিং",
    "learn.mod3.desc": "ওয়েবের মূল বিষয়, স্ক্রিপ্টিং এবং সমস্যা সমাধানকারী ছোট টুল তৈরি।",
    "project.marker": "০৪ — প্রজেক্ট",
    "project.title": "সরাসরি কাজ",
    "project.tag.type": "ওয়েব অ্যাপ",
    "project.tag.category": "সাইবার সিকিউরিটি",
    "project.status": "লাইভ",
    "project.apkguard.visit_aria": "APKGuard ওয়েবসাইট দেখুন",
    "project.apkguard.img_alt": "APKGuard — অ্যান্ড্রয়েড APK সিকিউরিটি স্ক্যানারের প্রিভিউ",
    "project.apkguard.desc":
      "একটি ওয়েব-ভিত্তিক অ্যান্ড্রয়েড APK সিকিউরিটি স্ক্যানার, যা আপলোড করা APK ফাইল বিশ্লেষণ করে ম্যালওয়্যার সংকেত, সন্দেহজনক অনুমতি ও সম্ভাব্য ঝুঁকি চিহ্নিত করে — ফলে ডিভাইসে ইনস্টল করার আগেই নিরাপদ সিদ্ধান্ত নেওয়া যায়।",
    "project.visit": "ওয়েবসাইটে যান →",
    "contact.marker": "০৫ — যোগাযোগ",
    "contact.title": "চলুন কথা বলি",
    "contact.left.title": "যোগাযোগ করুন",
    "contact.left.desc": "প্রশ্ন, আইডিয়া বা সাইবার সিকিউরিটি নিয়ে কথা বলতে চান? সব বার্তা পড়ি।",
    "contact.linkedin_aria": "লিংকডইন প্রোফাইল দেখুন (নতুন ট্যাবে খুলবে)",
    "form.name": "নাম",
    "form.email": "ইমেইল",
    "form.subject": "বিষয়",
    "form.message": "বার্তা",
    "form.captcha_label": "দ্রুত যাচাই:",
    "form.captcha_title": "সিকিউরিটি চেক",
    "form.captcha_subtitle": "বার্তা পাঠানোর আগে অনুগ্রহ করে এই সহজ প্রশ্নটির উত্তর দিন।",
    "form.captcha_answer_label": "আপনার উত্তর",
    "form.captcha_question": "{a} {op} {b} = ?",
    "form.submit": "বার্তা পাঠান",
    "err.name": "অনুগ্রহ করে আপনার নাম লিখুন।",
    "err.email": "একটি বৈধ ইমেইল ঠিকানা লিখুন।",
    "err.subject": "একটি সংক্ষিপ্ত বিষয় লিখুন।",
    "err.message": "বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে।",
    "err.captcha": "এগোতে দ্রুত যাচাইটি সম্পন্ন করুন।",
    "status.success": "বার্তা সফলভাবে পাঠানো হয়েছে। যোগাযোগের জন্য ধন্যবাদ! আমি শীঘ্রই উত্তর দেব।",
    "status.fail": "বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।",
    "status.network": "নেটওয়ার্ক সমস্যা। আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
    "footer.rights": "© {year} ইব্রাহিম মাহমুদ — সর্বস্বত্ব সংরক্ষিত",
    "footer.tagline": "শিক্ষার্থী · নির্মাতা · সাইবার সিকিউরিটি চর্চায়",
  },
};

export function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY) as Lang | null;
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  } catch { /* ignore */ }
  const nav = typeof navigator !== "undefined" ? navigator.language || "" : "";
  if (nav.toLowerCase().startsWith("bn")) return "bn";
  return "en";
}

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const dict = translations[lang] ?? translations.en;
  let str = dict[key] ?? translations.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

/** Convert Latin digits to Bengali numerals when lang === "bn". */
export function localizeNumber(lang: Lang, n: number | string): string {
  const s = String(n);
  if (lang !== "bn") return s;
  const map: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return s.replace(/[0-9]/g, (d) => map[d] ?? d);
}

/** Apply translations to all elements with data-i18n / data-i18n-attr. */
export function applyTranslations(root: ParentNode, lang: Lang): void {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(lang, key);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
    const spec = el.getAttribute("data-i18n-attr") || "";
    // Format: "attr:key,attr:key"
    spec.split(",").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(lang, key));
    });
  });
  document.documentElement.setAttribute("lang", lang);
}
