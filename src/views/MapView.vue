<template>
  <div class="map-view">
    <div class="top-bar">
      <div class="left-section">
        <h1 class="app-title" @click="reloadApp">HeatGPX</h1>
        <TrackFilters />
      </div>
      <StatsPanel @fly-to-highest="handleFlyToHighest" />
      
      <!-- Indicateur de filtrage -->
      <div v-if="tracksStore.isFiltering" class="filtering-indicator">
        <div class="mini-spinner"></div>
        <span>Mise à jour...</span>
      </div>
    </div>
    <MapViewer ref="mapViewerRef" />
    
    <!-- Overlay de chargement -->
    <div v-if="tracksStore.isLoading" class="loading-overlay">
      <div class="loading-content">
        <p class="loading-text">Chargement des traces GPX...</p>
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <p class="progress-text">
            {{ tracksStore.loadingProgress.current }} / {{ tracksStore.loadingProgress.total }} traces
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import MapViewer from '@/components/MapViewer.vue'
import TrackFilters from '@/components/TrackFilters.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import { useTracksStore } from '@/stores/tracks.store'
import { GpxService } from '@/services/gpx.service'

const tracksStore = useTracksStore()
const mapViewerRef = ref<InstanceType<typeof MapViewer>>()

const progressPercentage = computed(() => {
  const { current, total } = tracksStore.loadingProgress
  return total > 0 ? (current / total) * 100 : 0
})

onMounted(async () => {
  // Charger les traces au démarrage
  tracksStore.isLoading = true
  try {
    console.log('🔍 Chargement des traces GPX...')
    const tracks = await GpxService.loadAllTracks((current, total) => {
      tracksStore.loadingProgress = { current, total }
    })
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

function reloadApp() {
  window.location.reload()
}

function handleFlyToHighest() {
  mapViewerRef.value?.flyToHighestPoint()
}
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

.left-section {
  display: flex;
  align-items: center;
  gap: 30px;
}

.app-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #FF6600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.app-title:hover {
  opacity: 0.8;
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

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-text {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 300px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #FF6600;
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
