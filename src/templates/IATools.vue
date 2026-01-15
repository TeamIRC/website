<script setup lang="ts">
import { ref, computed } from 'vue';

interface Tool {
  name: string;
  icon: string;
  categories: string[];
  description: string;
  ageRange: string;
  features: string[];
  safety: string;
  color: string;
  url: string;
}

interface ToolsContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  tools: Tool[];
  safetyGuidelines: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const props = defineProps<{
  content: ToolsContent;
  edit?: boolean;
}>();

const selectedCategory = ref("Tous");

const categories = computed(() => {
  const allCategories = Array.from(
    new Set(props.content.tools.flatMap(tool => tool.categories))
  ).sort();
  return ["Tous", ...allCategories];
});

const filteredTools = computed(() => {
  return selectedCategory.value === "Tous"
    ? props.content.tools
    : props.content.tools.filter(tool => 
        tool.categories.includes(selectedCategory.value)
      );
});

const getColorClasses = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'gradient-blue',
    purple: 'gradient-purple',
    green: 'gradient-green',
    orange: 'gradient-orange',
    red: 'gradient-red',
    pink: 'gradient-pink',
  };
  return colorMap[color] || 'gradient-blue';
};
</script>

<template>
  <div class="ia-tools">
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-badge">{{ content.hero.badge }}</div>
      <h1 class="hero-title">{{ content.hero.title }}</h1>
      <p class="hero-description">{{ content.hero.description }}</p>
    </section>

    <!-- Category Filters -->
    <section class="filters-section">
      <div class="category-filters">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="['category-btn', { active: selectedCategory === category }]"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <!-- Tools Grid -->
    <section class="tools-section">
      <div class="tools-grid">
        <div
          v-for="(tool, index) in filteredTools"
          :key="index"
          class="tool-card"
        >
          <div :class="['tool-header', getColorClasses(tool.color)]">
            <div class="tool-meta">
              <div class="tool-name-wrapper">
                <span class="tool-icon">{{ tool.icon }}</span>
                <span class="tool-name">{{ tool.name }}</span>
              </div>
              <span class="tool-age">{{ tool.ageRange }}</span>
            </div>
            <div class="tool-categories">
              <span
                v-for="(cat, catIndex) in tool.categories"
                :key="catIndex"
                class="category-tag"
              >
                {{ cat }}
              </span>
            </div>
          </div>

          <div class="tool-body">
            <p class="tool-description">{{ tool.description }}</p>

            <div class="tool-features">
              <h4>Fonctionnalités :</h4>
              <div class="feature-tags">
                <span
                  v-for="(feature, featureIndex) in tool.features"
                  :key="featureIndex"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
              </div>
            </div>

            <div class="tool-safety">
              <span class="safety-badge">🛡️ {{ tool.safety }}</span>
            </div>

            <a
              :href="tool.url"
              target="_blank"
              rel="noopener noreferrer"
              class="tool-link"
            >
              Découvrir l'outil →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Safety Guidelines -->
    <section class="safety-section">
      <h2>🛡️ Conseils de sécurité</h2>
      <div class="safety-grid">
        <div
          v-for="(guideline, index) in content.safetyGuidelines"
          :key="index"
          class="safety-card"
        >
          <div class="safety-icon">{{ guideline.icon }}</div>
          <h3>{{ guideline.title }}</h3>
          <p>{{ guideline.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ia-tools {
  width: 100%;
  font-family: 'NeuePlak-Light', sans-serif;
}

/* Hero */
.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
}

.hero-badge {
  display: inline-block;
  background-color: var(--br3-lt-2);
  color: var(--br3-dk-3);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--page-title);
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  color: var(--page-txt);
  opacity: 0.9;
}

/* Filters */
.filters-section {
  padding: 2rem;
  background-color: var(--page-bg);
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
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  border: 2px solid var(--br2-lt-3);
  background-color: var(--card-bg-alt);
  color: var(--page-txt);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover,
.category-btn.active {
  background-color: var(--br3-dk-2);
  color: white;
  border-color: var(--br3-dk-2);
  transform: translateY(-2px);
}

/* Tools */
.tools-section {
  padding: 3rem 2rem;
  background-color: var(--page-bg-alt);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.tool-card {
  background-color: var(--card-bg-alt);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tool-header {
  padding: 1.5rem;
  color: white;
}

.gradient-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.gradient-purple { background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); }
.gradient-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.gradient-orange { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
.gradient-red { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
.gradient-pink { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }

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

.tool-body {
  padding: 1.5rem;
}

.tool-description {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--page-txt);
}

.tool-features {
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

.tool-safety {
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

.tool-link {
  display: block;
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

/* Safety Guidelines */
.safety-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
}

.safety-section h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--page-title);
}

.safety-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.safety-card {
  background-color: var(--card-bg-alt);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.safety-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.safety-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.safety-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--page-title);
}

.safety-card p {
  line-height: 1.5;
  color: var(--page-txt);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .category-filters {
    justify-content: flex-start;
  }
}
</style>