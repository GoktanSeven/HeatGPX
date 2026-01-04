<template>
  <div class="stats-panel">
    <div class="stats-content">
      <div class="stat-item">
        <span class="stat-label">Traces</span>
        <span class="stat-value">{{ stats.totalTracks }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Sport</span>
        <span class="stat-value sport">{{ stats.sportTracks }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Divers</span>
        <span class="stat-value divers">{{ stats.diversTracks }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Distance</span>
        <span class="stat-value">{{ formatDistance(stats.totalDistance) }}</span>
      </div>

      <div class="stat-item clickable" v-if="stats.maxElevation" @click="emitFlyToHighest">
        <span class="stat-label">Alt. max</span>
        <span class="stat-value">🏔️ {{ Math.round(stats.maxElevation) }} m</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracksStore } from '@/stores/tracks.store'

const emit = defineEmits<{
  flyToHighest: []
}>()

const tracksStore = useTracksStore()

const stats = computed(() => tracksStore.stats)

function emitFlyToHighest() {
  emit('flyToHighest')
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(2)} km`
}
</script>

<style scoped>
.stats-panel {
  display: flex;
  align-items: center;
}

.stats-content {
  display: flex;
  gap: 20px;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.stat-value.sport {
  color: #4ecdc4;
}

.stat-value.divers {
  color: #ffeaa7;
}

.stat-item.clickable {
  cursor: pointer;
  transition: background 0.2s;
  padding: 6px 10px;
  border-radius: 6px;
}

.stat-item.clickable:hover {
  background: rgba(255, 102, 0, 0.15);
}
</style>
