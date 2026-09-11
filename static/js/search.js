// Minimal client-side search using the elasticlunr index Zola generates.
(function () {
  "use strict";

  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this,
        args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  function init() {
    var input = document.getElementById("search");
    var results = document.getElementById("search-results");
    var status = document.getElementById("search-status");
    var panel = document.getElementById("search-panel");
    if (!input || !results || typeof elasticlunr === "undefined" || !window.searchIndex) {
      return;
    }

    var index = elasticlunr.Index.load(window.searchIndex);
    var reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function clearContent() {
      results.innerHTML = "";
      status.textContent = "";
    }

    function closePanel() {
      if (panel) {
        panel.classList.remove("is-open");
      }
      if (!panel || reduceMotion) {
        clearContent();
      }
    }

    if (panel) {
      panel.addEventListener("transitionend", function (e) {
        if (e.propertyName === "grid-template-rows" && !panel.classList.contains("is-open")) {
          clearContent();
        }
      });
    }

    function render(matches) {
      results.innerHTML = "";
      if (panel) {
        panel.classList.add("is-open");
      }
      if (!matches.length) {
        status.textContent = "No results.";
        return;
      }
      status.textContent = matches.length + " result" + (matches.length === 1 ? "" : "s") + ".";
      matches.forEach(function (match, i) {
        var doc = window.searchIndex.documentStore.docs[match.ref];
        var li = document.createElement("li");
        li.style.animationDelay = Math.min(i, 8) * 40 + "ms";
        var a = document.createElement("a");
        a.href = match.ref;
        a.textContent = doc && doc.title ? doc.title : match.ref;
        li.appendChild(a);
        if (doc && doc.date) {
          var d = new Date(doc.date);
          if (!isNaN(d)) {
            var time = document.createElement("time");
            time.className = "post-date";
            time.dateTime = doc.date;
            time.textContent = d.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              timeZone: "UTC",
            });
            li.appendChild(time);
          }
        }
        if (doc && doc.body) {
          var p = document.createElement("p");
          p.className = "search-result__excerpt";
          p.textContent = doc.body.substring(0, 160) + "\u2026";
          li.appendChild(p);
        }
        results.appendChild(li);
      });
    }

    function run() {
      var q = input.value.trim();
      if (!q) {
        closePanel();
        return;
      }
      var matches = index.search(q, {
        fields: { title: { boost: 2 }, body: { boost: 1 } },
        expand: true,
      });
      render(matches);
    }

    input.addEventListener("input", debounce(run, 150));

    var params = new URLSearchParams(window.location.search);
    if (params.has("q")) {
      input.value = params.get("q");
      run();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
