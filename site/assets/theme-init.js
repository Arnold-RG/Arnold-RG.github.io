(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f7f5f0" : "#12161c");
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
