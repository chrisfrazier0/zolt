// Turns each heading carrying a copy-link icon into a copy-to-clipboard
// control: clicking anywhere on the heading copies its URL instead of
// navigating, and briefly shows a checkmark on the icon. Section headings (from
// anchor-link.html) copy the absolute section URL and update the #fragment; the
// article/gallery page title copies the page's permalink and leaves the URL
// alone. The icon stays hidden until the heading is hovered (and is always
// shown on touch devices, which have no hover state) via CSS.
(function () {
  "use strict";

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function anchorUrl(link) {
    var href = link.getAttribute("href") || "";
    // Section anchors use a "#id" fragment; the page-title link uses the page's
    // absolute permalink. Resolve either against the current location.
    if (href.charAt(0) === "#") {
      return location.origin + location.pathname + href;
    }
    return href ? new URL(href, location.href).href : location.href;
  }

  function wire(heading, link) {
    var timer;
    // Restore whatever labels the link shipped with (section vs. page wording).
    var defaultLabel = link.getAttribute("aria-label") || "Copy link";
    var defaultTitle = link.getAttribute("title") || defaultLabel;
    heading.addEventListener("click", function (event) {
      // Ignore clicks on other real links inside the heading (rare), and let a
      // text selection stand instead of copying.
      var other = event.target.closest("a");
      if (other && other !== link) {
        return;
      }
      var selection = window.getSelection && window.getSelection();
      if (selection && String(selection).length) {
        return;
      }
      event.preventDefault();
      var href = link.getAttribute("href") || "";
      // Only section anchors update the address bar (with their #fragment); the
      // page-title link must not change the URL.
      if (href.charAt(0) === "#" && history.replaceState) {
        history.replaceState(null, "", href);
      }
      copyText(anchorUrl(link)).then(
        function () {
          link.classList.add("is-copied");
          link.setAttribute("aria-label", "Link copied");
          link.title = "Link copied";
          clearTimeout(timer);
          timer = setTimeout(function () {
            link.classList.remove("is-copied");
            link.setAttribute("aria-label", defaultLabel);
            link.title = defaultTitle;
          }, 2000);
        },
        function () {
          link.setAttribute("aria-label", "Copy failed");
          link.title = "Copy failed";
        },
      );
    });
  }

  function init() {
    var links = document.querySelectorAll(".zola-anchor");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var heading = link.closest("h1, h2, h3, h4, h5, h6") || link.parentNode;
      wire(heading, link);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
