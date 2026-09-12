// Light/dark theme toggle. The theme defaults to the system preference; the
// zero-flash inline script in <head> applies any saved choice before paint, and
// this script keeps the toggle button, stored preference, and theme-color meta
// in sync. Storing a value pins the theme; the site otherwise follows the OS.
(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var mql = window.matchMedia("(prefers-color-scheme: dark)");
  var btn;

  function stored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function isDark() {
    var choice = stored();
    return choice ? choice === "dark" : mql.matches;
  }

  function updateButton(dark) {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    btn.title = dark ? "Light mode" : "Dark mode";
  }

  // theme is "light", "dark", or null to follow the system preference.
  function apply(theme) {
    var root = document.documentElement;
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      // Read the resolved background from the --bg token so colours live only
      // in sass/_theme.sass.
      var bg = getComputedStyle(root).getPropertyValue("--bg").trim();
      if (bg) meta.setAttribute("content", bg);
    }
    updateButton(theme ? theme === "dark" : mql.matches);
  }

  function init() {
    btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
        apply(next);
      });
      updateButton(isDark());
    }

    // Live-update while the visitor is following the system preference.
    mql.addEventListener("change", function () {
      if (!stored()) apply(null);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
