import type { GpxTrack, GpxPoint, ActivityType, SportType, DiversType } from '@/types/gpx.types'

// Ce service gère le parsing et le chargement des fichiers GPX
// Pour le moment, il fournit l'interface. L'implémentation réelle
// nécessitera un backend ou une API pour lire les fichiers du dossier gpx-data/

export class GpxService {
  /**
   * Parse un fichier GPX et retourne un objet GpxTrack
   */
  static async parseGpxFile(
    fileContent: string,
    filePath: string,
    type: ActivityType,
    subType: SportType | DiversType
  ): Promise<GpxTrack> {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(fileContent, 'text/xml')

    // Extraire les informations de base
    const name = this.getElementText(xmlDoc, 'name') || 'Sans nom'
    const timeStr = this.getElementText(xmlDoc, 'time')
    const date = timeStr ? new Date(timeStr) : undefined

    // Extraire tous les points de trace
    const points = this.extractPoints(xmlDoc)

    // Calculer les statistiques
    const distance = this.calculateDistance(points)
    const elevationGain = this.calculateElevationGain(points)
    const duration = this.calculateDuration(points)
    const avgSpeed = duration > 0 ? (distance / 1000 / (duration / 3600)) : 0

    // Extraire année et mois du chemin du fichier
    const pathParts = filePath.split('/')
    const year = parseInt(pathParts.find((p) => /^\d{4}$/.test(p)) || new Date().getFullYear().toString())
    const month = parseInt(pathParts.find((p) => /^(0?[1-9]|1[0-2])$/.test(p)) || '1')

    return {
      id: this.generateId(filePath),
      name,
      type,
      subType,
      year,
      month,
      points,
      distance,
      duration,
      elevationGain,
      avgSpeed,
      date,
      filePath
    }
  }

  /**
   * Charge tous les fichiers GPX depuis le dossier gpx-data/
   */
  static async loadAllTracks(): Promise<GpxTrack[]> {
    try {
      const API_URL = 'http://localhost:3001/api/tracks'
      
      // Récupérer la liste des fichiers GPX
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fichiers GPX')
      }

      const data = await response.json()
      const tracks: GpxTrack[] = []

      // Charger le contenu de chaque fichier
      for (const fileInfo of data.tracks) {
        try {
          const fileResponse = await fetch(
            `http://localhost:3001/api/tracks/${fileInfo.year}/${String(fileInfo.month).padStart(2, '0')}/${fileInfo.type}/${fileInfo.filename}`
          )
          
          if (fileResponse.ok) {
            const fileData = await fileResponse.json()
            const track = await this.parseGpxFile(
              fileData.content,
              fileInfo.path,
              fileInfo.type,
              fileInfo.subType
            )
            tracks.push(track)
          }
        } catch (error) {
          console.error(`Erreur lors du chargement de ${fileInfo.filename}:`, error)
        }
      }

      return tracks
    } catch (error) {
      console.error('Erreur loadAllTracks:', error)
      return []
    }
  }

  /**
   * Charge les traces d'une année/mois spécifique
   */
  static async loadTracksByPeriod(
    year: number,
    month: number,
    type?: ActivityType
  ): Promise<GpxTrack[]> {
    // TODO: Implémenter
    console.warn('loadTracksByPeriod: Backend non implémenté')
    return []
  }

  // ============= Méthodes privées =============

  private static getElementText(doc: Document, tagName: string): string | null {
    const element = doc.getElementsByTagName(tagName)[0]
    return element?.textContent || null
  }

  private static extractPoints(doc: Document): GpxPoint[] {
    const points: GpxPoint[] = []
    const trkpts = doc.getElementsByTagName('trkpt')

    for (let i = 0; i < trkpts.length; i++) {
      const trkpt = trkpts[i]
      const lat = parseFloat(trkpt.getAttribute('lat') || '0')
      const lon = parseFloat(trkpt.getAttribute('lon') || '0')

      const eleElement = trkpt.getElementsByTagName('ele')[0]
      const ele = eleElement ? parseFloat(eleElement.textContent || '0') : undefined

      const timeElement = trkpt.getElementsByTagName('time')[0]
      const time = timeElement ? new Date(timeElement.textContent || '') : undefined

      points.push({ lat, lon, ele, time })
    }

    return points
  }

  private static calculateDistance(points: GpxPoint[]): number {
    let distance = 0
    for (let i = 1; i < points.length; i++) {
      distance += this.haversineDistance(points[i - 1], points[i])
    }
    return distance
  }

  private static haversineDistance(p1: GpxPoint, p2: GpxPoint): number {
    const R = 6371000 // Rayon de la Terre en mètres
    const dLat = this.toRadians(p2.lat - p1.lat)
    const dLon = this.toRadians(p2.lon - p1.lon)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(p1.lat)) *
        Math.cos(this.toRadians(p2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private static calculateElevationGain(points: GpxPoint[]): number {
    let gain = 0
    for (let i = 1; i < points.length; i++) {
      const diff = (points[i].ele || 0) - (points[i - 1].ele || 0)
      if (diff > 0) gain += diff
    }
    return gain
  }

  private static calculateDuration(points: GpxPoint[]): number {
    if (points.length < 2) return 0
    const firstTime = points[0].time
    const lastTime = points[points.length - 1].time
    if (!firstTime || !lastTime) return 0
    return (lastTime.getTime() - firstTime.getTime()) / 1000 // en secondes
  }

  private static generateId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, '_')
  }
}
