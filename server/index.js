import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const GPX_DATA_DIR = path.join(__dirname, '../gpx-data')

/**
 * Scanne récursivement le dossier gpx-data et retourne tous les fichiers GPX
 */
function scanGpxFiles(dir, baseDir = dir) {
  const files = []

  try {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // Récursion dans les sous-dossiers
        files.push(...scanGpxFiles(fullPath, baseDir))
      } else if (item.toLowerCase().endsWith('.gpx')) {
        // Extraire les infos du chemin: année/mois/type
        const relativePath = path.relative(baseDir, fullPath)
        const parts = relativePath.split(path.sep)

        // Format attendu: YYYY/MM/type/filename.gpx
        const year = parts[0]
        const month = parts[1]
        const type = parts[2] // 'sport' ou 'divers'
        const filename = parts[3]

        // Extraire le sous-type du nom du fichier
        // Format: YYYY-MM-DD_subType_nom.gpx
        const filenameParts = filename.split('_')
        const subType = filenameParts[1] || 'autre'

        files.push({
          path: relativePath,
          fullPath,
          year: parseInt(year) || new Date().getFullYear(),
          month: parseInt(month) || 1,
          type: type === 'sport' ? 'sport' : 'divers',
          subType,
          filename
        })
      }
    }
  } catch (error) {
    console.error(`Erreur lors du scan de ${dir}:`, error.message)
  }

  return files
}

/**
 * GET /api/tracks
 * Retourne la liste de tous les fichiers GPX avec leurs métadonnées
 */
app.get('/api/tracks', (req, res) => {
  try {
    const files = scanGpxFiles(GPX_DATA_DIR)
    res.json({ success: true, tracks: files, count: files.length })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * GET /api/tracks/:year/:month/:type/:filename
 * Retourne le contenu d'un fichier GPX spécifique
 */
app.get('/api/tracks/:year/:month/:type/:filename', (req, res) => {
  try {
    const { year, month, type, filename } = req.params
    const filePath = path.join(GPX_DATA_DIR, year, month, type, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Fichier non trouvé' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    res.json({ success: true, content, path: `${year}/${month}/${type}/${filename}` })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * POST /api/tracks/upload
 * Upload un nouveau fichier GPX (future évolution)
 */
app.post('/api/tracks/upload', (req, res) => {
  // TODO: Implémenter l'upload
  res.status(501).json({ success: false, error: 'Upload non encore implémenté' })
})

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend HeatGPX démarré sur http://localhost:${PORT}`)
  console.log(`📂 Dossier GPX: ${GPX_DATA_DIR}`)
  console.log(`📊 API disponible sur http://localhost:${PORT}/api/tracks`)
})
