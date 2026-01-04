# HeatGPX 🗺️

Application web moderne pour visualiser vos traces GPX sous forme de heatmap, similaire à Strava.

## 🚀 Fonctionnalités

### Actuelles
- 📍 **Visualisation interactive** : Carte Leaflet avec tuiles CartoDB Voyager
- 🎨 **Interface moderne** : Barre supérieure avec titre, filtres et statistiques
- 🔍 **Filtrage intelligent** : Filtrez vos traces par type (Sport / Divers)
- 📊 **Statistiques en temps réel** : Nombre de traces, distance totale, altitude max
- 🏔️ **Point culminant** : Marqueur spécial sur le point le plus haut visité (cliquable depuis la barre de stats)
- 🎯 **Marqueurs intelligents** : Points circulaires orange visibles au zoom faible (<10), disparaissent au zoom proche
- 📈 **Barre de progression** : Affichage du chargement avec compteur de traces (X / Y traces)
- ⚡ **Performance** : Chargement rapide sans géocodage
- 🏷️ **Organisation des traces** :
  - **Sport** : randonnée, course à pied, vélo
  - **Divers** : voiture, moto, bateau
- 📁 **Structure automatique** : Dossiers par année/mois/type

### À venir 🔜
- 📤 Upload de fichiers GPX via l'interface
- 🗺️ Planification de traces
- 📈 Statistiques détaillées avancées
- 🎨 Personnalisation des couleurs par type d'activité

## 🏗️ Organisation des traces GPX

Les fichiers GPX sont organisés dans le dossier `gpx-data/` (non versionné) :

```
gpx-data/
├── 2025/
│   ├── 12/
│   │   ├── Sport/
│   │   │   ├── 2025-12-15 14_30_45.gpx
│   │   │   └── 2025-12-20 08_15_30.gpx
│   │   └── Divers/
│   │       └── 2025-12-30 16_02_56.gpx
```

### Convention de nommage

Les fichiers GPX sont automatiquement organisés par :
- **Année** : dossier `YYYY/`
- **Mois** : dossier `MM/`
- **Type** : dossiers `Sport/` ou `Divers/`

Format des fichiers : `YYYY-MM-DD HH_MM_SS.gpx`

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (Frontend + Backend)
npm run dev

# Ou lancer séparément :
# Frontend (port 3000)
npm run dev:client

# Backend (port 3001)
npm run dev:server

# Builder pour la production
npm run build
```

## 🚀 Démarrage

1. **Créer le dossier des traces GPX** :
   ```bash
   mkdir -p gpx-data
   ```

2. **Organiser vos fichiers GPX** :
   ```
   gpx-data/YYYY/MM/Sport/
   gpx-data/YYYY/MM/Divers/
   ```

3. **Lancer l'application** :
   ```bash
   npm run dev
   ```

4. **Ouvrir le navigateur** :
   - Frontend : http://localhost:3000
   - API Backend : http://localhost:3001

## 💻 Stack technique

- **Framework** : Vue 3.5.13 + TypeScript 5.7.2
- **Build** : Vite 6.0.5
- **État** : Pinia 2.2.8
- **Routing** : Vue Router 4.5.0
- **Carte** : Leaflet 1.9.4 avec tuiles CartoDB Voyager
- **Backend** : Express 4.21.2 + CORS
- **Parser GPX** : xml2js 0.6.2
- **Utilitaires** : concurrently (dev parallèle)
- **Linting** : ESLint

## 🎨 Design

L'application utilise un design moderne avec :
- **Barre supérieure** : Titre "HeatGPX" cliquable (orange #FF6600), filtres à gauche, stats à droite
- **Carte** : Centrée sur Goussainville [49.034, 2.476] au zoom 12
- **Tracés** : Orange (#FF6600), épaisseur 1.2, opacité 0.8
- **Marqueurs de zoom** : Points circulaires visibles uniquement au zoom < 10
- **Point culminant** : Emoji montagne 🏔️ avec info-bulle (altitude, trace, date/heure)
- **Thème** : Interface sombre avec fond `#1a1a1a`

## 📝 Fonctionnalités détaillées

### Visualisation de la carte
- Carte interactive Leaflet avec tuiles CartoDB Voyager
- Tracés GPX en orange (#FF6600) avec opacity 0.8
- Popup sur chaque tracé avec : nom, type, date, distance, durée
- Zoom et navigation fluides sans contrôles de zoom visibles

### Marqueurs intelligents
- **Points circulaires** : Affichés au centre de chaque trace
  - Visibles uniquement au zoom < 10 (vue globale)
  - Disparaissent automatiquement au zoom >= 10 (vue détaillée)
  - Évite l'encombrement visuel sur la carte zoomée
- **Point culminant 🏔️** : Marqueur spécial sur l'altitude maximale
  - Toujours visible à tous les niveaux de zoom
  - Cliquable depuis "Alt. max" dans la barre de stats
  - Animation flyTo avec ouverture automatique du popup
  - Affiche : altitude, nom de la trace, date complète et heure

### Filtres et statistiques
- **Filtres** : Sport / Divers avec indicateur de mise à jour (500ms)
- **Statistiques temps réel** :
  - Nombre total de traces
  - Traces Sport (couleur cyan)
  - Traces Divers (couleur jaune)
  - Distance totale cumulée
  - Altitude max cliquable (navigation vers le point)

### Chargement optimisé
- Barre de progression avec compteur "X / Y traces"
- Pas de géocodage (performances optimales)
- Backend Express qui scanne récursivement le dossier gpx-data/
- Parsing GPX avec calcul automatique de distance, durée, dénivelé

## 🔧 API Backend

Le serveur Express (port 3001) expose :

### `GET /api/tracks`
Retourne la liste de toutes les traces GPX avec leurs métadonnées :
```json
[
  {
    "id": "uuid",
    "name": "2025-12-30 16_02_56",
    "type": "divers",
    "subType": "voiture",
    "year": 2025,
    "month": 12,
    "points": [{ "lat": 49.034, "lon": 2.476, "ele": 85, "time": "..." }],
    "distance": 15420,
    "duration": 1800,
    "elevationGain": 120,
    "filePath": "gpx-data/2025/12/Divers/2025-12-30 16_02_56.gpx"
  }
]
```

### Détection automatique du type
- Dossier contenant "Sport" → type: "sport"
- Dossier contenant "Divers" → type: "divers"
- Sous-types détectés selon les mots-clés dans le nom du fichier

## 📄 Licence

Projet personnel - Tous droits réservés

---

Développé avec ❤️ et Vue.js
