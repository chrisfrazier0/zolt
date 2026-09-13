// Progressively enhances the contact form: validates fields inline (mirroring
// the Worker's rules), posts JSON to /api/contact, surfaces inline status, and
// resets Turnstile on failure.
(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function init() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("cf-status");
    var button = form.querySelector(".contact-form__submit");
    var company = document.getElementById("cf-company");

    var fields = [
      {
        input: document.getElementById("cf-name"),
        error: document.getElementById("cf-name-error"),
        label: "Name",
        max: 100,
      },
      {
        input: document.getElementById("cf-email"),
        error: document.getElementById("cf-email-error"),
        label: "Email",
        max: 200,
        email: true,
      },
      {
        input: document.getElementById("cf-message"),
        error: document.getElementById("cf-message-error"),
        label: "Message",
        max: 5000,
      },
    ];

    function setStatus(msg, kind) {
      status.textContent = msg;
      status.className = "contact-form__status" + (kind ? " is-" + kind : "");
    }

    function setError(field, msg) {
      field.error.textContent = msg || "";
      if (msg) {
        field.input.setAttribute("aria-invalid", "true");
      } else {
        field.input.removeAttribute("aria-invalid");
      }
    }

    function validateField(field) {
      var value = field.input.value.trim();
      if (!value) {
        setError(field, field.label + " is required.");
        return false;
      }
      if (value.length > field.max) {
        setError(field, field.label + " is too long.");
        return false;
      }
      if (field.email && !EMAIL_RE.test(value)) {
        setError(field, "Please enter a valid email address.");
        return false;
      }
      setError(field, "");
      return true;
    }

    // Clear a field's error once the user starts correcting it.
    fields.forEach(function (field) {
      field.input.addEventListener("input", function () {
        if (field.error.textContent) validateField(field);
      });
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        setStatus("Please fix the errors above.", "error");
        firstInvalid.input.focus();
        return;
      }

      var tokenEl = form.querySelector('[name="cf-turnstile-response"]');
      var token = tokenEl ? tokenEl.value : "";
      var payload = {
        name: fields[0].input.value,
        email: fields[1].input.value,
        message: fields[2].input.value,
        company: company.value,
        token: token,
      };

      button.disabled = true;
      setStatus("Sending\u2026", "pending");

      try {
        var res = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        var data = await res.json();
        if (res.ok && data.ok) {
          form.reset();
          setStatus("Thanks! Your message has been sent.", "success");
        } else {
          setStatus(data.error || "Something went wrong. Please try again.", "error");
        }
      } catch (err) {
        setStatus("Network error. Please try again.", "error");
      } finally {
        button.disabled = false;
        if (window.turnstile && typeof window.turnstile.reset === "function") {
          window.turnstile.reset();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
