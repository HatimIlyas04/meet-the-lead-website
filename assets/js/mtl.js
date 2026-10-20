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

    /* ---------- Données centralisées (assets/js/mtl-data.js) ---------- */
    var MTL = window.MTL || { config: {}, spaces: [], partnerCategories: [], partners: [] };
    // Préfixe vers la racine du site (pages en sous-dossier : data-root="../../")
    var ROOT = document.body.getAttribute("data-root") || "";
    var findSpace = function (id) { return MTL.spaces.filter(function (s) { return s.id === id; })[0]; };
    var esc = function (str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    };

    /* ---------- Menu « S'inscrire » ---------- */
    var regToggle = $(".reg-toggle");
    var regPanel = $("#reg-panel");
    if (regToggle && regPanel) {
        var setReg = function (open) {
            // Ferme d'abord le menu mobile (avant d'afficher le panneau)
            if (open && nav && nav.classList.contains("open")) toggle.click();
            regPanel.hidden = !open;
            regToggle.setAttribute("aria-expanded", open ? "true" : "false");
        };
        regToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            setReg(regPanel.hidden);
            if (!regPanel.hidden) { var first = $("a", regPanel); if (first) first.focus(); }
        });
        document.addEventListener("click", function (e) {
            if (!regPanel.hidden && !regPanel.contains(e.target)) setReg(false);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !regPanel.hidden) { setReg(false); regToggle.focus(); }
        });
        if (toggle) toggle.addEventListener("click", function () { if (!regPanel.hidden) setReg(false); });
    }

    /* ---------- Liens vers les formulaires Google ---------- */
    $$("[data-form-space]").forEach(function (el) {
        var space = findSpace(el.getAttribute("data-form-space"));
        if (!space) return;
        if (space.status === "active") {
            el.href = space.formUrl;
            el.target = "_blank";
            el.rel = "noopener noreferrer";
            el.setAttribute("aria-label", el.textContent.trim() + " — ouvre le formulaire Google officiel « " + space.formTitle + " » dans un nouvel onglet");
            el.classList.remove("is-pending");
        } else {
            // Pas de lien officiel configuré : aucun bouton actif menant nulle part.
            var pending = document.createElement("span");
            pending.className = el.className + " is-pending";
            pending.setAttribute("role", "status");
            pending.innerHTML = '<i class="fas fa-hourglass-half" aria-hidden="true"></i> Inscriptions bientôt ouvertes';
            el.parentNode.replaceChild(pending, el);
        }
    });
    $$("[data-space-pending-note]").forEach(function (el) {
        var space = findSpace(el.getAttribute("data-space-pending-note"));
        el.hidden = !space || space.status !== "pending";
    });
    $$("[data-space-status]").forEach(function (el) {
        var space = findSpace(el.getAttribute("data-space-status"));
        if (space && space.status === "pending") {
            el.hidden = false;
            el.textContent = "Ouverture prochaine";
        }
    });

    /* ---------- Mur des partenaires ---------- */
    // Taille optique : surface équivalente quelles que soient les proportions du logo.
    function logoCell(p, base) {
        if (!p.logo) {
            if (window.console) console.warn("[MTL] Logo officiel manquant pour « " + p.name + " » — ajouter le fichier dans assets/img/partners/ puis renseigner mtl-data.js.");
            return '<li class="partner-cell is-missing" data-missing-asset="' + esc(p.id) + '" style="flex-grow:' + Math.round(base * 1.4) + '">' +
                '<span class="partner-name">' + esc(p.name) + '</span></li>';
        }
        var ratio = p.width / p.height;
        var w = Math.round(base * Math.sqrt(ratio) * (p.optical || 1));
        // Cellule proportionnelle à la largeur optique : un logo large n'est pas écrasé
        return '<li class="partner-cell" style="flex-grow:' + w + '">' +
            '<img src="' + esc(ROOT + p.logo) + '" alt="' + esc(p.alt || p.name) + '" width="' + p.width + '" height="' + p.height + '"' +
            ' style="--logo-w:' + w + 'px" loading="lazy" decoding="async"></li>';
    }
    function partnersOf(cat) {
        return MTL.partners.filter(function (p) { return p.category === cat; })
            .sort(function (a, b) { return a.order - b.order; });
    }
    $$("[data-partner-wall]").forEach(function (wall) {
        var organizer = "";
        wall.innerHTML = MTL.partnerCategories.map(function (cat, i) {
            var list = partnersOf(cat.id);
            if (!list.length) return "";
            if (cat.organizer) {
                // L'organisateur n'est pas un sponsor : bloc distinct, en fin de section
                organizer = '<section class="organizer-block reveal" style="--c:' + cat.color + '" aria-labelledby="pg-' + cat.id + '">' +
                    '<h3 class="org-label" id="pg-' + cat.id + '">' + esc(cat.label) + '</h3>' +
                    '<ul class="partner-logos">' + list.map(function (p) { return logoCell(p, 118); }).join("") + '</ul></section>';
                return "";
            }
            var single = list.length === 1;
            return '<section class="partner-group reveal is-' + cat.id + (single ? " is-single" : "") + '" style="--c:' + cat.color + '" aria-labelledby="pg-' + cat.id + '">' +
                '<header class="partner-group-head"><span class="pg-num">0' + (i + 1) + '</span>' +
                '<h3 id="pg-' + cat.id + '">' + esc(cat.label) + '</h3></header>' +
                '<ul class="partner-logos" style="--cols:' + list.length + '">' +
                list.map(function (p) { return logoCell(p, single ? 128 : 112); }).join("") +
                '</ul></section>';
        }).join("") + organizer;
    });

    /* ---------- New Speakers 2026 ---------- */
    // Chaque intervenant : photo, nom, fonction, drapeau. Rien d'autre.
    $$("[data-speakers-2026]").forEach(function (box) {
        var list = (MTL.speakers2026 || []).filter(function (s) { return s.confirmed && s.edition === 2026; })
            .sort(function (a, b) { return a.displayOrder - b.displayOrder; });
        if (!list.length) {
            box.outerHTML = '<p class="ns-soon">New Speakers 2026 — <span>Coming soon</span></p>';
            return;
        }
        var countries = MTL.countries || {};
        box.innerHTML = list.map(function (s, i) {
            var c = countries[s.country];
            var img = ROOT + s.image;
            var titles = s.titles || [{ role: s.role, organization: s.organization }];
            var plain = titles.map(function (t) { return t.role + (t.organization ? ", " + t.organization : ""); }).join(" ; ");
            var v = "?v=" + (MTL.assetsVersion || "1");
            return '<li class="ns-item reveal" style="--c:' + s.color + ';--i:' + i + '">' +
                '<figure class="ns-photo"><span class="ns-frame"><picture>' +
                '<source type="image/webp" srcset="' + esc(img.replace(/\.jpg$/, ".webp") + v) + '">' +
                '<img src="' + esc(img + v) + '" alt="' + esc(s.name + ", " + plain) + '" width="' + s.width + '" height="' + s.height + '" loading="lazy" decoding="async">' +
                '</picture></span></figure>' +
                '<h3 class="ns-name">' + esc(s.name) + '</h3>' +
                '<p class="ns-role">' + titles.map(function (t) { return '<span>' + esc(t.role) + (t.organization ? '<b>' + esc(t.organization) + '</b>' : '') + '</span>'; }).join("") + '</p>' +
                (c ? '<img class="ns-flag" src="' + esc(ROOT + c.flag) + '" alt="' + esc(c.name) + '" title="' + esc(c.name) + '" width="24" height="16">' : '') +
                '</li>';
        }).join("");
    });
    // Vitrine d'une seule catégorie (ex. partenaire Hackathon sur la page d'inscription)
    $$("[data-partner-category]").forEach(function (box) {
        var list = partnersOf(box.getAttribute("data-partner-category"));
        box.innerHTML = list.map(function (p) { return logoCell(p, 92); }).join("");
        box.hidden = !list.length;
    });

    /* ---------- Formulaire « Devenir partenaire » ---------- */
    var pForm = $("#partner-form");
    if (pForm) {
        var pStatus = $(".form-status", pForm);
        var pSubmit = $("button[type=submit]", pForm);
        var pLabel = pSubmit.innerHTML;
        var startedAt = Date.now();
        var endpoint = MTL.config.PARTNERSHIP_FORM_ENDPOINT;
        var recipient = MTL.config.PARTNERSHIP_RECIPIENT_EMAIL;
        var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        var showStatus = function (type, html) {
            pStatus.className = "form-status " + type;
            pStatus.innerHTML = html;
        };
        var mailLink = recipient ? ' Vous pouvez aussi nous écrire à <a href="mailto:' + esc(recipient) + '">' + esc(recipient) + '</a>.' : "";

        if (!endpoint) {
            pSubmit.disabled = true;
            showStatus("err", "L'envoi en ligne n'est pas encore activé." + mailLink);
        }

        var setFieldError = function (field, msg) {
            var wrap = field.closest(".field");
            var err = wrap && $(".field-error", wrap);
            field.setAttribute("aria-invalid", msg ? "true" : "false");
            if (err) { err.textContent = msg || ""; err.hidden = !msg; }
        };
        var validate = function () {
            var firstBad = null;
            $$("[data-validate]", pForm).forEach(function (f) {
                var v = f.type === "checkbox" ? f.checked : f.value.trim();
                var msg = "";
                if (f.required && !v) msg = f.getAttribute("data-msg") || "Ce champ est obligatoire.";
                else if (f.type === "email" && v && !EMAIL_RE.test(v)) msg = "Merci d'indiquer une adresse e-mail valide.";
                else if (f.type === "tel" && v && !/^[+()\d\s.-]{6,20}$/.test(v)) msg = "Merci d'indiquer un numéro de téléphone valide.";
                else if (f.maxLength > 0 && typeof v === "string" && v.length > f.maxLength) msg = "Texte trop long.";
                setFieldError(f, msg);
                if (msg && !firstBad) firstBad = f;
            });
            return firstBad;
        };
        $$("[data-validate]", pForm).forEach(function (f) {
            f.addEventListener(f.type === "checkbox" || f.tagName === "SELECT" ? "change" : "blur", function () {
                if (f.getAttribute("aria-invalid") === "true" || f.value) validate();
            });
        });

        pForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!endpoint || pSubmit.disabled) return;
            var bad = validate();
            if (bad) {
                showStatus("err", "Merci de corriger les champs signalés.");
                bad.focus();
                return;
            }
            // Anti-spam : champ piège + délai minimal de saisie
            if ($("[name=_honey]", pForm).value || Date.now() - startedAt < 3000) {
                showStatus("err", "Votre demande n'a pas pu être envoyée. Merci de réessayer dans quelques secondes.");
                return;
            }
            var d = new FormData(pForm);
            var val = function (k) { return String(d.get(k) || "").trim(); };
            var payload = {
                "Nom": val("nom"),
                "Organisation": val("organisation"),
                "Fonction": val("fonction"),
                "E-mail": val("email"),
                "Téléphone": val("telephone") || "—",
                "Type de partenariat": val("type"),
                "Message": val("message"),
                "Consentement": "Oui",
                _subject: "Nouvelle demande de partenariat — Meet The Lead 2026",
                _replyto: val("email"),
                _template: "table",
                _captcha: "false",
                _honey: ""
            };

            pSubmit.disabled = true;
            pSubmit.innerHTML = '<span class="spinner" aria-hidden="true"></span> Envoi en cours…';
            pForm.setAttribute("aria-busy", "true");
            showStatus("", "");

            fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(payload)
            }).then(function (res) {
                return res.json().catch(function () { return {}; }).then(function (json) {
                    // Succès uniquement si le service confirme la prise en charge du message.
                    var ok = res.ok && (json.success === true || json.success === "true");
                    if (!ok) throw new Error(json.message || ("HTTP " + res.status));
                });
            }).then(function () {
                pForm.reset();
                $$("[aria-invalid]", pForm).forEach(function (f) { f.setAttribute("aria-invalid", "false"); });
                pForm.classList.add("is-sent");
                showStatus("ok", '<i class="fas fa-check-circle" aria-hidden="true"></i> Merci pour votre intérêt pour Meet The Lead. Votre demande de partenariat a bien été transmise à notre équipe.');
                pStatus.focus();
            }).catch(function (err) {
                if (window.console) console.error("[MTL] Envoi partenariat :", err);
                // Solution de repli : e-mail pré-rempli avec la demande saisie (rien n'est perdu)
                var body = ["Nom", "Organisation", "Fonction", "E-mail", "Téléphone", "Type de partenariat", "Message"]
                    .map(function (k) { return k + " : " + payload[k]; }).join("\n");
                var href = "mailto:" + recipient + "?subject=" + encodeURIComponent(payload._subject) + "&body=" + encodeURIComponent(body);
                showStatus("err", "L'envoi automatique n'a pas abouti. Votre demande n'est pas perdue : envoyez-la directement par e-mail, elle est déjà rédigée." +
                    '<a class="btn btn-primary btn-sm form-fallback" href="' + esc(href) + '"><i class="fas fa-envelope" aria-hidden="true"></i> Envoyer ma demande par e-mail</a>' +
                    '<small>Adresse : ' + esc(recipient) + '</small>');
            }).then(function () {
                pSubmit.disabled = false;
                pSubmit.innerHTML = pLabel;
                pForm.removeAttribute("aria-busy");
            });
        });
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
