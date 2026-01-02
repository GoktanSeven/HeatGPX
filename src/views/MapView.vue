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
    const tracks = await GpxService.loadAllTracks()
    tracksStore.addTracks(tracks)
    console.log(`✅ ${tracks.length} trace(s) chargée(s)`)
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
