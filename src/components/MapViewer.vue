<template>
  <div class="map-container">
    <div ref="mapRef" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTracksStore } from '@/stores/tracks.store'
import type { GpxTrack } from '@/types/gpx.types'

const mapRef = ref<HTMLElement>()
let map: L.Map | null = null
const trackLayers: L.Polyline[] = []

const tracksStore = useTracksStore()

// Couleurs pour les différents types d'activités
const colors = {
  sport: {
    rando: '#FF6B6B',
    course: '#4ECDC4',
    velo: '#45B7D1',
    autre: '#96CEB4'
  },
  divers: {
    voiture: '#FFEAA7',
    moto: '#DFE6E9',
    bateau: '#74B9FF',
    autre: '#A29BFE'
  }
}

onMounted(() => {
  initMap()
  // Afficher les traces déjà chargées si elles existent
  if (tracksStore.filteredTracks.length > 0) {
    updateTracks(tracksStore.filteredTracks)
  }
})

watch(
  () => tracksStore.filteredTracks,
  (tracks) => {
    console.log('🗺️ Mise à jour des traces sur la carte:', tracks.length)
    updateTracks(tracks)
  },
  { deep: true }
)

function initMap() {
  if (!mapRef.value) return

  // Initialiser la carte centrée sur la France
  map = L.map(mapRef.value, {
    center: [46.603354, 1.888334],
    zoom: 6,
    zoomControl: true
  })

  // Utiliser CartoDB Voyager (bon équilibre lisibilité/couleurs)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map)
}

function updateTracks(tracks: GpxTrack[]) {
  console.log('🎨 updateTracks appelée avec', tracks.length, 'trace(s)')
  if (!map) {
    console.error('❌ La carte n\'est pas initialisée')
    return
  }

  // Supprimer les anciennes traces
  trackLayers.forEach((layer) => layer.remove())
  trackLayers.length = 0

  // Ajouter les nouvelles traces
  tracks.forEach((track) => {
    const points = track.points.map((p) => [p.lat, p.lon] as [number, number])
    console.log(`➕ Ajout de ${track.name} avec ${points.length} points`)

    const polyline = L.polyline(points, {
      color: '#FF6600',
      weight: 2.5,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(map!)

    // Ajouter un popup avec les infos de la trace
    polyline.bindPopup(`
      <div class="track-popup">
        <h3>${track.name}</h3>
        <p><strong>Type:</strong> ${track.type} - ${track.subType}</p>
        <p><strong>Date:</strong> ${track.year}/${String(track.month).padStart(2, '0')}</p>
        ${track.distance ? `<p><strong>Distance:</strong> ${(track.distance / 1000).toFixed(2)} km</p>` : ''}
        ${track.duration ? `<p><strong>Durée:</strong> ${formatDuration(track.duration)}</p>` : ''}
      </div>
    `)

    trackLayers.push(polyline)
  })

  // Ajuster la vue pour afficher toutes les traces
  if (trackLayers.length > 0) {
    const group = L.featureGroup(trackLayers)
    map.fitBounds(group.getBounds(), { padding: [50, 50] })
  }
}

function getTrackColor(track: GpxTrack): string {
  if (track.type === 'sport') {
    return colors.sport[track.subType as keyof typeof colors.sport] || colors.sport.autre
  } else {
    return colors.divers[track.subType as keyof typeof colors.divers] || colors.divers.autre
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes}min`
}
</script>

<style scoped>
.map-container {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

:deep(.track-popup) {
  color: #333;
}

:deep(.track-popup h3) {
  margin: 0 0 10px 0;
  font-size: 16px;
}

:deep(.track-popup p) {
  margin: 5px 0;
  font-size: 14px;
}
</style>
