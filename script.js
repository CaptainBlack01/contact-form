(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  const success = document.getElementById("success");
  const submitBtn = document.getElementById("submit-btn");
  const againBtn = document.getElementById("again");
  const message = document.getElementById("message");
  const count = document.getElementById("count");
  const toast = document.getElementById("toast");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: function (value) {
      if (!value.trim()) return "Please enter your name.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    },
    email: function (value) {
      if (!value.trim()) return "Please enter your email.";
      if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address.";
      return "";
    },
    subject: function (value) {
      if (!value) return "Please choose a subject.";
      return "";
    },
    message: function (value) {
      if (!value.trim()) return "Please write a message.";
      if (value.trim().length < 10) return "Message must be at least 10 characters.";
      return "";
    },
  };

  function setFieldError(name, messageText) {
    const field = form.querySelector('[data-field="' + name + '"]');
    const input = form.elements[name];
    const errorEl = document.getElementById(name + "-error");

    field.classList.toggle("has-error", Boolean(messageText));
    errorEl.textContent = messageText;
    input.setAttribute("aria-invalid", String(Boolean(messageText)));
  }

  function validateField(name) {
    const value = form.elements[name].value;
    const messageText = rules[name](value);
    setFieldError(name, messageText);
    return !messageText;
  }

  Object.keys(rules).forEach(function (name) {
    const input = form.elements[name];
    input.addEventListener("blur", function () {
      if (input.value || input.dataset.touched) validateField(name);
    });
    input.addEventListener("input", function () {
      input.dataset.touched = "true";
      if (form.querySelector('[data-field="' + name + '"]').classList.contains("has-error")) {
        validateField(name);
      }
    });
    input.addEventListener("change", function () {
      if (name === "subject") validateField(name);
    });
  });

  message.addEventListener("input", function () {
    count.textContent = message.value.length;
  });

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      const ok = validateField(name);
      if (!ok && !firstInvalid) firstInvalid = form.elements[name];
    });

    if (firstInvalid) {
      firstInvalid.focus();
      showToast("Please fix the highlighted fields.");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    window.setTimeout(function () {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      form.hidden = true;
      success.hidden = false;
      showToast("Message sent successfully.");
    }, 900);
  });

  againBtn.addEventListener("click", function () {
    form.reset();
    Object.keys(rules).forEach(function (name) {
      const input = form.elements[name];
      delete input.dataset.touched;
      setFieldError(name, "");
    });
    count.textContent = "0";
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
