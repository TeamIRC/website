<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  content: {
    title?: string;
    subtitle?: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
      image?: string;
      color?: string;
      url?: string;
      features?: string[];
      ageRange?: string;
      safety?: string;
      categories?: string[];
      tips?: string[];
      actions?: string[];
      recommendations?: string[];
      isBlue?: boolean;
    }>;
    columns?: number;
    theme?: 'default' | 'warning' | 'success' | 'info';
  };
  edit: boolean;
}>();

const emit = defineEmits<{ 
  (event: "modified", template: string, content: any): void 
}>();

const grid = ref(structuredClone(props.content));
const selectedCategory = ref('Tous');

const gridClasses = computed(() => {
  const cols = grid.value.columns || 3;
  return `grid-cols-${cols}`;
});

const themeClasses = computed(() => {
  switch (grid.value.theme) {
    case 'warning':
      return 'warning-theme';
    case 'success':
      return 'success-theme';
    case 'info':
      return 'info-theme';
    default:
      return '';
  }
});

// Calculer les catégories disponibles
const availableCategories = computed(() => {
  const categories = new Set<string>();
  grid.value.items.forEach(item => {
    if (item.categories) {
      item.categories.forEach(cat => categories.add(cat));
    }
  });
  return Array.from(categories).sort();
});

// Filtrer les items
const filteredItems = computed(() => {
  if (selectedCategory.value === 'Tous') {
    return grid.value.items;
  }
  return grid.value.items.filter(item => 
    item.categories?.includes(selectedCategory.value)
  );
});

// Écouter les événements de filtre
const handleFilterChange = (event: CustomEvent) => {
  selectedCategory.value = event.detail.filter;
};

onMounted(() => {
  window.addEventListener('filter-changed', handleFilterChange as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('filter-changed', handleFilterChange as EventListener);
});

watch(
  () => props.edit,
  () => {
    if (JSON.stringify(grid.value) !== JSON.stringify(props.content)) {
      emit("modified", "CardGrid", grid.value);
    }
  }
);

const addItem = () => {
  grid.value.items.push({
    title: 'Nouvel élément',
    description: 'Description ici...'
  });
};

const removeItem = (index: number) => {
  grid.value.items.splice(index, 1);
};
</script>

<template>
  <section class="card-grid-section" :class="themeClasses">
    <div v-if="edit" class="card-grid-edit">
      <input v-model="grid.title" placeholder="Titre de la section" />
      <input v-model="grid.subtitle" placeholder="Sous-titre" />
      <select v-model="grid.theme">
        <option value="default">Par défaut</option>
        <option value="warning">Avertissement</option>
        <option value="success">Succès</option>
        <option value="info">Info</option>
      </select>
      <input type="number" v-model="grid.columns" min="1" max="6" placeholder="Colonnes" />
      
      <div v-for="(item, index) in grid.items" :key="index" class="item-edit">
        <input v-model="item.icon" placeholder="Icone" />
        <input v-model="item.title" placeholder="Titre" />
        <textarea v-model="item.description" placeholder="Description" />
        <input v-model="item.image" placeholder="URL de l'image" />
        <input v-model="item.color" placeholder="Couleur" />
        <input v-model="item.url" placeholder="URL" />
        <input v-model="item.ageRange" placeholder="Tranche d'âge" />
        <input v-model="item.safety" placeholder="Sécurité" />
        <button @click="removeItem(index)" class="remove-btn">Supprimer</button>
      </div>
      <button @click="addItem" class="add-btn">+ Ajouter un élément</button>
    </div>
    
    <div v-else class="card-grid-content">
      <div v-if="grid.title || grid.subtitle" class="section-header">
        <h2 v-if="grid.title" class="section-title">{{ grid.title }}</h2>
        <p v-if="grid.subtitle" class="section-subtitle">{{ grid.subtitle }}</p>
      </div>
      
      <div :class="['grid', gridClasses]">
        <div
          v-for="(item, index) in filteredItems"
          :key="index"
          class="card"
        >
          <!-- En-tête de carte avec couleur -->
          <div v-if="item.color" :class="['color-header', `gradient-${item.color}`]">
            <div class="tool-meta">
              <div class="tool-name-wrapper">
                <span v-if="item.icon" class="tool-icon">{{ item.icon }}</span>
                <span class="tool-name">{{ item.title || item.name }}</span>
              </div>
              <span v-if="item.ageRange" class="tool-age">{{ item.ageRange }}</span>
            </div>
            <div v-if="item.categories" class="tool-categories">
              <span
                v-for="(cat, catIndex) in item.categories"
                :key="catIndex"
                class="category-tag"
              >
                {{ cat }}
              </span>
            </div>
          </div>
          
          <!-- En-tête simple pour les cartes sans couleur -->
          <div v-else class="simple-header">
            <div v-if="item.icon" class="card-icon">{{ item.icon }}</div>
            <h3 class="card-title">{{ item.title || item.name }}</h3>
          </div>
          
          <!-- Image optionnelle -->
          <img v-if="item.image" :src="item.image" :alt="item.title || item.name" class="card-image" />
          
          <!-- Description -->
          <p class="card-description">{{ item.description }}</p>
          
          <!-- Fonctionnalités -->
          <div v-if="item.features" class="tool-features">
            <h4>Fonctionnalités :</h4>
            <div class="feature-tags">
              <span v-for="(feature, fIndex) in item.features" :key="fIndex" class="feature-tag">
                {{ feature }}
              </span>
            </div>
          </div>
          
          <!-- Conseils -->
          <div v-if="item.tips" class="topic-tips">
            <h4>✅ Bonnes pratiques :</h4>
            <ul>
              <li v-for="(tip, tipIndex) in item.tips" :key="tipIndex">
                <span class="bullet"></span>
                {{ tip }}
              </li>
            </ul>
          </div>
          
          <!-- Recommandations -->
          <div v-if="item.recommendations" class="recommendations">
            <ul>
              <li v-for="(rec, recIndex) in item.recommendations" :key="recIndex">
                <span class="bullet"></span>
                {{ rec }}
              </li>
            </ul>
          </div>
          
          <!-- Actions -->
          <div v-if="item.actions" class="parent-actions">
            <div v-for="(action, actionIndex) in item.actions" :key="actionIndex" class="action-item">
              <span class="action-icon">❤️</span>
              {{ action }}
            </div>
          </div>
          
          <!-- Sécurité -->
          <div v-if="item.safety" class="tool-safety">
            <span class="safety-badge">🛡️ {{ item.safety }}</span>
          </div>
          
          <!-- Lien -->
          <a v-if="item.url" :href="item.url" target="_blank" class="tool-link">
            Découvrir →
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card-grid-section {
  padding: 3rem 2rem;
  background-color: var(--page-bg);
}

/* Thèmes */
.warning-theme {
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.success-theme {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
}

.info-theme {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--page-title);
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--page-txt);
  opacity: 0.8;
  max-width: 700px;
  margin: 0 auto;
}

/* Grille responsive */
.grid {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Carte */
.card {
  background-color: var(--card-bg-alt);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* En-têtes de carte avec gradient */
.color-header {
  padding: 1.5rem;
  color: white;
}

.gradient-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.gradient-purple { background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); }
.gradient-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.gradient-orange { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
.gradient-red { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
.gradient-pink { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }
.gradient-gray { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); }

.tool-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tool-name-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tool-icon {
  font-size: 1.5rem;
}

.tool-name {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.5rem;
}

.tool-age {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  white-space: nowrap;
}

.tool-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
}

/* En-tête simple */
.simple-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card-title {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--page-title);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin: 0 1.5rem;
  border-radius: 0.5rem;
}

.card-description {
  padding: 0 1.5rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--page-txt);
  flex-grow: 1;
}

/* Fonctionnalités */
.tool-features {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.tool-features h4 {
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: var(--page-title);
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background-color: var(--br2-lt-2);
  color: var(--page-txt);
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
}

/* Conseils */
.topic-tips {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.topic-tips h4 {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--page-title);
}

.topic-tips ul {
  list-style: none;
  padding: 0;
}

.topic-tips li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--page-txt);
}

.bullet {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--gre-dk-1);
  border-radius: 50%;
  margin-top: 0.5rem;
  flex-shrink: 0;
}

/* Recommandations */
.recommendations {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.recommendations ul {
  list-style: none;
  padding: 0;
}

.recommendations li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--page-txt);
}

/* Actions */
.parent-actions {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--page-txt);
}

.action-icon {
  font-size: 1rem;
}

/* Sécurité */
.tool-safety {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.safety-badge {
  display: inline-block;
  background-color: var(--gre-lt-2);
  color: var(--gre-dk-4);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Lien */
.tool-link {
  display: block;
  margin: 0 1.5rem 1.5rem 1.5rem;
  text-align: center;
  background-color: var(--br2-lt-2);
  color: var(--page-title);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tool-link:hover {
  background-color: var(--br2-dk-2);
  color: white;
}

/* Mode édition */
.card-grid-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--card-bg-alt);
  border-radius: 1rem;
  border: 2px dashed var(--br2-lt-3);
}

.item-edit {
  border: 1px solid var(--br2-lt-3);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-grid-edit input,
.card-grid-edit select,
.card-grid-edit textarea {
  padding: 0.75rem;
  border: 1px solid var(--br2-lt-3);
  border-radius: 0.5rem;
  font-family: 'NeuePlak-Light', sans-serif;
  font-size: 1rem;
  background-color: var(--page-bg);
  color: var(--page-txt);
}

.card-grid-edit textarea {
  min-height: 6rem;
  resize: vertical;
}

.remove-btn {
  background-color: var(--red-dk-2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: 'NeuePlak-Light', sans-serif;
}

.add-btn {
  background-color: var(--gre-dk-1);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-family: 'NeuePlak-Light', sans-serif;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .grid {
    grid-template-columns: 1fr !important;
  }

  .card-grid-edit {
    padding: 1rem;
  }
}
</style>