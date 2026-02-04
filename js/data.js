/**
 * ============================================
 * DONNÉES DU PROJET DE RÉNOVATION
 * ============================================
 * Modifiez ce fichier pour mettre à jour toutes les données du site.
 * Toutes les valeurs monétaires sont en euros.
 */

const PROJECT_DATA = {

    // ============================================
    // INFORMATIONS GÉNÉRALES
    // ============================================
    general: {
        nomProjet: "Rénovation Maison Familiale",
        type: "Maison individuelle",
        anneeConstruction: 1975,
        surfaceHabitable: 120, // m²
        surfaceTerrain: 450,   // m²
        nombrePieces: 6,
        localisation: "Île-de-France",
        dateDebut: "2025-03-01",
        dateFinPrevue: "2026-06-30",
    },

    // ============================================
    // DPE
    // ============================================
    dpe: {
        avant: {
            classe: "F",
            consommation: 330, // kWh/m²/an
            ges: 65,           // kgCO2/m²/an
        },
        apres: {
            classe: "B",
            consommation: 85,
            ges: 12,
        }
    },

    // ============================================
    // OBJECTIFS
    // ============================================
    objectifs: [
        {
            icon: "fas fa-leaf",
            titre: "Performance énergétique",
            description: "Passer de la classe F à la classe B, réduire la consommation de 75%"
        },
        {
            icon: "fas fa-couch",
            titre: "Confort de vie",
            description: "Moderniser les espaces, améliorer l'isolation phonique et thermique"
        },
        {
            icon: "fas fa-chart-line",
            titre: "Valorisation du bien",
            description: "Augmenter la valeur du bien de 40 à 60% après rénovation"
        },
        {
            icon: "fas fa-home",
            titre: "Résidence principale",
            description: "En faire notre résidence principale pour les 10 prochaines années minimum"
        },
        {
            icon: "fas fa-euro-sign",
            titre: "Optimisation financière",
            description: "Maximiser les aides et subventions pour réduire le reste à charge"
        }
    ],

    // ============================================
    // TIMELINE DU PROJET
    // ============================================
    timeline: [
        { date: "Janvier 2025", titre: "Recherche du bien", desc: "Visites, étude du marché, comparaisons", status: "completed" },
        { date: "Mars 2025", titre: "Achat de la maison", desc: "Signature chez le notaire", status: "completed" },
        { date: "Avril 2025", titre: "Études et diagnostics", desc: "DPE, amiante, termites, plans", status: "completed" },
        { date: "Mai 2025", titre: "Demandes d'aides", desc: "MaPrimeRénov', CEE, Éco-PTZ", status: "completed" },
        { date: "Juin 2025", titre: "Début gros œuvre", desc: "Toiture, isolation extérieure", status: "active" },
        { date: "Septembre 2025", titre: "Second œuvre", desc: "Électricité, plomberie, chauffage", status: "pending" },
        { date: "Décembre 2025", titre: "Finitions", desc: "Peintures, sols, cuisine, SDB", status: "pending" },
        { date: "Mars 2026", titre: "Emménagement", desc: "Installation et derniers réglages", status: "pending" },
    ],

    // ============================================
    // ACHAT IMMOBILIER
    // ============================================
    achat: {
        prixAchat: 185000,
        fraisNotaire: 15540,
        fraisAgence: 9250,
        fraisDossierBanque: 500,
        fraisGarantie: 2800,
        fraisCourtier: 1500,
        travaux: 95000,
        details: [
            { poste: "Prix d'achat net vendeur", montant: 185000, notes: "Après négociation (-10 000 €)" },
            { poste: "Frais de notaire (8.4%)", montant: 15540, notes: "Ancien, taux plein" },
            { poste: "Frais d'agence (5%)", montant: 9250, notes: "Charge acquéreur" },
            { poste: "Frais de dossier bancaire", montant: 500, notes: "Crédit principal" },
            { poste: "Frais de garantie (caution)", montant: 2800, notes: "Crédit Logement" },
            { poste: "Honoraires courtier", montant: 1500, notes: "1% du montant emprunté" },
            { poste: "Enveloppe travaux estimée", montant: 95000, notes: "Budget prévisionnel rénovation" },
        ]
    },

    // ============================================
    // FINANCEMENT
    // ============================================
    financement: {
        apportPersonnel: 35000,
        revenusMensuels: 4200,
        credits: [
            {
                type: "Crédit immobilier principal",
                montant: 210000,
                taux: 3.45,
                duree: "25 ans",
                mensualite: 1048,
                banque: "Crédit Agricole",
                assurance: 0.34,
                details: {
                    "Montant emprunté": "210 000 €",
                    "Taux nominal": "3,45%",
                    "Taux assurance": "0,34%",
                    "Durée": "25 ans (300 mois)",
                    "Mensualité hors assurance": "1 048 €",
                    "Mensualité avec assurance": "1 108 €",
                    "Coût total du crédit": "122 400 €",
                    "TAEG": "3,92%",
                }
            },
            {
                type: "PTZ (Prêt à Taux Zéro)",
                montant: 40000,
                taux: 0,
                duree: "25 ans (différé 15 ans)",
                mensualite: 0,
                details: {
                    "Montant": "40 000 €",
                    "Taux": "0%",
                    "Durée totale": "25 ans",
                    "Différé de remboursement": "15 ans",
                    "Mensualité pendant différé": "0 €",
                    "Mensualité après différé": "333 €",
                    "Zone": "B1",
                    "Condition": "Primo-accédant",
                }
            },
            {
                type: "Éco-PTZ",
                montant: 30000,
                taux: 0,
                duree: "15 ans",
                mensualite: 167,
                details: {
                    "Montant": "30 000 €",
                    "Taux": "0%",
                    "Durée": "15 ans (180 mois)",
                    "Mensualité": "167 €",
                    "Travaux éligibles": "Bouquet de 3 travaux",
                    "Condition": "Logement > 2 ans",
                }
            },
            {
                type: "Prêt Action Logement",
                montant: 10000,
                taux: 1.0,
                duree: "20 ans",
                mensualite: 46,
                details: {
                    "Montant": "10 000 €",
                    "Taux": "1,00%",
                    "Durée": "20 ans",
                    "Mensualité": "46 €",
                    "Condition": "Salarié secteur privé",
                }
            }
        ]
    },

    // ============================================
    // AIDES & SUBVENTIONS
    // ============================================
    aides: [
        {
            nom: "MaPrimeRénov' - Rénovation globale",
            organisme: "ANAH",
            montantDemande: 15000,
            montantRecu: 15000,
            statut: "recu",
            conditions: "Revenus intermédiaires, gain ≥ 2 classes DPE",
            details: "Aide pour rénovation globale performante. Obligation de réaliser un audit énergétique et d'atteindre un gain minimum de 2 classes DPE."
        },
        {
            nom: "MaPrimeRénov' - PAC air/eau",
            organisme: "ANAH",
            montantDemande: 4000,
            montantRecu: 4000,
            statut: "recu",
            conditions: "Remplacement chaudière fioul/gaz",
            details: "Prime pour l'installation d'une pompe à chaleur air/eau en remplacement d'une chaudière énergivore."
        },
        {
            nom: "CEE - Isolation combles",
            organisme: "Total Énergies",
            montantDemande: 2200,
            montantRecu: 2200,
            statut: "recu",
            conditions: "R ≥ 7 m².K/W",
            details: "Certificats d'économies d'énergie pour l'isolation des combles perdus."
        },
        {
            nom: "CEE - Isolation murs",
            organisme: "Total Énergies",
            montantDemande: 3500,
            montantRecu: 0,
            statut: "en_attente",
            conditions: "R ≥ 3.7 m².K/W, ITE",
            details: "Certificats d'économies d'énergie pour l'isolation thermique par l'extérieur des murs."
        },
        {
            nom: "CEE - PAC",
            organisme: "EDF",
            montantDemande: 2500,
            montantRecu: 0,
            statut: "en_attente",
            conditions: "COP ≥ 3.4",
            details: "Prime CEE pour l'installation d'une pompe à chaleur performante."
        },
        {
            nom: "Aide locale - Conseil départemental",
            organisme: "Département",
            montantDemande: 2000,
            montantRecu: 0,
            statut: "demande",
            conditions: "Résidence principale, travaux d'isolation",
            details: "Aide départementale complémentaire pour les travaux de rénovation énergétique."
        },
        {
            nom: "TVA réduite 5.5%",
            organisme: "État",
            montantDemande: 5700,
            montantRecu: 5700,
            statut: "recu",
            conditions: "Travaux de rénovation énergétique, logement > 2 ans",
            details: "Économie réalisée grâce au taux de TVA réduit à 5.5% au lieu de 20% sur les travaux d'amélioration énergétique."
        }
    ],

    // ============================================
    // TRAVAUX
    // ============================================
    travaux: [
        {
            categorie: "isolation",
            nom: "Isolation des combles",
            icon: "fas fa-layer-group",
            couleur: "#3b82f6",
            budget: 8500,
            depense: 7800,
            avancement: 100,
            executant: "Artisan - SAS IsolPlus",
            dateDebut: "2025-06-01",
            dateFin: "2025-06-15",
            soustaches: [
                { nom: "Dépose ancienne isolation", statut: "done" },
                { nom: "Traitement charpente", statut: "done" },
                { nom: "Pose laine de roche 300mm", statut: "done" },
                { nom: "Pare-vapeur", statut: "done" },
            ]
        },
        {
            categorie: "isolation",
            nom: "Isolation thermique par l'extérieur (ITE)",
            icon: "fas fa-border-all",
            couleur: "#3b82f6",
            budget: 22000,
            depense: 12000,
            avancement: 55,
            executant: "Artisan - Façades Pro",
            dateDebut: "2025-06-15",
            dateFin: "2025-08-30",
            soustaches: [
                { nom: "Échafaudage et préparation", statut: "done" },
                { nom: "Pose isolant PSE 160mm", statut: "progress" },
                { nom: "Sous-enduit + treillis", statut: "pending" },
                { nom: "Enduit de finition", statut: "pending" },
            ]
        },
        {
            categorie: "toiture",
            nom: "Réfection toiture",
            icon: "fas fa-home",
            couleur: "#ef4444",
            budget: 12000,
            depense: 11500,
            avancement: 100,
            executant: "Artisan - Toiture Martin",
            dateDebut: "2025-06-01",
            dateFin: "2025-06-20",
            soustaches: [
                { nom: "Dépose tuiles endommagées", statut: "done" },
                { nom: "Remplacement liteaux", statut: "done" },
                { nom: "Pose nouvelles tuiles", statut: "done" },
                { nom: "Zinguerie (gouttières, noue)", statut: "done" },
            ]
        },
        {
            categorie: "chauffage",
            nom: "Installation PAC air/eau",
            icon: "fas fa-temperature-high",
            couleur: "#f59e0b",
            budget: 14000,
            depense: 5000,
            avancement: 30,
            executant: "Artisan - ClimaConfort RGE",
            dateDebut: "2025-09-01",
            dateFin: "2025-10-15",
            soustaches: [
                { nom: "Dépose chaudière fioul + cuve", statut: "done" },
                { nom: "Installation unité extérieure", statut: "progress" },
                { nom: "Raccordement circuit chauffage", statut: "pending" },
                { nom: "Mise en service et réglages", statut: "pending" },
            ]
        },
        {
            categorie: "chauffage",
            nom: "Plancher chauffant RDC",
            icon: "fas fa-border-all",
            couleur: "#f59e0b",
            budget: 6500,
            depense: 0,
            avancement: 0,
            executant: "Artisan - ClimaConfort RGE",
            dateDebut: "2025-09-15",
            dateFin: "2025-10-30",
            soustaches: [
                { nom: "Ragréage et préparation sol", statut: "pending" },
                { nom: "Pose isolant + tubes PER", statut: "pending" },
                { nom: "Chape fluide", statut: "pending" },
                { nom: "Raccordement collecteur", statut: "pending" },
            ]
        },
        {
            categorie: "electricite",
            nom: "Mise aux normes électriques",
            icon: "fas fa-bolt",
            couleur: "#8b5cf6",
            budget: 8000,
            depense: 2500,
            avancement: 20,
            executant: "Artisan - Elec Solutions",
            dateDebut: "2025-09-01",
            dateFin: "2025-11-15",
            soustaches: [
                { nom: "Nouveau tableau électrique", statut: "done" },
                { nom: "Tirage de câbles", statut: "progress" },
                { nom: "Pose prises et interrupteurs", statut: "pending" },
                { nom: "VMC double flux", statut: "pending" },
                { nom: "Consuel", statut: "pending" },
            ]
        },
        {
            categorie: "plomberie",
            nom: "Rénovation plomberie complète",
            icon: "fas fa-faucet",
            couleur: "#06b6d4",
            budget: 7000,
            depense: 1200,
            avancement: 15,
            executant: "Artisan - Plomb Express",
            dateDebut: "2025-09-15",
            dateFin: "2025-11-30",
            soustaches: [
                { nom: "Dépose anciennes canalisations", statut: "done" },
                { nom: "Nouvelle arrivée d'eau PER", statut: "pending" },
                { nom: "Évacuations PVC", statut: "pending" },
                { nom: "Pose sanitaires", statut: "pending" },
            ]
        },
        {
            categorie: "menuiseries",
            nom: "Remplacement menuiseries extérieures",
            icon: "fas fa-door-open",
            couleur: "#10b981",
            budget: 9000,
            depense: 0,
            avancement: 0,
            executant: "Artisan - Menuiserie Bertrand",
            dateDebut: "2025-10-01",
            dateFin: "2025-10-30",
            soustaches: [
                { nom: "Dépose anciennes fenêtres", statut: "pending" },
                { nom: "Pose fenêtres double vitrage alu", statut: "pending" },
                { nom: "Porte d'entrée sécurisée", statut: "pending" },
                { nom: "Baie vitrée salon", statut: "pending" },
                { nom: "Volets roulants", statut: "pending" },
            ]
        },
        {
            categorie: "finitions",
            nom: "Peintures et revêtements",
            icon: "fas fa-paint-roller",
            couleur: "#ec4899",
            budget: 4500,
            depense: 0,
            avancement: 0,
            executant: "Auto-rénovation",
            dateDebut: "2025-12-01",
            dateFin: "2026-02-28",
            soustaches: [
                { nom: "Enduits et lissage murs", statut: "pending" },
                { nom: "Peinture pièces principales", statut: "pending" },
                { nom: "Pose carrelage SDB", statut: "pending" },
                { nom: "Pose parquet stratifié", statut: "pending" },
            ]
        },
        {
            categorie: "finitions",
            nom: "Cuisine équipée",
            icon: "fas fa-utensils",
            couleur: "#ec4899",
            budget: 6500,
            depense: 0,
            avancement: 0,
            executant: "IKEA + pose auto",
            dateDebut: "2026-01-15",
            dateFin: "2026-02-28",
            soustaches: [
                { nom: "Commande et livraison meubles", statut: "pending" },
                { nom: "Montage caissons", statut: "pending" },
                { nom: "Plan de travail et crédence", statut: "pending" },
                { nom: "Raccordements électroménager", statut: "pending" },
            ]
        }
    ],

    // ============================================
    // MATÉRIAUX
    // ============================================
    materiaux: [
        { nom: "Laine de roche 300mm", categorie: "isolation", fournisseur: "Point P", quantite: "120 m²", prixUnitaire: 25, prixTotal: 3000, statut: "livre" },
        { nom: "PSE graphité 160mm (ITE)", categorie: "isolation", fournisseur: "BigMat", quantite: "180 m²", prixUnitaire: 42, prixTotal: 7560, statut: "livre" },
        { nom: "Enduit de finition ITE", categorie: "isolation", fournisseur: "BigMat", quantite: "200 m²", prixUnitaire: 18, prixTotal: 3600, statut: "commande" },
        { nom: "PAC air/eau Daikin Altherma 3", categorie: "chauffage", fournisseur: "ClimaConfort", quantite: "1", prixUnitaire: 8500, prixTotal: 8500, statut: "livre" },
        { nom: "Tubes PER 16mm plancher chauffant", categorie: "chauffage", fournisseur: "Cedeo", quantite: "350 m", prixUnitaire: 2.5, prixTotal: 875, statut: "stock" },
        { nom: "Collecteur plancher chauffant", categorie: "chauffage", fournisseur: "Cedeo", quantite: "2", prixUnitaire: 280, prixTotal: 560, statut: "stock" },
        { nom: "Tableau électrique Legrand", categorie: "electricite", fournisseur: "Rexel", quantite: "1", prixUnitaire: 650, prixTotal: 650, statut: "livre" },
        { nom: "Câble R2V 2.5mm²", categorie: "electricite", fournisseur: "Rexel", quantite: "200 m", prixUnitaire: 1.8, prixTotal: 360, statut: "livre" },
        { nom: "VMC double flux Aldes", categorie: "electricite", fournisseur: "Cedeo", quantite: "1", prixUnitaire: 2800, prixTotal: 2800, statut: "commande" },
        { nom: "Fenêtres alu DV Argon", categorie: "menuiseries", fournisseur: "Tryba", quantite: "8", prixUnitaire: 650, prixTotal: 5200, statut: "commande" },
        { nom: "Baie vitrée coulissante 2.4m", categorie: "menuiseries", fournisseur: "Tryba", quantite: "1", prixUnitaire: 1800, prixTotal: 1800, statut: "commande" },
        { nom: "Porte d'entrée blindée", categorie: "menuiseries", fournisseur: "Lapeyre", quantite: "1", prixUnitaire: 1500, prixTotal: 1500, statut: "commande" },
        { nom: "Tuiles béton Monier", categorie: "toiture", fournisseur: "Point P", quantite: "45 m²", prixUnitaire: 35, prixTotal: 1575, statut: "livre" },
        { nom: "Gouttières zinc", categorie: "toiture", fournisseur: "Point P", quantite: "24 ml", prixUnitaire: 45, prixTotal: 1080, statut: "livre" },
        { nom: "Tubes PVC évacuation", categorie: "plomberie", fournisseur: "Cedeo", quantite: "30 m", prixUnitaire: 12, prixTotal: 360, statut: "stock" },
        { nom: "Robinetterie Grohe", categorie: "plomberie", fournisseur: "Cedeo", quantite: "4", prixUnitaire: 180, prixTotal: 720, statut: "commande" },
        { nom: "Parquet stratifié chêne", categorie: "finitions", fournisseur: "Leroy Merlin", quantite: "75 m²", prixUnitaire: 22, prixTotal: 1650, statut: "stock" },
        { nom: "Carrelage grès cérame SDB", categorie: "finitions", fournisseur: "Leroy Merlin", quantite: "25 m²", prixUnitaire: 35, prixTotal: 875, statut: "stock" },
        { nom: "Peinture Tollens blanc mat", categorie: "finitions", fournisseur: "Castorama", quantite: "50 L", prixUnitaire: 12, prixTotal: 600, statut: "stock" },
        { nom: "Cuisine IKEA METOD", categorie: "finitions", fournisseur: "IKEA", quantite: "1 lot", prixUnitaire: 4500, prixTotal: 4500, statut: "devis" },
    ],

    // ============================================
    // COMPARATIFS
    // ============================================
    comparatifs: [
        {
            titre: "Chauffage : PAC air/eau vs Chaudière gaz condensation",
            optionA: {
                nom: "PAC air/eau",
                selected: true,
                points: [
                    { icon: "fas fa-check", text: "COP 4.5 : 1 kWh consommé = 4.5 kWh produits" },
                    { icon: "fas fa-check", text: "Éligible MaPrimeRénov' + CEE" },
                    { icon: "fas fa-check", text: "Peut assurer le rafraîchissement" },
                    { icon: "fas fa-minus", text: "Investissement : 14 000 € (hors aides)" },
                    { icon: "fas fa-minus", text: "Bruit unité extérieure" },
                ]
            },
            optionB: {
                nom: "Chaudière gaz condensation",
                selected: false,
                points: [
                    { icon: "fas fa-check", text: "Investissement : 6 000 €" },
                    { icon: "fas fa-check", text: "Technologie éprouvée" },
                    { icon: "fas fa-times", text: "Énergie fossile, prix fluctuant" },
                    { icon: "fas fa-times", text: "Interdite en neuf depuis 2022" },
                    { icon: "fas fa-times", text: "Moins d'aides disponibles" },
                ]
            }
        },
        {
            titre: "Isolation combles : Laine de roche vs Ouate de cellulose",
            optionA: {
                nom: "Laine de roche",
                selected: true,
                points: [
                    { icon: "fas fa-check", text: "Excellent rapport qualité/prix" },
                    { icon: "fas fa-check", text: "Incombustible (A1)" },
                    { icon: "fas fa-check", text: "Résistance à l'humidité" },
                    { icon: "fas fa-minus", text: "Lambda : 0.035 W/m.K" },
                ]
            },
            optionB: {
                nom: "Ouate de cellulose",
                selected: false,
                points: [
                    { icon: "fas fa-check", text: "Matériau recyclé (écologique)" },
                    { icon: "fas fa-check", text: "Bon déphasage thermique (confort été)" },
                    { icon: "fas fa-minus", text: "Sensible à l'humidité" },
                    { icon: "fas fa-minus", text: "Lambda : 0.039 W/m.K" },
                    { icon: "fas fa-minus", text: "Prix légèrement supérieur" },
                ]
            }
        }
    ],

    // ============================================
    // ÉNERGIE
    // ============================================
    energie: {
        economies: {
            "Consommation avant": "330 kWh/m²/an → 39 600 kWh/an",
            "Consommation après": "85 kWh/m²/an → 10 200 kWh/an",
            "Économie annuelle": "29 400 kWh/an (-74%)",
            "Facture avant (estimée)": "3 200 €/an",
            "Facture après (estimée)": "850 €/an",
            "Économie annuelle": "2 350 €/an",
            "Retour sur investissement": "≈ 12 ans (hors aides)",
        },
        valeur: {
            "Valeur estimée avant travaux": "185 000 €",
            "Valeur estimée après travaux": "280 000 € à 310 000 €",
            "Plus-value potentielle": "95 000 € à 125 000 €",
            "Coût total rénovation": "≈ 95 000 €",
            "Gain net estimé": "0 € à 30 000 €",
            "Effet classe DPE": "+15% à +25% de valeur",
        }
    },

    // ============================================
    // JOURNAL DE CHANTIER
    // ============================================
    journal: [
        {
            date: "2025-07-12",
            titre: "Avancée ITE façade sud terminée",
            tags: ["isolation", "gros-oeuvre"],
            contenu: "La pose de l'isolant PSE sur la façade sud est terminée. L'équipe de Façades Pro a bien travaillé malgré la chaleur. Le treillis d'armature est en place, l'enduit de base sera appliqué la semaine prochaine.",
            problemes: [
                "Découverte de fissures structurelles sur le pignon est nécessitant un traitement avant pose de l'isolant",
                "Retard de livraison des profilés de départ (1 semaine)"
            ],
            solutions: [
                "Traitement des fissures avec résine époxy + agrafage, coût supplémentaire : 800 €",
                "Réorganisation du planning pour commencer par la façade sud en attendant les profilés"
            ],
            lecons: [
                "Toujours prévoir un diagnostic structural complet avant ITE",
                "Commander les profilés avec 3 semaines d'avance minimum"
            ]
        },
        {
            date: "2025-06-28",
            titre: "Toiture terminée — réception des travaux",
            tags: ["toiture"],
            contenu: "La réfection de la toiture est terminée et réceptionnée. Les tuiles cassées ont été remplacées, les liteaux vétustes changés, et toute la zinguerie a été refaite. Le couvreur a également ajouté un écran sous-toiture HPV qui n'était pas prévu initialement.",
            problemes: [
                "Liteaux plus abîmés que prévu : 60% à remplacer au lieu de 30%"
            ],
            solutions: [
                "Remplacement complet des liteaux sur les versants nord et ouest, surcoût de 500 € absorbé par l'artisan (bonne relation)"
            ],
            lecons: [
                "Négocier un forfait 'au pire cas' pour la toiture permet d'éviter les mauvaises surprises"
            ]
        },
        {
            date: "2025-06-15",
            titre: "Isolation des combles terminée",
            tags: ["isolation"],
            contenu: "L'isolation des combles perdus est terminée. 120 m² de laine de roche en 300mm (R=7.5) ont été posés en deux couches croisées avec pare-vapeur. L'ancien isolant en laine de verre dégradée a été déposé et évacué.",
            problemes: [],
            solutions: [],
            lecons: [
                "La double couche croisée est indispensable pour supprimer les ponts thermiques aux jonctions",
                "Bien vérifier l'état du pare-vapeur existant avant de poser le nouveau"
            ]
        },
        {
            date: "2025-06-01",
            titre: "Lancement officiel du chantier",
            tags: ["general"],
            contenu: "Début officiel des travaux ! L'échafaudage a été monté sur les 4 façades. Le chantier est sécurisé, les bennes sont en place. Les travaux commencent par la toiture et l'isolation des combles en parallèle.",
            problemes: [
                "Accès difficile pour la grue sur le côté nord (passage étroit)"
            ],
            solutions: [
                "Utilisation d'un monte-matériaux plus compact, livraison des tuiles par petits lots"
            ],
            lecons: [
                "Vérifier systématiquement l'accessibilité du chantier avant le devis"
            ]
        },
        {
            date: "2025-05-15",
            titre: "Dossiers d'aides déposés",
            tags: ["administratif", "aides"],
            contenu: "Tous les dossiers de demande d'aides ont été déposés : MaPrimeRénov' (rénovation globale + PAC), CEE via Total Énergies et EDF, aide départementale. L'audit énergétique réalisé par le bureau d'études confirme le passage de F à B.",
            problemes: [
                "Le dossier CEE pour l'isolation des murs nécessite des photos avant/après spécifiques"
            ],
            solutions: [
                "Protocole photo mis en place : photos horodatées à chaque étape avec mètre visible"
            ],
            lecons: [
                "Constituer les dossiers d'aides AVANT le début des travaux est impératif (risque de refus sinon)"
            ]
        }
    ],

    // ============================================
    // DÉPENSES MENSUELLES (pour graphique évolution)
    // ============================================
    depensesMensuelles: [
        { mois: "Mai 2025", montant: 0, cumul: 0 },
        { mois: "Juin 2025", montant: 22300, cumul: 22300 },
        { mois: "Juil. 2025", montant: 12000, cumul: 34300 },
        { mois: "Août 2025", montant: 5700, cumul: 40000 },
        { mois: "Sept. 2025", montant: 8000, cumul: 48000 },
        { mois: "Oct. 2025", montant: 12000, cumul: 60000 },
        { mois: "Nov. 2025", montant: 10000, cumul: 70000 },
        { mois: "Déc. 2025", montant: 8000, cumul: 78000 },
        { mois: "Jan. 2026", montant: 10000, cumul: 88000 },
        { mois: "Fév. 2026", montant: 7000, cumul: 95000 },
    ]
};
