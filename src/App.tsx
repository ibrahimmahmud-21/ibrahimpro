import { useEffect, useRef } from "react";
import bodyHtml from "./portfolio-body.html?raw";

export default function App() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");
    const onMenu = () => navMenu?.classList.toggle("open");
    menuBtn?.addEventListener("click", onMenu);
    const links = navMenu?.querySelectorAll("a") ?? [];
    const closeMenu = () => navMenu?.classList.remove("open");
    links.forEach((a) => a.addEventListener("click", closeMenu));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll(".reveal, .node, .build-panel")
      .forEach((el) => io.observe(el));

    return () => {
      menuBtn?.removeEventListener("click", onMenu);
      links.forEach((a) => a.removeEventListener("click", closeMenu));
      io.disconnect();
    };
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
