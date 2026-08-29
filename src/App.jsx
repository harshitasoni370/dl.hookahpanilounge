import { useEffect, useRef } from "react";
import { pages } from "./pages";
import { useLocation, useNavigate } from "react-router-dom";

function normalizePath(path) {
  if (!path || path === "/index.html" || path === "/index") return "/";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const path = normalizePath(location.pathname);
  const html = pages[path] ?? pages["/"];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll('.hero-anim').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    const toggle = root.querySelector("#nav-toggle");
    const drawer = root.querySelector("#lounge-drawer");
    const backdrop = root.querySelector("#drawer-backdrop");

    const setOpen = (open) => {
      if (!toggle || !drawer) return;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawer.hidden = !open;
      if (backdrop) backdrop.hidden = !open;
      document.body.classList.toggle("lounge-drawer-open", open);
    };

    const onToggle = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
    const onBackdrop = () => setOpen(false);
    toggle?.addEventListener("click", onToggle);
    backdrop?.addEventListener("click", onBackdrop);

    const links = [...root.querySelectorAll("a")];
    const onLink = (e) => {
      const href = e.currentTarget.getAttribute("href");
      const isInternalPath = typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

      if (isInternalPath) {
        e.preventDefault();
        navigate(href);
        setOpen(false);
      }
    };
    links.forEach(a => a.addEventListener("click", onLink));

    // Lightweight reservation feedback for the original static form.
    const forms = [...root.querySelectorAll("form")];
    const onSubmit = (e) => {
      const form = e.currentTarget;
      if (!form.checkValidity()) return;
      if (form.id === "reserve-form") {
        e.preventDefault();
        const note = form.querySelector("#reserve-note");
        if (note) note.textContent = "Reservation request received. We’ll confirm shortly.";
        form.reset();
      }
    };
    forms.forEach(f => f.addEventListener("submit", onSubmit));

    // Keep hash navigation working after React route changes.
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        setTimeout(() => root.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({behavior:"smooth", block:"start"}), 50);
      });
    } else {
      window.scrollTo({top:0, behavior:"instant"});
    }

    return () => {
      toggle?.removeEventListener("click", onToggle);
      backdrop?.removeEventListener("click", onBackdrop);
      links.forEach(a => a.removeEventListener("click", onLink));
      forms.forEach(f => f.removeEventListener("submit", onSubmit));
      document.body.classList.remove("lounge-drawer-open");
    };
  }, [path, location.hash]);

  return <div ref={rootRef} className="lounge-page" dangerouslySetInnerHTML={{ __html: html }} />;
}
