<script setup lang="ts">
interface RecommendationsContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  goodPractices: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  warnings: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  ageGroups: Array<{
    age: string;
    icon: string;
    recommendations: string[];
  }>;
  parentsTips: Array<{
    icon: string;
    title: string;
    description: string;
    actions: string[];
  }>;
  finalMessage: {
    title: string;
    description: string;
    tags: string[];
  };
}

defineProps<{
  content: RecommendationsContent;
  edit?: boolean;
}>();
</script>

<template>
  <div class="ia-recommendations">
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-badge">{{ content.hero.badge }}</div>
      <h1 class="hero-title">{{ content.hero.title }}</h1>
      <p class="hero-description">{{ content.hero.description }}</p>
    </section>

    <!-- Good Practices -->
    <section class="practices-section">
      <h2>✅ Les bonnes pratiques</h2>
      <div class="practices-grid">
        <div
          v-for="(practice, index) in content.goodPractices"
          :key="index"
          class="practice-card"
        >
          <div class="practice-icon">{{ practice.icon }}</div>
          <h3>{{ practice.title }}</h3>
          <p>{{ practice.description }}</p>
        </div>
      </div>
    </section>

    <!-- Warnings -->
    <section class="warnings-section">
      <h2>⚠️ Points d'attention</h2>
      <div class="warnings-grid">
        <div
          v-for="(warning, index) in content.warnings"
          :key="index"
          class="warning-card"
        >
          <div class="warning-icon">{{ warning.icon }}</div>
          <h3>{{ warning.title }}</h3>
          <p>{{ warning.description }}</p>
        </div>
      </div>
    </section>

    <!-- Age Groups -->
    <section class="age-section">
      <h2>👶 Recommandations par âge</h2>
      <div class="age-grid">
        <div
          v-for="(group, index) in content.ageGroups"
          :key="index"
          class="age-card"
        >
          <div class="age-icon">{{ group.icon }}</div>
          <h3>{{ group.age }}</h3>
          <ul>
            <li v-for="(rec, recIndex) in group.recommendations" :key="recIndex">
              <span class="bullet"></span>
              {{ rec }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Parents Tips -->
    <section class="parents-section">
      <h2>👨‍👩‍👧‍👦 Conseils pour les parents</h2>
      <div class="parents-grid">
        <div
          v-for="(tip, index) in content.parentsTips"
          :key="index"
          class="parent-card"
        >
          <div class="parent-icon">{{ tip.icon }}</div>
          <h3>{{ tip.title }}</h3>
          <p class="parent-description">{{ tip.description }}</p>
          <div class="parent-actions">
            <div
              v-for="(action, actionIndex) in tip.actions"
              :key="actionIndex"
              class="action-item"
            >
              <span class="action-icon">❤️</span>
              {{ action }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final Message -->
    <section class="final-section">
      <div class="final-card">
        <h2>{{ content.finalMessage.title }}</h2>
        <p>{{ content.finalMessage.description }}</p>
        <div class="final-tags">
          <span
            v-for="(tag, index) in content.finalMessage.tags"
            :key="index"
            class="final-tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ia-recommendations {
  width: 100%;
  font-family: 'NeuePlak-Light', sans-serif;
}

/* Hero */
.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
}

.hero-badge {
  display: inline-block;
  background-color: var(--gre-lt-2);
  color: var(--gre-dk-3);
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

/* Section Title */
section h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--page-title);
}

/* Good Practices */
.practices-section {
  padding: 4rem 2rem;
  background-color: var(--page-bg);
}

.practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.practice-card {
  background-color: var(--card-bg-alt);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.practice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.practice-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.practice-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--page-title);
}

.practice-card p {
  line-height: 1.5;
  color: var(--page-txt);
}

/* Warnings */
.warnings-section {
  padding: 4rem 2rem;
  background-color: var(--page-bg-alt);
}

.warnings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.warning-card {
  background-color: var(--red-lt-1);
  padding: 2rem;
  border-radius: 1rem;
  border: 2px solid var(--red-lt-3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.warning-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.warning-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--red-dk-3);
}

.warning-card p {
  line-height: 1.5;
  color: var(--red-dk-2);
}

/* Age Groups */
.age-section {
  padding: 4rem 2rem;
  background-color: var(--page-bg);
}

.age-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.age-card {
  background-color: var(--card-bg-alt);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.age-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.age-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--page-title);
}

.age-card ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

.age-card li {
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

/* Parents Tips */
.parents-section {
  padding: 4rem 2rem;
  background-color: var(--page-bg-alt);
}

.parents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.parent-card {
  background-color: var(--card-bg-alt);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.parent-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.parent-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--page-title);
}

.parent-description {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--page-txt);
}

.parent-actions {
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

/* Final Message */
.final-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
}

.final-card {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  color: white;
}

.final-card h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.final-card p {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.final-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.final-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title,
  section h2,
  .final-card h2 {
    font-size: 2rem;
  }

  .practices-grid,
  .warnings-grid,
  .age-grid,
  .parents-grid {
    grid-template-columns: 1fr;
  }
}
</style>