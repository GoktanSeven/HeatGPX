// Types pour les traces GPX
export type ActivityType = 'sport' | 'divers'

export type SportType = 'rando' | 'course' | 'velo' | 'autre'
export type DiversType = 'voiture' | 'moto' | 'bateau' | 'autre'

export interface GpxPoint {
  lat: number
  lon: number
  ele?: number
  time?: Date
}

export interface GpxTrack {
  id: string
  name: string
  type: ActivityType
  subType: SportType | DiversType
  year: number
  month: number
  points: GpxPoint[]
  distance?: number // en mètres
  duration?: number // en secondes
  elevationGain?: number // en mètres
  avgSpeed?: number // en km/h
  date?: Date
  filePath: string
}

export interface TrackFilters {
  showSport: boolean
  showDivers: boolean
  sportTypes: SportType[]
  diversTypes: DiversType[]
  yearRange?: [number, number]
  monthRange?: [number, number]
}

export interface HeatmapStats {
  totalDistance: number
  totalTracks: number
  sportTracks: number
  diversTracks: number
  countries?: Set<string>
  cities?: Set<string>
  maxElevation?: number
}
