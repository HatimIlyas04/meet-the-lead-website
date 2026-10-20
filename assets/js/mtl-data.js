/* =========================================================
   MEET THE LEAD — Configuration et données centralisées
   ---------------------------------------------------------
   C'est le SEUL endroit où modifier :
   - les liens Google Forms des espaces d'inscription ;
   - l'adresse et le service d'envoi des demandes de partenariat ;
   - la liste des partenaires et sponsors.
   Ne jamais inventer d'URL : laisser "" tant que le lien
   officiel n'est pas confirmé (le bouton passe alors en
   « inscriptions bientôt ouvertes »).

   CHECK-LIST DE MISE EN SERVICE
   [ ] BRIDGE_TO_JOB_GOOGLE_FORM_URL : coller le lien du formulaire officiel.
   [ ] Formulaire partenariat : envoyer une 1re demande test depuis le site en ligne,
       puis cliquer sur « Activate Form » dans l'e-mail reçu par FormSubmit
       (startupgrowfoundation@gmail.com). Tant que ce n'est pas fait, le site
       affiche un message d'erreur (jamais de faux succès).
   ========================================================= */
(function () {
    "use strict";

    var config = {
        // Formulaires Google officiels (vérifiés dans le site existant)
        HACKATHON_GOOGLE_FORM_URL: "https://forms.gle/25t1gJt2nKUhwgA96",
        AFRICA_IMPACT_AWARDS_GOOGLE_FORM_URL: "https://forms.gle/HpUKgaKHbWmBSjq28",
        // À RENSEIGNER : aucun formulaire Bridge to Job officiel n'a été trouvé.
        BRIDGE_TO_JOB_GOOGLE_FORM_URL: "",
        // Formulaire général de réservation de l'événement (27–28 novembre)
        EVENT_GOOGLE_FORM_URL: "https://forms.gle/ZoBgGsGPZ2y3SVkx7",

        // Demandes de partenariat
        PARTNERSHIP_RECIPIENT_EMAIL: "startupgrowfoundation@gmail.com",
        // Service d'envoi (FormSubmit, API AJAX, sans clé secrète).
        // Après activation, remplacer l'adresse par l'alias aléatoire fourni par FormSubmit.
        // Laisser "" pour désactiver l'envoi (le formulaire affiche alors un état « indisponible »).
        PARTNERSHIP_FORM_ENDPOINT: "https://formsubmit.co/ajax/startupgrowfoundation@gmail.com"
    };

    // Dates vérifiées
    var dates = {
        event: "27 – 28 novembre 2026",
        hackathon: "26 – 28 novembre 2026"
    };

    // Espaces d'inscription. `path` est relatif à la racine du site.
    var spaces = [
        {
            id: "hackathon",
            index: "01",
            name: "Hackathon",
            formTitle: "Hackathon d'innovation ouverte",
            path: "hackathon/inscription/",
            formUrl: config.HACKATHON_GOOGLE_FORM_URL,
            cta: "Je m'inscris au Hackathon",
            date: dates.hackathon,
            color: "var(--teal)"
        },
        {
            id: "africa-impact-awards",
            index: "02",
            name: "Africa Impact Awards",
            formTitle: "Africa Impact Awards 2026",
            path: "africa-impact-awards/inscription/",
            formUrl: config.AFRICA_IMPACT_AWARDS_GOOGLE_FORM_URL,
            cta: "Déposer ma candidature",
            date: dates.event,
            color: "var(--yellow)"
        },
        {
            id: "bridge-to-job",
            index: "03",
            name: "Bridge to Job",
            formTitle: "Bridge to Job",
            path: "bridge-to-job/inscription/",
            formUrl: config.BRIDGE_TO_JOB_GOOGLE_FORM_URL,
            cta: "Rejoindre Bridge to Job",
            date: dates.event,
            color: "var(--blue)"
        }
    ];
    spaces.forEach(function (s) { s.status = s.formUrl ? "active" : "pending"; });

    // Catégories officielles (affiche partenaires MTL 2026)
    var partnerCategories = [
        { id: "institutionnels", label: "Partenaires institutionnels", color: "var(--blue)" },
        { id: "gold", label: "Sponsors Gold", color: "var(--yellow)" },
        { id: "hackathon", label: "Partenaire Hackathon", color: "var(--teal)" },
        { id: "sponsor", label: "Sponsor", color: "var(--pink)" },
        // Pas une catégorie de sponsoring : affichée à part, en fin de section.
        { id: "organisateur", label: "Organisateur", color: "var(--purple)", organizer: true }
    ];

    // `width`/`height` = dimensions réelles du fichier (évite les décalages de mise en page).
    // `optical` ajuste finement la présence visuelle (1 = neutre).
    // `logo: null` = fichier officiel manquant (affiché en état « logo manquant »).
    var partners = [
        { id: "cri-oriental", name: "Centre Régional d'Investissement de l'Oriental", short: "CRI Oriental",
          category: "institutionnels", order: 1,
          logo: "assets/img/partners/cri-oriental.png", width: 404, height: 184, optical: 1.18,
          alt: "Centre Régional d'Investissement de la Région de l'Oriental (CRI Oriental)" },
        { id: "wilaya-oriental", name: "Wilaya de la Région de l'Oriental", short: "Wilaya de l'Oriental",
          category: "institutionnels", order: 2,
          logo: "assets/img/partners/wilaya-oriental.png", width: 203, height: 240, optical: 1.05,
          alt: "Wilaya de la Région de l'Oriental" },

        { id: "belgique-cooperation", name: "Belgique — partenaire du développement", short: "Belgique",
          category: "gold", order: 1,
          logo: "assets/img/partners/belgique-partenaire-developpement.png", width: 960, height: 221, optical: 1,
          alt: "Belgique, partenaire du développement (Coopération belge au développement)" },
        { id: "min-ajliki", name: "Min Ajliki", short: "Min Ajliki",
          category: "gold", order: 2,
          logo: "assets/img/partners/min-ajliki.png", width: 350, height: 240, optical: .9,
          alt: "Min Ajliki" },
        { id: "apefe", name: "APEFE", short: "APEFE",
          category: "gold", order: 3,
          logo: "assets/img/partners/apefe.png", width: 457, height: 240, optical: .92,
          alt: "APEFE" },

        { id: "cosumar", name: "COSUMAR", short: "COSUMAR",
          category: "hackathon", order: 1,
          logo: "assets/img/partners/cosumar.png", width: 321, height: 240, optical: 1,
          alt: "COSUMAR" },

        { id: "sojori", name: "Sojori", short: "Sojori",
          category: "sponsor", order: 1,
          logo: "assets/img/partners/sojori.png", width: 446, height: 141, optical: .95,
          alt: "Sojori — AI workforce for hospitality" },

        { id: "startupgrow-foundation", name: "StartupGrow Foundation", short: "StartupGrow Foundation",
          category: "organisateur", order: 1,
          logo: "assets/img/partners/startupgrow-foundation.png", width: 760, height: 200, optical: 1,
          alt: "StartupGrow Foundation" }
    ];

    // Speakers confirmés de la 8ème édition (2026), dans l'ordre du visuel officiel « Speakers 2026 ».
    // Affichage : photo, nom, fonction (role + organisation), drapeau. Rien d'autre.
    // Plusieurs fonctions : titles: [{ role, organization }, ...] (une ligne chacune).
    // Ne publier que des intervenants confirmés (confirmed: true).
    var speakers2026 = [
        { id: "ryad-mezzour", name: "Ryad Mezzour",
          role: "Ministre de l'Industrie, du Commerce, de l'Investissement et de l'Inclusion économique", organization: "",
          country: "ma", color: "var(--pink)", displayOrder: 1 },
        { id: "mohamed-bachiri", name: "Mohamed Bachiri",
          titles: [{ role: "Directeur Général", organization: "Renault Group Maroc" }, { role: "Vice-Président Général", organization: "CGEM" }],
          country: "ma", color: "var(--blue)", displayOrder: 2 },
        { id: "anouar-alaoui-ismaili", name: "Anouar Alaoui Ismaili", role: "Directeur Général", organization: "Maroc PME",
          country: "ma", color: "var(--teal)", displayOrder: 3 },
        { id: "unielle-oupolo", name: "Unielle Oupolo", role: "Épouse de Son Excellence l'Ambassadeur du Gabon", organization: "Présidente du Cercle Diplomatique",
          country: "ga", color: "var(--purple)", displayOrder: 4 },
        { id: "tawfiq-gouach", name: "Tawfiq Gouach", role: "Fondateur & CEO", organization: "SOJORI",
          country: "ma", color: "var(--yellow)", displayOrder: 5 },
        { id: "zineb-hatim", name: "Zineb Hatim", role: "Présidente", organization: "Maroc Entrepreneurs",
          country: "ma", color: "var(--pink)", displayOrder: 6 },
        { id: "rachid-ressani", name: "Rachid Ressani", role: "Président", organization: "APEBI",
          country: "ma", color: "var(--blue)", displayOrder: 7 }
    ];
    speakers2026.forEach(function (s) {
        s.image = "assets/img/speakers-2026/" + s.id + ".jpg";
        s.width = 560; s.height = 700; // portraits 4:5
        s.edition = 2026; s.confirmed = true;
    });

    var countries = {
        ma: { name: "Maroc", flag: "assets/img/flags/ma.svg" },
        ga: { name: "Gabon", flag: "assets/img/flags/ga.svg" }
    };

    // À incrémenter quand une photo est remplacée sous le même nom (force le rechargement)
    var assetsVersion = "7";

    window.MTL = {
        assetsVersion: assetsVersion,
        config: config,
        dates: dates,
        spaces: spaces,
        partnerCategories: partnerCategories,
        partners: partners,
        speakers2026: speakers2026,
        countries: countries
    };
})();
