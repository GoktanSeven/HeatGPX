<template>
  <div class="track-filters">
    <div class="filters-header">
      <h2>Filtres</h2>
      <button @click="toggleFilters" class="toggle-btn">
        {{ showFilters ? '▼' : '▲' }}
      </button>
    </div>

    <div v-if="showFilters" class="filters-content">
      <!-- Filtres principaux -->
      <div class="filter-section">
        <h3>Type d'activité</h3>
        <div class="filter-group">
          <label class="filter-checkbox">
            <input type="checkbox" v-model="filters.showSport" @change="updateFilters" />
            <span>Sport</span>
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" v-model="filters.showDivers" @change="updateFilters" />
            <span>Divers</span>
          </label>
        </div>
      </div>

      <!-- Bouton réinitialiser -->
      <button @click="resetFilters" class="reset-btn">Réinitialiser</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useTracksStore } from '@/stores/tracks.store'
import type { SportType, DiversType } from '@/types/gpx.types'

const tracksStore = useTracksStore()
const showFilters = ref(true)

const sportTypes: SportType[] = ['rando', 'course', 'velo', 'autre']
const diversTypes: DiversType[] = ['voiture', 'moto', 'bateau', 'autre']

const filters = reactive({
  showSport: tracksStore.filters.showSport,
  showDivers: tracksStore.filters.showDivers,
  sportTypes: [...tracksStore.filters.sportTypes],
  diversTypes: [...tracksStore.filters.diversTypes]
})

function toggleFilters() {
  showFilters.value = !showFilters.value
}

function updateFilters() {
  tracksStore.updateFilters(filters)
}

function resetFilters() {
  filters.showSport = true
  filters.showDivers = true
  filters.sportTypes = [...sportTypes]
  filters.diversTypes = [...diversTypes]
  updateFilters()
}

function formatType(type: string): string {
  const labels: Record<string, string> = {
    rando: 'Randonnée',
    course: 'Course à pied',
    velo: 'Vélo',
    voiture: 'Voiture',
    moto: 'Moto',
    bateau: 'Bateau',
    autre: 'Autre'
  }
  return labels[type] || type
}
</script>

<style scoped>
.track-filters {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.filters-header h2 {
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

.filters-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-section h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-weight: 600;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--color-text);
  font-size: 14px;
}

.filter-checkbox input[type='checkbox'] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.sport-label[data-type='rando']::before {
  content: '🥾 ';
}

.sport-label[data-type='course']::before {
  content: '🏃 ';
}

.sport-label[data-type='velo']::before {
  content: '🚴 ';
}

.divers-label[data-type='voiture']::before {
  content: '🚗 ';
}

.divers-label[data-type='moto']::before {
  content: '🏍️ ';
}

.divers-label[data-type='bateau']::before {
  content: '⛵ ';
}

.reset-btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.reset-btn:hover {
  opacity: 0.8;
}

/* Scrollbar styling */
.track-filters::-webkit-scrollbar {
  width: 6px;
}

.track-filters::-webkit-scrollbar-track {
  background: var(--color-background);
  border-radius: 3px;
}

.track-filters::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
</style>
