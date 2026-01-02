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

const tracksStore = useTracksStore()

onMounted(() => {
  // Charger les traces au démarrage
  // TODO: implémenter le chargement depuis le dossier gpx-data
  console.log('Application démarrée')
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
