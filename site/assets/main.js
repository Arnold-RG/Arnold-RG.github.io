(() => {
  const root = document.documentElement;
  const themeToggles = document.querySelectorAll(".theme-toggle");
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
    const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeToggles.forEach((toggle) => toggle.setAttribute("aria-label", label));
  };

  applyTheme(getTheme(), false);

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      applyTheme(next, true);
      if (themeStatus) themeStatus.textContent = next === "dark" ? "Dark theme" : "Light theme";
    });
  });

  const menuToggle = document.querySelector(".nav-toggle");
  const drawer = document.getElementById("nav-drawer");
  const main = document.getElementById("main");
  const footer = document.querySelector(".site-footer");

  if (menuToggle && drawer) {
    const setOpen = (open) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawer.hidden = !open;
      document.body.classList.toggle("nav-open", open);
      if (main) {
        if (open) main.setAttribute("inert", "");
        else main.removeAttribute("inert");
      }
      if (footer) {
        if (open) footer.setAttribute("inert", "");
        else footer.removeAttribute("inert");
      }
      if (open) {
        const first = drawer.querySelector("a, button");
        if (first) first.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      setOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        menuToggle.focus();
      }
    });

    const desktop = window.matchMedia("(min-width: 960px)");
    const closeIfDesktop = () => {
      if (desktop.matches && menuToggle.getAttribute("aria-expanded") === "true") setOpen(false);
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
    if (!anchor.querySelector(".new-tab-note")) {
      anchor.insertAdjacentHTML(
        "beforeend",
        '<span class="visually-hidden new-tab-note"> (opens in a new tab)</span>'
      );
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) root.setAttribute("data-reduced-motion", "");

  const sectionIds = ["projects", "experience", "skills", "education", "about", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll(".nav-primary a[data-section]");

  const setActive = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute("data-section") === id) link.setAttribute("aria-current", "location");
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
