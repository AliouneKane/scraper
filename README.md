# Pulse.AI : Votre Boussole dans l'Océan de l'IA (SaaS)

**Pulse.AI** est votre plateforme de veille stratégique automatisée proposée sous forme de Dashboard interactif. Accessible directement via un navigateur, cette solution clé en main transforme la surveillance de l'écosystème IA en une expérience fluide, centralisant les meilleures sources d'information sans aucun effort manuel de votre part.

## 🎯 Objectif du Projet & Problématique Métier Réelle

Dans le secteur technologique en évolution rapide de l'Intelligence Artificielle, le défi n'est plus de trouver de l'information, mais de filtrer le bruit. Pulse.AI répond à la question suivante : **"Comment un professionnel peut-il rester à la pointe de l'innovation IA sans y consacrer des heures de recherche quotidiennes ?"**

Le projet résout trois problématiques critiques :

1. **Fragmentation de l'Information** : Centraliser des sources dispersées (Substack, Beehiiv, Blogs) en un point d'accès unique.
2. **Surcharge Cognitive** : Offrir une interface épurée et premium qui privilégie la lisibilité et l'accès rapide aux résumés ("Insights").
3. **Obsolescence Rapide** : Mettre à jour les données en temps réel grâce à des pipelines de scraping automatisés pour ne manquer aucune avancée majeure.

---

## 💻 Stack des Langages de Programmation

* **Python** : Utilisé pour le moteur de scraping, l'extraction de données et le nettoyage des flux (BeautifulSoup, Playwright, Requests).
* **TypeScript / JavaScript** : Choisi pour développer une interface utilisateur moderne avec **Next.js**, garantissant une application web réactive et typée.
* **YAML** : Utilisé pour la configuration de l'automatisation via **GitHub Actions**.

## 🛠 Stack Logicielle (Environnement & Outils)

* **Framework Frontend** : **Next.js 15+** associé à **Tailwind CSS v4** et **Shadcn UI** pour créer un Dashboard professionnel, fluide et animé.
* **Moteur de Scraping** : **Playwright** & **BeautifulSoup4** pour naviguer et extraire les données des plateformes modernes (Substack, Beehiiv).
* **Automatisation (CI/CD)** : **GitHub Actions** configuré pour un déclenchement quotidien (Cron job) à 07:00 UTC.
* **Design System** : Utilisation de composants premium (Glassmorphism, Marquee infini, Cartes interactives) inspirés par **21st.dev**.
* **Gestion de Données** : Stockage léger en JSON pour une portabilité maximale et un déploiement instantané.

## 🧠 Notions & Concepts Clés

La réalisation de ce projet fait intervenir des concepts avancés en ingénierie web et automatisation :

1. **Scraping Éthique & Robuste** : Extraction ciblée de métadonnées en respectant les structures HTML complexes.
2. **Veille Automatisée (Cron Job)** : Déploiement d'un workflow GitHub Actions qui remplace les services payants comme Modal pour une exécution 100% gratuite.
3. **Modern UI/UX** :
    * **Glassmorphism** : Effets de transparence et de flou.
    * **Micro-interactions** : Animations fluides au survol.
4. **Pipeline d'Intégration Continue** : Synchronisation automatique des données récupérées vers le dossier `public/` pour un rafraîchissement immédiat du site.

## 📂 Architecture Dossier Complète

```text
scraper/ (Pulse.AI)
│
├── .github/workflows/              # Automatisation Cloud
│   └── daily_sync.yml              # Workflow GitHub Actions (Sync à 07h00)
│
├── tools/                          # Moteur d'Extraction (Backend Logic)
│   ├── scraper.py                  # Script principal de scraping (BeautifulSoup)
│   └── ...
│
├── src/                            # Interface Utilisateur (Frontend Next.js)
│   ├── app/                        # Routing & Styles
│   ├── components/                 # Composants visuels premium
│   └── ...
│
├── public/                         # Ressources Statiques
│   └── articles.json               # Flux d'actualités (Mis à jour par l'IA)
│
├── run_sync.sh                     # Script de synchronisation locale
├── requirements.txt                # Dépendances Python (Playwright, BS4)
├── package.json                    # Dépendances Node.js
└── README.md                       # Vision SaaS et Documentation
```

---

## 🚀 Comment reproduire le travail

### 1️⃣ Prérequis

* **Node.js** (v18+) et **Python 3.9+**.
* Un compte **GitHub** pour l'automatisation.

### 2️⃣ Installation & Test Local

```bash
# Installation Frontend
npm install

# Installation Backend
pip install -r requirements.txt
playwright install chromium

# Lancement manuel du sync
./run_sync.sh

# Lancement du Dashboard
npm run dev
```

### 3️⃣ Mise en place de l'Automatisation (GitHub Actions)

Le projet est déjà configuré pour tourner chaque matin à **07:00 UTC**. Pour que cela fonctionne sur votre propre fork/repo :

1. Assurez-vous que les **"Actions"** sont activées dans les paramètres de votre repo.
2. Le workflow `daily_sync.yml` s'occupera d'installer Playwright, de scraper les news et de push le fichier `articles.json` automatiquement.

---

## 🧑💻 À propos de l'auteur

<table style="border: none;">
<tr>
<td style="border: none;">
<strong>Alioune Abdou Salam Kane</strong>

<em>Élève Ingénieur Statisticien Économiste en 4e année</em>

Passionné par l'IA/ML Engineering, la Data Science et le développement de solutions SaaS innovantes.
</td>
</tr>
</table>

👉 **Retrouvez mes autres projets :** [github.com/AliouneKane](https://github.com/AliouneKane)

---
