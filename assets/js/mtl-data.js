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
   [ ] Logos manquants : Wilaya de la Région de l'Oriental, Sojori.
       Déposer le fichier officiel (PNG transparent ou SVG) dans
       assets/img/partners/ puis renseigner logo / width / height ci-dessous.
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
        { id: "sponsor", label: "Sponsor", color: "var(--pink)" }
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
          logo: null, width: 0, height: 0, optical: 1,
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
          logo: null, width: 0, height: 0, optical: 1,
          alt: "Sojori" }
    ];

    window.MTL = {
        config: config,
        dates: dates,
        spaces: spaces,
        partnerCategories: partnerCategories,
        partners: partners
    };
})();
