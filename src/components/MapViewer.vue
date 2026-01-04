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
const trackMarkers: L.CircleMarker[] = []
let highestPointMarker: L.Marker | null = null
let highestPointCoords: { lat: number; lon: number } | null = null

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

  // Initialiser la carte centrée sur Goussainville
  map = L.map(mapRef.value, {
    center: [49.034, 2.476],
    zoom: 12,
    zoomControl: false
  })

  // Utiliser CartoDB Voyager (bon équilibre lisibilité/couleurs)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map)

  // Écouter les changements de zoom pour afficher/cacher les marqueurs
  map.on('zoomend', updateMarkersVisibility)
}

function updateMarkersVisibility() {
  if (!map) return
  
  const zoom = map.getZoom()
  // Afficher les marqueurs seulement si le zoom est inférieur à 10
  if (zoom < 10) {
    trackMarkers.forEach(marker => marker.addTo(map!))
  } else {
    trackMarkers.forEach(marker => marker.remove())
  }
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
  
  // Supprimer les anciens marqueurs
  trackMarkers.forEach((marker) => marker.remove())
  trackMarkers.length = 0

  // Ajouter les nouvelles traces
  tracks.forEach((track) => {
    const points = track.points.map((p) => [p.lat, p.lon] as [number, number])
    console.log(`➕ Ajout de ${track.name} avec ${points.length} points`)

    const polyline = L.polyline(points, {
      color: '#FF6600',
      weight: 1.2,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(map!)

    // Ajouter un popup avec les infos de la trace
    const popupContent = `
      <div class="track-popup">
        <h3>${track.name}</h3>
        <p><strong>Type:</strong> ${track.type} - ${track.subType}</p>
        <p><strong>Date:</strong> ${track.year}/${String(track.month).padStart(2, '0')}</p>
        ${track.distance ? `<p><strong>Distance:</strong> ${(track.distance / 1000).toFixed(2)} km</p>` : ''}
        ${track.duration ? `<p><strong>Durée:</strong> ${formatDuration(track.duration)}</p>` : ''}
      </div>
    `
    
    polyline.bindPopup(popupContent)
    trackLayers.push(polyline)
    
    // Créer un marqueur circulaire au centre de la trace
    if (points.length > 0) {
      const centerIndex = Math.floor(points.length / 2)
      const centerPoint = points[centerIndex]
      
      const marker = L.circleMarker(centerPoint, {
        radius: 4,
        fillColor: '#FF6600',
        color: '#FF6600',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      }).addTo(map!)
      
      marker.bindPopup(popupContent)
      trackMarkers.push(marker)
    }
  })
  
  // Mettre à jour la visibilité des marqueurs selon le zoom actuel
  updateMarkersVisibility()
  
  // Trouver et afficher le point le plus haut
  updateHighestPoint(tracks)
}

function updateHighestPoint(tracks: GpxTrack[]) {
  if (!map) return
  
  // Supprimer l'ancien marqueur du point le plus haut
  if (highestPointMarker) {
    highestPointMarker.remove()
    highestPointMarker = null
  }
  
  // Trouver le point avec l'altitude maximale
  let highestPoint: { lat: number; lon: number; ele: number; trackName: string; date?: Date; time?: string } | null = null
  
  tracks.forEach((track) => {
    track.points.forEach((point) => {
      if (point.ele !== undefined) {
        if (!highestPoint || point.ele > highestPoint.ele) {
          highestPoint = {
            lat: point.lat,
            lon: point.lon,
            ele: point.ele,
            trackName: track.name,
            date: track.date || point.time,
            time: point.time
          }
        }
      }
    })
  })
  
  // Créer le marqueur si un point avec altitude a été trouvé
  if (highestPoint) {
    highestPointCoords = { lat: highestPoint.lat, lon: highestPoint.lon }
    
    const mountainIcon = L.divIcon({
      html: '<div style="font-size: 24px; text-shadow: 2px 2px 3px rgba(0,0,0,0.5);">🏔️</div>',
      className: 'mountain-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
    
    highestPointMarker = L.marker([highestPoint.lat, highestPoint.lon], {
      icon: mountainIcon,
      zIndexOffset: 1000
    }).addTo(map)
    
    let dateTimeStr = ''
    if (highestPoint.date) {
      const date = new Date(highestPoint.date)
      dateTimeStr = date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      if (timeStr !== '00:00') {
        dateTimeStr += ' à ' + timeStr
      }
    } else if (highestPoint.time) {
      const date = new Date(highestPoint.time)
      dateTimeStr = date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      if (timeStr !== '00:00') {
        dateTimeStr += ' à ' + timeStr
      }
    }
    
    highestPointMarker.bindPopup(`
      <div class="track-popup">
        <h3>🏔️ Point le plus haut</h3>
        <p><strong>Altitude:</strong> ${highestPoint.ele.toFixed(0)} m</p>
        <p><strong>Trace:</strong> ${highestPoint.trackName}</p>
        ${dateTimeStr ? `<p><strong>Date:</strong> ${dateTimeStr}</p>` : ''}
      </div>
    `)
  } else {
    highestPointCoords = null
  }
}

function flyToHighestPoint() {
  if (map && highestPointCoords) {
    map.flyTo([highestPointCoords.lat, highestPointCoords.lon], 14, {
      duration: 1.5
    })
    // Ouvrir le popup du point le plus haut
    if (highestPointMarker) {
      setTimeout(() => {
        highestPointMarker?.openPopup()
      }, 1500)
    }
  }
}

defineExpose({
  flyToHighestPoint
})

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
