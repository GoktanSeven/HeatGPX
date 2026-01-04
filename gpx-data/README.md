# Structure des dossiers GPX

Ce dossier contient tous vos fichiers GPX organisés par année, mois et type d'activité.

## Organisation

```
gpx-data/
├── YYYY/           # Année (ex: 2024, 2025, 2026)
│   ├── MM/         # Mois (01-12)
│   │   ├── sport/  # Activités sportives (rando, course, vélo, etc.)
│   │   └── divers/ # Activités diverses (voiture, moto, bateau, etc.)
```

## Convention de nommage des fichiers

Pour faciliter l'identification, nommez vos fichiers GPX comme suit :

**Pour les activités sportives :**
- `YYYY-MM-DD_rando_nom-du-lieu.gpx`
- `YYYY-MM-DD_course_nom-du-parcours.gpx`
- `YYYY-MM-DD_velo_nom-de-la-sortie.gpx`

**Pour les activités diverses :**
- `YYYY-MM-DD_voiture_trajet-description.gpx`
- `YYYY-MM-DD_moto_balade-lieu.gpx`
- `YYYY-MM-DD_bateau_navigation-zone.gpx`

## Exemples

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

## Notes

- Ce dossier est exclu du versioning Git (.gitignore)
- Les fichiers GPX doivent être au format standard GPX 1.0 ou 1.1
- L'application scanne automatiquement ce dossier au démarrage
