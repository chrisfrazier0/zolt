// Adds a copy-to-clipboard button to each highlighted code block. The button
// stays hidden until the block is hovered (and is always shown on touch
// devices, which have no hover state).
(function () {
  "use strict";

  var COPY_ICON =
    '<svg class="code-block__icon code-block__icon--copy" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var CHECK_ICON =
    '<svg class="code-block__icon code-block__icon--check" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';

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

  function codeText(pre) {
    var code = pre.querySelector("code");
    var node = (code || pre).cloneNode(true);
    // Drop line-number gutters so they aren't copied.
    var gutters = node.querySelectorAll(".giallo-ln");
    for (var i = 0; i < gutters.length; i++) {
      gutters[i].remove();
    }
    return node.textContent.replace(/\n$/, "");
  }

  function makeButton(pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-block__copy";
    btn.setAttribute("aria-label", "Copy code");
    btn.title = "Copy";
    btn.innerHTML = COPY_ICON + CHECK_ICON;

    var timer;
    btn.addEventListener("click", function () {
      copyText(codeText(pre)).then(
        function () {
          btn.classList.add("is-copied");
          btn.setAttribute("aria-label", "Copied");
          btn.title = "Copied";
          clearTimeout(timer);
          timer = setTimeout(function () {
            btn.classList.remove("is-copied");
            btn.setAttribute("aria-label", "Copy code");
            btn.title = "Copy";
          }, 2000);
        },
        function () {
          btn.setAttribute("aria-label", "Copy failed");
          btn.title = "Copy failed";
        },
      );
    });
    return btn;
  }

  function init() {
    var blocks = document.querySelectorAll("pre");
    for (var i = 0; i < blocks.length; i++) {
      var pre = blocks[i];
      if (!pre.querySelector("code") || pre.parentNode.classList.contains("code-block")) {
        continue;
      }
      var wrap = document.createElement("div");
      wrap.className = "code-block";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.appendChild(makeButton(pre));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
