<template>
  <div class="stats-panel">
    <div class="stats-header">
      <h2>📊 Statistiques</h2>
      <button @click="togglePanel" class="toggle-btn">
        {{ showPanel ? '▼' : '▲' }}
      </button>
    </div>

    <div v-if="showPanel" class="stats-content">
      <div class="stat-item">
        <span class="stat-label">Traces totales</span>
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
        <span class="stat-label">Distance totale</span>
        <span class="stat-value">{{ formatDistance(stats.totalDistance) }}</span>
      </div>

      <!-- Futures évolutions -->
      <div class="stat-item future">
        <span class="stat-label">Pays visités</span>
        <span class="stat-value">🔜</span>
      </div>

      <div class="stat-item future">
        <span class="stat-label">Villes visitées</span>
        <span class="stat-value">🔜</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracksStore } from '@/stores/tracks.store'

const tracksStore = useTracksStore()
const showPanel = ref(true)

const stats = computed(() => tracksStore.stats)

function togglePanel() {
  showPanel.value = !showPanel.value
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
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 250px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stats-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
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

.stat-item.future {
  opacity: 0.5;
}

.stat-item.future .stat-label::after {
  content: ' (à venir)';
  font-size: 11px;
  font-style: italic;
}
</style>
