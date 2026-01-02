# HeatGPX 🗺️

Application web moderne pour visualiser vos traces GPX sous forme de heatmap, similaire à Strava.

## 🚀 Fonctionnalités

### Actuelles
- 📍 Visualisation de traces GPX sur une carte interactive (Leaflet)
- 🎨 Interface sombre et moderne
- 🔍 Filtrage des traces par type (Sport / Divers)
- 📊 Statistiques en temps réel
- 🏷️ Organisation des traces :
  - **Sport** : randonnée, course à pied, vélo
  - **Divers** : voiture, moto, bateau
- 📁 Structure de dossiers par année/mois

### À venir 🔜
- 📤 Upload de fichiers GPX via l'interface
- 🗺️ Planification de traces
- 🌍 Compteur de pays visités
- 🏙️ Compteur de villes visitées
- 📈 Statistiques détaillées avancées

## 📁 Architecture du projet

```
HeatGPX/
├── src/
│   ├── components/        # Composants Vue réutilisables
│   │   ├── MapViewer.vue     # Carte interactive avec Leaflet
│   │   ├── TrackFilters.vue  # Panneau de filtres
│   │   └── StatsPanel.vue    # Panneau de statistiques
│   ├── views/             # Pages principales
│   │   ├── MapView.vue       # Page principale avec la carte
│   │   ├── StatsView.vue     # Page statistiques (à venir)
│   │   └── UploadView.vue    # Page upload (à venir)
│   ├── stores/            # État global (Pinia)
│   │   └── tracks.store.ts   # Gestion des traces et filtres
│   ├── services/          # Logique métier
│   │   └── gpx.service.ts    # Parsing et traitement des GPX
│   ├── types/             # Types TypeScript
│   │   └── gpx.types.ts      # Interfaces pour les traces
│   ├── utils/             # Utilitaires
│   │   └── geo.utils.ts      # Calculs géographiques
│   ├── router/            # Configuration Vue Router
│   ├── assets/            # CSS et ressources statiques
│   ├── App.vue            # Composant racine
│   └── main.ts            # Point d'entrée
├── gpx-data/              # Dossier des traces GPX (non commité)
│   ├── YYYY/              # Année
│   │   ├── MM/            # Mois
│   │   │   ├── sport/     # Traces sportives
│   │   │   └── divers/    # Traces diverses
│   └── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🏗️ Organisation des traces GPX

Les fichiers GPX sont organisés dans le dossier `gpx-data/` (non versionné) :

```
gpx-data/
├── 2026/
│   ├── 01/
│   │   ├── sport/
│   │   │   ├── 2026-01-15_rando_mont-blanc.gpx
│   │   │   └── 2026-01-20_velo_col-du-tourmalet.gpx
│   │   └── divers/
│   │       └── 2026-01-10_voiture_paris-lyon.gpx
```

### Convention de nommage

**Sport :**
- `YYYY-MM-DD_rando_nom-du-lieu.gpx`
- `YYYY-MM-DD_course_nom-du-parcours.gpx`
- `YYYY-MM-DD_velo_nom-de-la-sortie.gpx`

**Divers :**
- `YYYY-MM-DD_voiture_trajet-description.gpx`
- `YYYY-MM-DD_moto_balade-lieu.gpx`
- `YYYY-MM-DD_bateau_navigation-zone.gpx`

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Preview du build de production
npm run preview
```

## 💻 Stack technique

- **Framework** : Vue 3 + TypeScript
- **Build** : Vite
- **État** : Pinia
- **Routing** : Vue Router
- **Carte** : Leaflet
- **Linting** : ESLint + Prettier

## 🎨 Thème

L'application utilise un thème sombre inspiré de Strava avec une palette de couleurs moderne :
- Fond : `#1a1a1a`
- Surface : `#2a2a2a`
- Primaire : `#42b883` (vert Vue)
- Secondaire : `#35495e`

## 📝 Notes de développement

### Backend à implémenter

Pour le moment, le service GPX ne peut pas lire directement les fichiers du dossier `gpx-data/`. Pour une implémentation complète, vous aurez besoin de :

1. **Option 1 : Backend simple**
   - API Node.js/Express pour lister et lire les fichiers GPX
   - Endpoint : `GET /api/tracks` retourne tous les fichiers
   - Endpoint : `POST /api/tracks/upload` pour uploader

2. **Option 2 : Upload manuel**
   - Permettre l'upload via l'interface
   - Stocker les traces en mémoire ou localStorage

3. **Option 3 : Electron**
   - Packager l'app avec Electron pour accès filesystem direct

### Futures évolutions prévues

- [ ] Backend pour lecture des fichiers GPX
- [ ] Upload de fichiers via l'interface
- [ ] Géocodage inversé pour compter les pays/villes
- [ ] Heatmap avec intensité (zones les plus visitées)
- [ ] Export des statistiques
- [ ] Mode 3D de la carte
- [ ] Comparaison de traces
- [ ] Planificateur d'itinéraires

## 📄 Licence

Projet personnel - Tous droits réservés

---

Développé avec ❤️ et Vue.js
