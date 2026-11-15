// Light / dark mode.
// Loaded in <head> so the saved theme is applied before the page is drawn (no flash).
(function () {
  const THEME_KEY = "bigfoot-theme";
  const root = document.documentElement;

  function readTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === "light" || saved === "dark" ? saved : "dark"; // dark is the default
    } catch (e) {
      return "dark";
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-bs-theme", theme);
    document.querySelectorAll(".theme-toggle").forEach(btn => {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  applyTheme(readTheme());

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(readTheme()); // update button labels now that they exist

    document.querySelectorAll(".theme-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage blocked: theme works until reload */ }
      });
    });
  });
})();