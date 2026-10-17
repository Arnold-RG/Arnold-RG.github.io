(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeStatus = document.getElementById("theme-status");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const getTheme = () => (root.getAttribute("data-theme") === "light" ? "light" : "dark");

  const applyTheme = (theme, persist) => {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (_) {
        /* private mode */
      }
    }
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f7f5f0" : "#12161c");
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  };

  applyTheme(getTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      applyTheme(next, true);
      if (themeStatus) themeStatus.textContent = next === "dark" ? "Dark theme" : "Light theme";
    });
  }

  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.getElementById("nav-drawer");

  if (toggle && drawer) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawer.hidden = !open;
      document.body.classList.toggle("nav-open", open);
      if (open) {
        const first = drawer.querySelector("a");
        if (first) first.focus();
      }
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    const desktop = window.matchMedia("(min-width: 960px)");
    const closeIfDesktop = () => {
      if (desktop.matches && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
    };
    desktop.addEventListener("change", closeIfDesktop);
  }

  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    const leavesPortfolio = href.startsWith("http") || href.endsWith(".pdf");
    if (!leavesPortfolio) return;
    anchor.target = "_blank";
    const rel = new Set((anchor.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    anchor.setAttribute("rel", [...rel].join(" "));
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) root.setAttribute("data-reduced-motion", "");

  const sectionIds = ["about", "skills", "projects", "experience", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll(".nav-primary a[data-section]");

  const setActive = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute("data-section") === id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const sectionIo = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach((section) => sectionIo.observe(section));
  }
})();
