<template>
  <div class="map-view">
    <div class="top-bar">
      <TrackFilters />
      <StatsPanel />
      
      <!-- Indicateur de filtrage -->
      <div v-if="tracksStore.isFiltering" class="filtering-indicator">
        <div class="mini-spinner"></div>
        <span>Mise à jour...</span>
      </div>
    </div>
    <MapViewer />
    
    <!-- Overlay de chargement -->
    <div v-if="tracksStore.isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">Chargement des traces GPX...</p>
      <p class="loading-subtext">Analyse des itinéraires et géolocalisation</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import MapViewer from '@/components/MapViewer.vue'
import TrackFilters from '@/components/TrackFilters.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import { useTracksStore } from '@/stores/tracks.store'
import { GpxService } from '@/services/gpx.service'

const tracksStore = useTracksStore()

onMounted(async () => {
  // Charger les traces au démarrage
  tracksStore.isLoading = true
  try {
    console.log('🔍 Chargement des traces GPX...')
    const tracks = await GpxService.loadAllTracks()
    console.log(`✅ ${tracks.length} trace(s) chargée(s)`, tracks)
    if (tracks.length > 0) {
      console.log('📍 Première trace:', {
        name: tracks[0].name,
        points: tracks[0].points.length,
        firstPoint: tracks[0].points[0]
      })
    }
    tracksStore.addTracks(tracks)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des traces:', error)
    tracksStore.error = 'Impossible de charger les traces. Assurez-vous que le serveur backend est démarré.'
  } finally {
    tracksStore.isLoading = false
  }
})
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  gap: 20px;
  position: relative;
}

.filtering-indicator {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 102, 0, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  color: #FF6600;
  font-size: 13px;
  font-weight: 500;
}

.mini-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 102, 0, 0.3);
  border-top: 2px solid #FF6600;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(26, 26, 26, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 102, 0, 0.2);
  border-top: 5px solid #FF6600;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 8px;
}

.loading-subtext {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
