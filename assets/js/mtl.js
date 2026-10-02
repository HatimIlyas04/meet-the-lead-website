/* =========================================================
   MEET THE LEAD — scripts du site (sans dépendance)
   ========================================================= */
(function () {
    "use strict";

    // Date de la 8ème édition : 27 novembre 2026, 09h00 heure du Maroc (UTC+1)
    var EVENT_DATE = new Date("2026-11-27T09:00:00+01:00");

    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    /* ---------- Header au scroll + bouton retour en haut ---------- */
    var header = $(".site-header");
    var backTop = $(".back-top");
    function onScroll() {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        if (header) header.classList.toggle("scrolled", y > 10);
        if (backTop) backTop.classList.toggle("show", y > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (backTop) {
        backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    }

    /* ---------- Menu mobile ---------- */
    var toggle = $(".nav-toggle");
    var nav = $(".main-nav");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        $$("a", nav).forEach(function (a) {
            a.addEventListener("click", function () {
                nav.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    /* ---------- Lien actif dans le menu ---------- */
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page === "blog_details.html") page = "blog.html";
    $$(".main-nav a[href]").forEach(function (a) {
        if (a.getAttribute("href").toLowerCase() === page) a.classList.add("active");
    });

    /* ---------- Compte à rebours ---------- */
    $$("[data-countdown]").forEach(function (el) {
        var parts = {
            d: $("[data-cd=days]", el),
            h: $("[data-cd=hours]", el),
            m: $("[data-cd=minutes]", el),
            s: $("[data-cd=seconds]", el)
        };
        var pad = function (n) { return n < 10 ? "0" + n : String(n); };
        var timer;
        function tick() {
            var diff = EVENT_DATE.getTime() - Date.now();
            if (diff <= 0) {
                clearInterval(timer);
                $$(".cd-item", el).forEach(function (i) { i.remove(); });
                var done = document.createElement("div");
                done.className = "countdown-done";
                done.textContent = "C'est parti ! La 8ème édition de Meet The Lead a commencé.";
                el.insertBefore(done, el.firstChild);
                return;
            }
            var sec = Math.floor(diff / 1000);
            if (parts.d) parts.d.textContent = pad(Math.floor(sec / 86400));
            if (parts.h) parts.h.textContent = pad(Math.floor((sec % 86400) / 3600));
            if (parts.m) parts.m.textContent = pad(Math.floor((sec % 3600) / 60));
            if (parts.s) parts.s.textContent = pad(sec % 60);
        }
        tick();
        timer = setInterval(tick, 1000);
    });

    /* ---------- Onglets (programme) ---------- */
    $$("[role=tablist]").forEach(function (list) {
        var tabs = $$("[role=tab]", list);
        function select(tab) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute("aria-selected", on ? "true" : "false");
                t.tabIndex = on ? 0 : -1;
                var panel = document.getElementById(t.getAttribute("aria-controls"));
                if (panel) panel.hidden = !on;
            });
        }
        tabs.forEach(function (tab, i) {
            tab.addEventListener("click", function () { select(tab); });
            tab.addEventListener("keydown", function (e) {
                var next = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length]
                    : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
                if (next) { e.preventDefault(); select(next); next.focus(); }
            });
        });
    });

    /* ---------- Vidéo YouTube en popup ---------- */
    var modal = $("#video-modal");
    if (modal) {
        var frameBox = $(".modal-inner", modal);
        var close = function () {
            modal.hidden = true;
            var f = $("iframe", frameBox);
            if (f) f.remove();
            document.body.style.overflow = "";
        };
        $$("[data-video]").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                var iframe = document.createElement("iframe");
                iframe.src = "https://www.youtube-nocookie.com/embed/" + btn.getAttribute("data-video") + "?autoplay=1&rel=0";
                iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
                iframe.allowFullscreen = true;
                iframe.title = "Vidéo Meet The Lead";
                frameBox.appendChild(iframe);
                modal.hidden = false;
                document.body.style.overflow = "hidden";
            });
        });
        modal.addEventListener("click", function (e) {
            if (e.target === modal || e.target.closest(".modal-close")) close();
        });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });
    }

    /* ---------- Apparition au scroll ---------- */
    var reveals = $$(".reveal");
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- Formulaire de contact (site statique → ouvre la messagerie) ---------- */
    var form = $("#contact-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var status = $(".form-status", form);
            var data = new FormData(form);
            var name = (data.get("name") || "").trim();
            var email = (data.get("email") || "").trim();
            var subject = (data.get("subject") || "").trim();
            var message = (data.get("message") || "").trim();
            if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                status.className = "form-status err";
                status.textContent = "Merci de remplir votre nom, un email valide et votre message.";
                return;
            }
            var body = message + "\n\n— " + name + " (" + email + ")";
            window.location.href = "mailto:" + form.getAttribute("data-to") +
                "?subject=" + encodeURIComponent("[Meet The Lead] " + (subject || "Contact")) +
                "&body=" + encodeURIComponent(body);
            status.className = "form-status ok";
            status.textContent = "Votre messagerie va s'ouvrir avec le message pré-rempli. Il ne reste plus qu'à l'envoyer.";
        });
    }

    /* ---------- Année du copyright ---------- */
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
