<script setup lang="ts">
import { ref, watch, computed } from 'vue';

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

const gridClasses = computed(() => {
  const cols = grid.value.columns || 3;
  return `grid-cols-${cols}`;
});

const themeClasses = computed(() => {
  switch (grid.value.theme) {
    case 'warning':
      return 'bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-yellow-500';
    case 'success':
      return 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500';
    case 'info':
      return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500';
    default:
      return 'bg-card-bg-alt';
  }
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
    title: 'New Item',
    description: 'Description here...'
  });
};

const removeItem = (index: number) => {
  grid.value.items.splice(index, 1);
};
</script>

<template>
  <section class="card-grid-section">
    <div v-if="edit" class="card-grid-edit">
      <input v-model="grid.title" placeholder="Section Title" />
      <input v-model="grid.subtitle" placeholder="Subtitle" />
      <select v-model="grid.theme">
        <option value="default">Default</option>
        <option value="warning">Warning</option>
        <option value="success">Success</option>
        <option value="info">Info</option>
      </select>
      <input type="number" v-model="grid.columns" min="1" max="6" />
      
      <div v-for="(item, index) in grid.items" :key="index" class="item-edit">
        <input v-model="item.icon" placeholder="Icon" />
        <input v-model="item.title" placeholder="Title" />
        <textarea v-model="item.description" placeholder="Description" />
        <input v-model="item.image" placeholder="Image URL" />
        <input v-model="item.color" placeholder="Color" />
        <input v-model="item.url" placeholder="URL" />
        <input v-model="item.ageRange" placeholder="Age Range" />
        <input v-model="item.safety" placeholder="Safety" />
        <button @click="removeItem(index)" class="remove-btn">Remove</button>
      </div>
      <button @click="addItem" class="add-btn">Add Item</button>
    </div>
    
    <div v-else class="card-grid-content">
      <div v-if="grid.title || grid.subtitle" class="section-header">
        <h2 v-if="grid.title" class="section-title">{{ grid.title }}</h2>
        <p v-if="grid.subtitle" class="section-subtitle">{{ grid.subtitle }}</p>
      </div>
      
      <div :class="['grid', gridClasses]">
        <div
          v-for="(item, index) in grid.items"
          :key="index"
          :class="['card', themeClasses]"
        >
          <div v-if="item.icon" class="card-icon">{{ item.icon }}</div>
          <img v-if="item.image" :src="item.image" :alt="item.title" class="card-image" />
          
          <div v-if="item.color" :class="['color-header', `bg-${item.color}-500`]">
            <div class="card-meta">
              <div v-if="item.icon" class="meta-icon">{{ item.icon }}</div>
              <h3 class="card-title">{{ item.title }}</h3>
              <span v-if="item.ageRange" class="age-badge">{{ item.ageRange }}</span>
            </div>
            <div v-if="item.categories" class="categories">
              <span v-for="(cat, catIndex) in item.categories" :key="catIndex" class="category-tag">
                {{ cat }}
              </span>
            </div>
          </div>
          
          <div v-else>
            <h3 class="card-title">{{ item.title }}</h3>
          </div>
          
          <p class="card-description">{{ item.description }}</p>
          
          <div v-if="item.features" class="features">
            <h4>Fonctionnalités :</h4>
            <div class="feature-tags">
              <span v-for="(feature, fIndex) in item.features" :key="fIndex" class="feature-tag">
                {{ feature }}
              </span>
            </div>
          </div>
          
          <div v-if="item.tips" class="tips">
            <h4>✅ Bonnes pratiques :</h4>
            <ul>
              <li v-for="(tip, tipIndex) in item.tips" :key="tipIndex">{{ tip }}</li>
            </ul>
          </div>
          
          <div v-if="item.recommendations" class="recommendations">
            <ul>
              <li v-for="(rec, recIndex) in item.recommendations" :key="recIndex">
                <span class="bullet"></span>
                {{ rec }}
              </li>
            </ul>
          </div>
          
          <div v-if="item.actions" class="actions">
            <div v-for="(action, actionIndex) in item.actions" :key="actionIndex" class="action-item">
              <span class="action-icon">❤️</span>
              {{ action }}
            </div>
          </div>
          
          <div v-if="item.safety" class="safety-badge">
            🛡️ {{ item.safety }}
          </div>
          
          <a v-if="item.url" :href="item.url" target="_blank" class="card-link">
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
  max-width: 800px;
  margin: 0 auto;
}

.grid {
  display: grid;
  gap: 2rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

.card {
  background-color: var(--card-bg-alt);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.color-header {
  color: white;
  padding: 1.5rem;
  border-radius: 1rem 1rem 0 0;
  margin: -2rem -2rem 2rem -2rem;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.meta-icon {
  font-size: 1.5rem;
}

.card-title {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.age-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
}

.categories {
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

.card-description {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--page-txt);
}

.features h4,
.tips h4 {
  font-weight: 600;
  margin-bottom: 0.75rem;
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

.tips ul {
  list-style: none;
  padding-left: 0;
}

.tips li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.tips li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--gre-dk-1);
}

.recommendations ul {
  list-style: none;
  padding-left: 0;
}

.recommendations li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
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

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.action-icon {
  font-size: 1rem;
}

.safety-badge {
  display: inline-block;
  background-color: var(--gre-lt-2);
  color: var(--gre-dk-4);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 1rem;
}

.card-link {
  display: block;
  text-align: center;
  background-color: var(--br2-lt-2);
  color: var(--page-title);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
}

.card-link:hover {
  background-color: var(--br2-dk-2);
  color: white;
}

.card-grid-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.item-edit {
  border: 1px solid var(--br2-lt-3);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.remove-btn {
  background-color: var(--red-dk-2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.add-btn {
  background-color: var(--gre-dk-1);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>