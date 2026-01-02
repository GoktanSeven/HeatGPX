<template>
  <div class="map-view">
    <TrackFilters />
    <MapViewer />
    <StatsPanel />
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
  position: relative;
}
</style>
