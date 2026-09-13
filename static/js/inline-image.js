// Makes inline prose images clickable, opening them in a simple single-image
// lightbox (no carousel navigation). Gallery images have their own CSS-only
// lightbox and are excluded here.
(function () {
  "use strict";

  var overlay;
  var overlayImg;
  var lastFocused;

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "img-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    overlayImg = document.createElement("img");
    overlayImg.alt = "";

    var close = document.createElement("button");
    close.type = "button";
    close.className = "img-lightbox__close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = "&times;";

    overlay.appendChild(overlayImg);
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target === close) {
        hide();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        hide();
      }
    });
  }

  function show(img) {
    if (!overlay) {
      buildOverlay();
    }
    lastFocused = document.activeElement;
    overlayImg.src = img.currentSrc || img.src;
    overlayImg.alt = img.alt || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function hide() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    overlayImg.src = "";
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }

  function init() {
    var imgs = document.querySelectorAll(".content p > img, .content figure > img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      // Skip images that are wrapped in a link (already actionable).
      if (img.closest("a")) {
        continue;
      }
      img.classList.add("img-zoom");
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      (function (el) {
        el.addEventListener("click", function () {
          show(el);
        });
        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            show(el);
          }
        });
      })(img);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
