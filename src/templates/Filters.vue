<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface FilterItem {
  value: string;
  label: string;
  count?: number;
}

interface FiltersProps {
  title?: string;
  filters: FilterItem[];
  selected?: string;
}

const props = defineProps<{
  content: FiltersProps;
  edit: boolean;
}>();

const emit = defineEmits<{ 
  (event: "modified", template: string, content: FiltersProps): void 
}>();

const filters = ref(structuredClone(props.content));
const selectedFilter = ref(filters.value.selected || 'Tous');

const selectFilter = (value: string) => {
  selectedFilter.value = value;
  filters.value.selected = value;
  
  // Émettre un événement personnalisé
  window.dispatchEvent(new CustomEvent('filter-changed', { 
    detail: { filter: value } 
  }));
};

watch(
  () => props.edit,
  () => {
    if (JSON.stringify(filters.value) !== JSON.stringify(props.content)) {
      emit("modified", "Filters", filters.value);
    }
  }
);

// Mode édition
const addFilter = () => {
  filters.value.filters.push({
    value: `filter-${Date.now()}`,
    label: 'Nouveau filtre',
    count: 0
  });
};

const removeFilter = (index: number) => {
  filters.value.filters.splice(index, 1);
};
</script>

<template>
  <section class="filters-section">
    <div v-if="edit" class="filters-edit">
      <input v-model="filters.title" placeholder="Titre des filtres" />
      <div v-for="(filter, index) in filters.filters" :key="index" class="filter-edit">
        <input v-model="filter.value" placeholder="Valeur" />
        <input v-model="filter.label" placeholder="Label" />
        <input type="number" v-model="filter.count" placeholder="Compteur" />
        <button @click="removeFilter(index)" class="remove-btn">Supprimer</button>
      </div>
      <button @click="addFilter" class="add-btn">+ Ajouter un filtre</button>
    </div>
    
    <div v-else class="filters-content">
      <h3 v-if="filters.title" class="filters-title">{{ filters.title }}</h3>
      
      <div class="category-filters">
        <button
          v-for="filter in filters.filters"
          :key="filter.value"
          @click="selectFilter(filter.value)"
          :class="['category-btn', { active: selectedFilter === filter.value }]"
          :aria-label="`Filtrer par ${filter.label}`"
        >
          {{ filter.label }}
          <span v-if="filter.count !== undefined" class="filter-count">
            {{ filter.count }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filters-section {
  padding: 2rem;
  background-color: var(--page-bg);
}

.filters-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--page-title);
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.25rem;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  max-width: 1200px;
  margin: 0 auto;
}

.category-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  border: 2px solid var(--br2-lt-3);
  background-color: var(--card-bg-alt);
  color: var(--page-txt);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'NeuePlak-Light', sans-serif;
}

.category-btn:hover {
  border-color: var(--br3-dk-2);
  background-color: var(--br2-lt-2);
  transform: translateY(-2px);
}

.category-btn.active {
  background-color: var(--br3-dk-2);
  color: white;
  border-color: var(--br3-dk-2);
}

.filter-count {
  background-color: var(--br3-lt-2);
  color: var(--br3-dk-3);
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  min-width: 1.5rem;
  text-align: center;
}

.category-btn.active .filter-count {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Mode édition */
.filters-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: var(--card-bg-alt);
  border-radius: 1rem;
  border: 2px dashed var(--br2-lt-3);
}

.filter-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--br2-lt-3);
  border-radius: 0.5rem;
}

.filters-edit input {
  padding: 0.5rem;
  border: 1px solid var(--br2-lt-3);
  border-radius: 0.25rem;
  font-family: 'NeuePlak-Light', sans-serif;
  background-color: var(--page-bg);
  color: var(--page-txt);
}

.remove-btn {
  background-color: var(--red-dk-2);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.add-btn {
  background-color: var(--gre-dk-1);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 768px) {
  .filters-section {
    padding: 1rem;
  }
  
  .category-filters {
    gap: 0.5rem;
  }
  
  .category-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>