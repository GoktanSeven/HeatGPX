<template>
  <div class="track-filters">
    <div class="filters-content">
      <h3>Filtres</h3>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useTracksStore } from '@/stores/tracks.store'
import type { SportType, DiversType } from '@/types/gpx.types'

const tracksStore = useTracksStore()

const sportTypes: SportType[] = ['rando', 'course', 'velo', 'autre']
const diversTypes: DiversType[] = ['voiture', 'moto', 'bateau', 'autre']

const filters = reactive({
  showSport: tracksStore.filters.showSport,
  showDivers: tracksStore.filters.showDivers,
  sportTypes: [...tracksStore.filters.sportTypes],
  diversTypes: [...tracksStore.filters.diversTypes]
})

async function updateFilters() {
  tracksStore.isFiltering = true
  
  // Forcer le rendu de l'UI avant le filtrage
  await new Promise(resolve => setTimeout(resolve, 50))
  
  tracksStore.updateFilters(filters)
  
  // Laisser l'indicateur visible 400ms après le filtrage
  await new Promise(resolve => setTimeout(resolve, 400))
  tracksStore.isFiltering = false
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
  display: flex;
  align-items: center;
}

.filters-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filters-content h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.filter-group {
  display: flex;
  gap: 15px;
  align-items: center;
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
</style>
