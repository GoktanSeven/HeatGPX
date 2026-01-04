import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GpxTrack, TrackFilters, HeatmapStats } from '@/types/gpx.types'

export const useTracksStore = defineStore('tracks', () => {
  // State
  const tracks = ref<GpxTrack[]>([])
  const filters = ref<TrackFilters>({
    showSport: true,
    showDivers: true,
    sportTypes: ['rando', 'course', 'velo'],
    diversTypes: ['voiture', 'moto', 'bateau']
  })
  const isLoading = ref(false)
  const isFiltering = ref(false)
  const error = ref<string | null>(null)
  const loadingProgress = ref({ current: 0, total: 0 })

  // Getters
  const filteredTracks = computed(() => {
    return tracks.value.filter((track) => {
      // Filtrer par type d'activité
      if (track.type === 'sport' && !filters.value.showSport) return false
      if (track.type === 'divers' && !filters.value.showDivers) return false

      // Filtrer par période (si défini)
      if (filters.value.yearRange) {
        const [minYear, maxYear] = filters.value.yearRange
        if (track.year < minYear || track.year > maxYear) return false
      }

      if (filters.value.monthRange) {
        const [minMonth, maxMonth] = filters.value.monthRange
        if (track.month < minMonth || track.month > maxMonth) return false
      }

      return true
    })
  })

  const stats = computed<HeatmapStats>(() => {
    const filtered = filteredTracks.value
    const countries = new Set<string>()
    const cities = new Set<string>()
    
    filtered.forEach(track => {
      track.countries?.forEach(c => countries.add(c))
      track.cities?.forEach(c => cities.add(c))
    })
    
    // Calculer l'altitude maximale
    let maxElevation = 0
    filtered.forEach(track => {
      track.points.forEach(point => {
        if (point.ele && point.ele > maxElevation) {
          maxElevation = point.ele
        }
      })
    })
    
    return {
      totalDistance: filtered.reduce((sum, t) => sum + (t.distance || 0), 0),
      totalTracks: filtered.length,
      sportTracks: filtered.filter((t) => t.type === 'sport').length,
      diversTracks: filtered.filter((t) => t.type === 'divers').length,
      countries,
      cities,
      maxElevation: maxElevation > 0 ? maxElevation : undefined
    }
  })

  // Actions
  function addTrack(track: GpxTrack) {
    tracks.value.push(track)
  }

  function addTracks(newTracks: GpxTrack[]) {
    tracks.value.push(...newTracks)
  }

  function clearTracks() {
    tracks.value = []
  }

  function updateFilters(newFilters: Partial<TrackFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function toggleSport() {
    filters.value.showSport = !filters.value.showSport
  }

  function toggleDivers() {
    filters.value.showDivers = !filters.value.showDivers
  }

  return {
    // State
    tracks,
    filters,
    isLoading,
    isFiltering,
    error,
    loadingProgress,
    // Getters
    filteredTracks,
    stats,
    // Actions
    addTrack,
    addTracks,
    clearTracks,
    updateFilters,
    toggleSport,
    toggleDivers
  }
})
