(function () {
  const cfg = window.FL_ADS || {};
  const WA_NUMBER = "5521987271127";
  const WA_GREETING = "Olá, vim pelo site da FL Printer e preciso de atendimento.";
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/flprintersuportealmeida@gmail.com";

  function waHref(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text || WA_GREETING);
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.setAttribute("href", waHref(el.getAttribute("data-whatsapp-text") || WA_GREETING));
  });

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function loadAds() {
    if (!cfg.googleAdsId || !/^AW-\d+$/.test(cfg.googleAdsId)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(cfg.googleAdsId);
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", cfg.googleAdsId);
  }

  function trackConversion(label) {
    if (!cfg.googleAdsId || !label || typeof window.gtag !== "function") return;
    window.gtag("event", "conversion", {
      send_to: cfg.googleAdsId + "/" + label
    });
  }

  loadAds();

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.addEventListener("click", function () {
      trackConversion(cfg.whatsappConversionLabel);
    });
  });

  const form = document.querySelector("#contato-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if (form.honeypot && form.honeypot.value) {
      status.classList.add("is-ok");
      status.textContent = "Mensagem enviada. Vamos retornar pelo contato informado.";
      form.reset();
      return;
    }

    if (!form.reportValidity()) return;

    const data = {
      nome: form.nome.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      email: form.email.value.trim(),
      servico: form.servico.value,
      mensagem: form.mensagem.value.trim(),
      _subject: "Novo contato pelo site — FL Printer",
      _template: "table",
      _captcha: "false"
    };

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    status.textContent = "Enviando...";

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Falha no envio");
        return response.json();
      })
      .then(function () {
        trackConversion(cfg.formConversionLabel);
        form.reset();
        status.classList.add("is-ok");
        status.textContent = "Mensagem enviada para flprintersuportealmeida@gmail.com. Se precisar de resposta agora, chame no WhatsApp.";
      })
      .catch(function () {
        status.classList.add("is-error");
        status.textContent = "Não foi possível enviar agora. Chame no WhatsApp (21) 98727-1127 ou escreva para flprintersuportealmeida@gmail.com.";
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
