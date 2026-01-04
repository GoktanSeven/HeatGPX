import type { GpxPoint } from '@/types/gpx.types'

/**
 * Utilitaires pour les calculs géographiques
 */

export function haversineDistance(p1: GpxPoint, p2: GpxPoint): number {
  const R = 6371000 // Rayon de la Terre en mètres
  const dLat = toRadians(p2.lat - p1.lat)
  const dLon = toRadians(p2.lon - p1.lon)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(p1.lat)) *
      Math.cos(toRadians(p2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Calcule le centre géographique d'un ensemble de points
 */
export function calculateCenter(points: GpxPoint[]): { lat: number; lon: number } {
  if (points.length === 0) return { lat: 0, lon: 0 }

  let x = 0
  let y = 0
  let z = 0

  for (const point of points) {
    const lat = toRadians(point.lat)
    const lon = toRadians(point.lon)

    x += Math.cos(lat) * Math.cos(lon)
    y += Math.cos(lat) * Math.sin(lon)
    z += Math.sin(lat)
  }

  x /= points.length
  y /= points.length
  z /= points.length

  const lon = Math.atan2(y, x)
  const hyp = Math.sqrt(x * x + y * y)
  const lat = Math.atan2(z, hyp)

  return {
    lat: toDegrees(lat),
    lon: toDegrees(lon)
  }
}

/**
 * Calcule les limites géographiques d'un ensemble de points
 */
export function calculateBounds(points: GpxPoint[]): {
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
} {
  if (points.length === 0) {
    return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 }
  }

  let minLat = points[0].lat
  let maxLat = points[0].lat
  let minLon = points[0].lon
  let maxLon = points[0].lon

  for (const point of points) {
    minLat = Math.min(minLat, point.lat)
    maxLat = Math.max(maxLat, point.lat)
    minLon = Math.min(minLon, point.lon)
    maxLon = Math.max(maxLon, point.lon)
  }

  return { minLat, maxLat, minLon, maxLon }
}

/**
 * Formate une distance en texte lisible
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(2)} km`
}

/**
 * Formate une durée en texte lisible
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes}min`
}

/**
 * Formate une vitesse en texte lisible
 */
export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`
}
