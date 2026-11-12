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
   [x] BRIDGE_TO_JOB_GOOGLE_FORM_URL : lien officiel du Job Day renseigné.
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
        // Job Day – Bridge to Job (vendredi 27 novembre 2026, Nador)
        BRIDGE_TO_JOB_GOOGLE_FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSdHvNRWZFFjvyxHi2My-n6-TUMWklLmdlTL12k4E_YGGOlcfA/viewform?usp=dialog",
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
            path: "africa-impact-awards/nomination/",
            formUrl: config.AFRICA_IMPACT_AWARDS_GOOGLE_FORM_URL,
            cta: "Nominer dès maintenant",
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
            cta: "S'inscrire au Job Day",
            date: dates.event,
            color: "var(--blue)"
        }
    ];
    spaces.forEach(function (s) { s.status = s.formUrl ? "active" : "pending"; });

    // Catégories officielles MTL 2026 (ordre d'affichage)
    var partnerCategories = [
        { id: "institutionnels", label: "Partenaires institutionnels", color: "var(--blue)" },
        { id: "hackathon", label: "Partenaires Hackathon", color: "var(--teal)" },
        { id: "sponsor", label: "Sponsors", color: "var(--pink)" },
        { id: "jobday", label: "Partenaire Job Day", color: "var(--blue)" },
        { id: "inclusion", label: "Partenaire Inclusion & Employabilité", color: "var(--yellow)" },
        { id: "technologique", label: "Partenaire Technologique", color: "var(--purple)" },
        { id: "ecosysteme", label: "Partenaires Écosystème", color: "var(--teal)" },
        { id: "media", label: "Partenaires Média", color: "var(--pink)" },
        // Pas une catégorie de sponsoring : affichée à part, en fin de section.
        { id: "organisateur", label: "Organisateur", color: "var(--purple)", organizer: true }
    ];

    // `width`/`height` = dimensions réelles du fichier (évite les décalages de mise en page).
    // `optical` ajuste finement la présence visuelle (1 = neutre).
    // `logo: null` = fichier officiel manquant (affiché en état « logo manquant »).
    var P = "assets/img/partenaires/";
    var partners = [
        { id: "tamwilcom", name: "TAMWILCOM", short: "TAMWILCOM",
          category: "institutionnels", order: 1,
          logo: P + "tamwilcom.png", width: 226, height: 300, optical: 1,
          alt: "TAMWILCOM" },
        { id: "cri-oriental", name: "CRI de l'Oriental", short: "CRI Oriental",
          category: "institutionnels", order: 2,
          logo: P + "cri-oriental.png", width: 402, height: 180, optical: 1.18,
          alt: "Centre Régional d'Investissement de la Région de l'Oriental (CRI de l'Oriental)" },
        { id: "wilaya-oriental", name: "Wilaya de la Région de l'Oriental", short: "Wilaya de l'Oriental",
          category: "institutionnels", order: 3,
          logo: P + "wilaya-oriental.png", width: 253, height: 300, optical: 1.05,
          alt: "Wilaya de la Région de l'Oriental" },
        { id: "cgem-oriental", name: "CGEM Oriental", short: "CGEM Oriental",
          category: "institutionnels", order: 4,
          logo: P + "cgem-oriental.png", width: 600, height: 241, optical: 1.2,
          alt: "CGEM Oriental — Confédération Générale des Entreprises du Maroc, Région de l'Oriental" },
        { id: "fcs", name: "FCS — Fédération du Commerce et Services", short: "FCS",
          category: "institutionnels", order: 5,
          logo: P + "fcs.png", width: 600, height: 146, optical: 1,
          alt: "FCS — Fédération du Commerce et Services" },

        { id: "cosumar", name: "COSUMAR", short: "COSUMAR",
          category: "hackathon", order: 1,
          logo: P + "cosumar.png", width: 403, height: 300, optical: .9,
          alt: "COSUMAR" },
        { id: "apefe", name: "APEFE", short: "APEFE",
          category: "hackathon", order: 2,
          logo: P + "apefe.png", width: 572, height: 300, optical: .92,
          alt: "APEFE" },

        { id: "sojori", name: "SOJORI", short: "SOJORI",
          category: "sponsor", order: 1,
          logo: P + "sojori.png", width: 437, height: 135, optical: .95,
          alt: "SOJORI — AI workforce for hospitality" },
        { id: "ainsi-maroc-group", name: "AINSI MAROC GROUP", short: "AINSI MAROC GROUP",
          category: "sponsor", order: 2,
          logo: P + "ainsi-maroc-group.png", width: 327, height: 300, optical: .95,
          alt: "AINSI MAROC GROUP" },

        { id: "in-groupe", name: "IN GROUPE", short: "IN GROUPE",
          category: "jobday", order: 1,
          logo: P + "in-groupe.png", width: 600, height: 286, optical: 1,
          alt: "IN GROUPE" },

        { id: "agef", name: "AGEF Richesses Humaines", short: "AGEF",
          category: "inclusion", order: 1,
          logo: P + "agef.png", width: 297, height: 300, optical: 1,
          alt: "AGEF Richesses Humaines" },

        { id: "eventinas", name: "Eventinas", short: "Eventinas",
          category: "technologique", order: 1,
          logo: P + "eventinas.png", width: 303, height: 300, optical: 1,
          alt: "Eventinas" },

        { id: "cdd", name: "CDD", short: "CDD",
          category: "ecosysteme", order: 1,
          logo: P + "cdd.png", width: 600, height: 165, optical: 1,
          alt: "CDD — Club des Dirigeants" },
        { id: "atpe", name: "ATPE", short: "ATPE",
          category: "ecosysteme", order: 2,
          logo: P + "atpe.png", width: 441, height: 270, optical: 1,
          alt: "ATPE — Association des Très Petites Entreprises" },
        { id: "nexus", name: "NEXUS", short: "NEXUS",
          category: "ecosysteme", order: 3,
          logo: P + "nexus.png", width: 600, height: 172, optical: 1,
          alt: "NEXUS" },

        { id: "aujourdhui-le-maroc", name: "Aujourd'hui Le Maroc", short: "Aujourd'hui Le Maroc",
          category: "media", order: 1,
          logo: P + "aujourdhui-le-maroc.png", width: 600, height: 132, optical: 1,
          alt: "Aujourd'hui Le Maroc" },
        { id: "medias24", name: "Médias24", short: "Médias24",
          category: "media", order: 2,
          logo: P + "medias24.png", width: 600, height: 155, optical: 1,
          alt: "Médias24 — l'information économique marocaine en continu" },

        { id: "startupgrow-foundation", name: "StartupGrow Foundation", short: "StartupGrow Foundation",
          category: "organisateur", order: 1,
          logo: P + "startupgrow-foundation.png", width: 600, height: 153, optical: 1,
          alt: "StartupGrow Foundation" }
    ];

    // Speakers confirmés de la 8ème édition (2026), dans l'ordre de l'annonce Aujourd'hui Le Maroc.
    // Affichage : photo, nom, fonction (role + organisation), drapeau(x). Rien d'autre.
    // Plusieurs nationalités : country: ["ma", "fr"]. Nationalité non confirmée : pas de `country`.
    // Plusieurs fonctions : titles: [{ role, organization }, ...] (une ligne chacune).
    // Ne publier que des intervenants confirmés (confirmed: true).
    var speakers2026 = [
        { id: "ryad-mezzour", name: "Ryad MEZZOUR",
          role: "Ministre de l'Industrie, du Commerce, de l'Investissement et de l'Inclusion Économique",
          country: "ma" },
        { id: "mohamed-bachiri", name: "Mohamed BACHIRI", role: "Vice-Président Général", organization: "CGEM",
          country: "ma" },
        { id: "anouar-alaoui-ismaili", name: "Anouar ALAOUI ISMAILI", role: "Directeur Général", organization: "Maroc PME",
          country: "ma" },
        { id: "mohamed-amin-fatmi", name: "Mohamed Amin FATMI", role: "Président", organization: "CGEM Oriental",
          country: "ma" },
        { id: "rachid-ressani", name: "Rachid RESSANI", role: "Président", organization: "APEBI",
          country: "ma" },
        { id: "unielle-oupolo", name: "Unielle OUPOLO", role: "Présidente du Cercle Diplomatique",
          country: "ga" },
        { id: "hicham-saadli", name: "Hicham SAADLI", role: "Président", organization: "Fédération du Commerce et Services",
          country: "ma" },
        { id: "yassine-karim", name: "Yassine KARIM",
          titles: [{ role: "DG", organization: "Tennaxia Consulting" }, { role: "Vice-Président Général", organization: "FCS" }],
          country: "ma" },
        { id: "tawfiq-gouach", name: "Tawfiq GOUACH", role: "Fondateur & CEO", organization: "SOJORI",
          country: "ma" },
        { id: "rachid-rami", name: "Rachid RAMI", role: "Directeur Général", organization: "CRI de l'Oriental",
          country: "ma" },
        { id: "zineb-hatim", name: "Zineb HATIM", role: "Présidente", organization: "Maroc Entrepreneurs",
          country: ["ma", "fr"] },
        { id: "abdelilah-hammada", name: "Abdelilah HAMMADA", role: "Fondateur & CEO", organization: "ALGUNO",
          country: "ma" },
        { id: "mohammed-louziri", name: "Mohammed LOUZIRI", role: "Président", organization: "Association des Très Petites Entreprises",
          country: "ma" },
        { id: "lahcin-ait-aissa", name: "Lahcin AIT AISSA", role: "Senior Applications Engineer", organization: "Renesas Electronics Europe",
          country: ["ma", "gb"] },
        { id: "fatima-dagdag", name: "Fatima DAGDAG",
          titles: [{ role: "Global IT Program Director" }, { role: "Global Change Management Expert" }],
          country: ["ma", "fr"] }
    ];
    var speakerColors = ["var(--blue)", "var(--teal)", "var(--pink)", "var(--purple)", "var(--yellow)"];
    speakers2026.forEach(function (s, i) {
        // Portraits 4:5 (cadre en arche du site) — assets/img/speakers-2026/<id>.jpg + .webp
        s.image = "assets/img/speakers-2026/" + s.id + ".jpg";
        s.width = 560; s.height = 700;
        s.color = speakerColors[i % speakerColors.length];
        s.displayOrder = i + 1;
        s.edition = 2026; s.confirmed = true;
    });

    var countries = {
        ma: { name: "Maroc", flag: "assets/img/flags/ma.svg" },
        ga: { name: "Gabon", flag: "assets/img/flags/ga.svg" },
        fr: { name: "France", flag: "assets/img/flags/fr.svg" },
        gb: { name: "Royaume-Uni", flag: "assets/img/flags/gb.svg" }
    };

    // À incrémenter quand une photo est remplacée sous le même nom (force le rechargement)
    // + penser au ?v= des balises CSS/JS dans les pages HTML.
    var assetsVersion = "12";

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
