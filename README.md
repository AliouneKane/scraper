# Pulse.AI : Votre Boussole dans l'Océan de l'IA (SaaS)

**Pulse.AI** est votre plateforme de veille stratégique automatisée proposée sous forme de Dashboard interactif. Accessible directement via un navigateur, cette solution clé en main transforme la surveillance de l'écosystème IA en une expérience fluide, centralisant les meilleures sources d'information sans aucun effort manuel de votre part.

## 🎯 Objectif du Projet & Problématique Métier Réelle

Dans le secteur technologique en évolution rapide de l'Intelligence Artificielle, le défi n'est plus de trouver de l'information, mais de filtrer le bruit. Pulse.AI répond à la question suivante : **"Comment un professionnel peut-il rester à la pointe de l'innovation IA sans y consacrer des heures de recherche quotidiennes ?"**

Le projet résout trois problématiques critiques :

1.  **Fragmentation de l'Information** : Centraliser des sources dispersées (Substack, Beehiiv, Blogs) en un point d'accès unique.
2.  **Surcharge Cognitive** : Offrir une interface épurée et premium qui privilégie la lisibilité et l'accès rapide aux résumés ("Insights").
3.  **Obsolescence Rapide** : Mettre à jour les données en temps réel grâce à des pipelines de scraping automatisés pour ne manquer aucune avancée majeure.

---

## 💻 Stack des Langages de Programmation

*   **Python** : Utilisé pour le moteur de scraping, l'extraction de données et le nettoyage des flux (BeautifulSoup, Playwright, Requests).
*   **TypeScript / JavaScript** : Choisi pour développer une interface utilisateur moderne avec **Next.js**, garantissant une application web réactive et typée.
*   **Shell (Bash)** : Indispensable pour l'orchestration des tâches et l'automatisation du pipeline de synchronisation (`run_sync.sh`).

## 🛠 Stack Logicielle (Environnement & Outils)

*   **Framework Frontend** : **Next.js 15+** associé à **Tailwind CSS v4** et **Shadcn UI** pour créer un Dashboard professionnel, fluide et animé.
*   **Moteur de Scraping** : **Playwright** & **BeautifulSoup4** pour naviguer et extraire les données des plateformes modernes (Substack, Beehiiv).
*   **Design System** : Utilisation de composants premium (Glassmorphism, Marquee infini, Cartes interactives) inspirés par **21st.dev**.
*   **Gestion de Données** : Stockage léger en JSON pour une portabilité maximale et un déploiement instantané sans base de données lourde.
*   **Environnement de Travail** : **VS Code** comme éditeur principal et **Git/GitHub** pour la gestion du code source.

## 🧠 Notions & Concepts Clés

La réalisation de ce projet fait intervenir des concepts avancés en ingénierie web et automatisation :

1.  **Scraping Éthique & Robuste** : Extraction ciblée de métadonnées (titres, liens, dates) en respectant les structures HTML complexes des plateformes de newsletters.
2.  **Modern UI/UX** :
    *   **Glassmorphism** : Effets de transparence et de flou pour une esthétique moderne.
    *   **Micro-interactions** : Animations fluides au survol et chargements dynamiques.
    *   **Dark Mode** : Support natif thème clair/sombre via Tailwind.
3.  **Pipeline d'Intégration Continue** : Un script unique (`run_sync.sh`) orchestre l'environnement virtuel Python, l'exécution du scraper et le déploiement des données vers le frontend.
4.  **Architecture Component-Based** : Structure modulaire avec des composants réutilisables (Hero, Header, ArticleCard) pour une maintenabilité optimale.

## 📂 Architecture Dossier Complète

```text
scraper/ (Pulse.AI)
│
├── tools/                          # Moteur d'Extraction (Backend Logic)
│   ├── scraper.py                  # Script principal de scraping (BeautifulSoup)
│   ├── verify_link_playwright.py   # Validation des URLs via headless browser
│   └── inspect_source.py           # Utilitaire de débogage HTML
│
├── src/                            # Interface Utilisateur (Frontend Next.js)
│   ├── app/                        # Routing Next.js (App Router)
│   │   ├── page.tsx                # Dashboard principal (Hero + Grille)
│   │   ├── layout.tsx              # Structure globale et polices
│   │   └── globals.css             # Styles Tailwind & Animations
│   ├── components/                 # Composants visuels
│   │   ├── ui/                     # Bibliothèque UI (Boutons, Cards, Header)
│   │   │   ├── hero-1.tsx          # Section Hero avec effets premium
│   │   │   ├── article-card.tsx    # Carte d'affichage des news
│   │   │   └── header-1.tsx        # Navigation responsive
│   │   └── lib/                    # Utilitaires (cn, formatters)
│
├── public/                         # Ressources Statiques
│   └── articles.json               # Base de données JSON générée par le scraper
│
├── run_sync.sh                     # Pipeline d'automatisation (Sync Script)
├── requirements.txt                # Dépendances Python
├── package.json                    # Dépendances Node.js/Next.js
├── tailwind.config.ts              # Configuration du design system
└── README.md                       # Documentation du projet
```

---

## 🚀 Comment reproduire le travail

Pour déployer l'application et lancer votre propre veille, suivez les étapes ci-dessous :

### 1️⃣ Prérequis

*   **Node.js** (v18+) et **npm** installés.
*   **Python 3.9+** installé.

### 2️⃣ Installation des dépendances

Installez les librairies nécessaires pour le frontend et le backend :

```bash
# Frontend
npm install

# Backend (création venv recommandée)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install  # Si nécessaire pour le moteur web
```

### 3️⃣ Synchronisation des Données (Scraping)

Lancez le script d'automatisation pour récupérer les dernières actualités. Ce script va scraper les sources configurées et mettre à jour le fichier `public/articles.json`.

```bash
./run_sync.sh
```

### 4️⃣ Lancement du Dashboard

Démarrez le serveur de développement Next.js pour visualiser l'interface :

```bash
npm run dev
```

### 5️⃣ Accès au service

Une fois lancé, ouvrez votre navigateur :

| Service | Interface | URL |
| --- | --- | --- |
| 📊 **Dashboard Pulse.AI** | Interface Web | [http://localhost:3000](http://localhost:3000) |

---

## 🧑💻 À propos de l'auteur

<table style="border: none;">
<tr>
<td style="border: none;">
<strong>Alioune Abdou Salam Kane</strong>

<em>Élève Ingénieur Statisticien Économiste en 4e année</em>

Passionné par l'IA/ML Engineering, la Data Science et le développement de solutions SaaS innovantes pour répondre à des problématiques métier complexes.
</td>
</tr>
</table>

👉 **Retrouvez mes autres projets :** [github.com/AliouneKane](https://github.com/AliouneKane)

---
