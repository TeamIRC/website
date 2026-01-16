<script setup lang="ts">
import { ref, watch } from 'vue';

interface HeroProps {
  badge?: string | { icon: string; text: string };
  title: string | { gradient: string; normal: string };
  description: string;
  cta?: Array<{
    text: string;
    icon: string;
    link: string;
    primary: boolean;
  }>;
}

const props = defineProps<{
  content: HeroProps;
  edit: boolean;
}>();

const emit = defineEmits<{ 
  (event: "modified", template: string, content: HeroProps): void 
}>();

const hero = ref(structuredClone(props.content));

watch(
  () => props.edit,
  () => {
    if (JSON.stringify(hero.value) !== JSON.stringify(props.content)) {
      emit("modified", "Hero", hero.value);
    }
  }
);
</script>

<template>
  <section class="hero-section">
    <div v-if="edit" class="hero-edit">
      <input v-if="typeof hero.badge === 'string'" v-model="hero.badge" placeholder="Badge" />
      <div v-else-if="hero.badge">
        <input v-model="hero.badge.icon" placeholder="Icon" />
        <input v-model="hero.badge.text" placeholder="Text" />
      </div>
      
      <div v-if="typeof hero.title === 'string'">
        <input v-model="hero.title" placeholder="Title" />
      </div>
      <div v-else>
        <input v-model="hero.title.gradient" placeholder="Gradient text" />
        <input v-model="hero.title.normal" placeholder="Normal text" />
      </div>
      
      <textarea v-model="hero.description" placeholder="Description" />
      
      <div v-for="(cta, index) in hero.cta" :key="index">
        <input v-model="cta.text" placeholder="CTA text" />
        <input v-model="cta.icon" placeholder="Icon" />
        <input v-model="cta.link" placeholder="Link" />
        <input type="checkbox" v-model="cta.primary" /> Primary
      </div>
    </div>
    
    <div v-else class="hero-content">
      <div v-if="hero.badge" class="hero-badge">
        <span v-if="typeof hero.badge !== 'string'">{{ hero.badge.icon }}</span>
        <span>{{ typeof hero.badge === 'string' ? hero.badge : hero.badge.text }}</span>
      </div>
      
      <h1 class="hero-title">
        <template v-if="typeof hero.title === 'string'">
          {{ hero.title }}
        </template>
        <template v-else>
          <span class="gradient-text">{{ hero.title.gradient }}</span>
          <br v-if="hero.title.normal" />
          <span>{{ hero.title.normal }}</span>
        </template>
      </h1>
      
      <p class="hero-description">{{ hero.description }}</p>
      
      <div v-if="hero.cta" class="hero-cta">
        <router-link
          v-for="(cta, index) in hero.cta"
          :key="index"
          :to="cta.link"
          :class="['cta-button', { 'cta-primary': cta.primary, 'cta-secondary': !cta.primary }]"
        >
          <span v-if="!cta.primary">{{ cta.icon }}</span>
          {{ cta.text }}
          <span v-if="cta.primary">{{ cta.icon }}</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
}

.hero-badge {
  display: inline-block;
  background-color: var(--red-lt-2);
  color: var(--red-dk-3);
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

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  color: var(--page-txt);
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cta-primary {
  background-color: var(--gre-dk-1);
  color: white;
}

.cta-secondary {
  background-color: var(--card-bg-alt);
  color: var(--page-title);
  border: 2px solid var(--br2-lt-3);
}

.cta-primary:hover {
  background-color: var(--gre-dk-2);
  transform: translateY(-2px);
}

.cta-secondary:hover {
  border-color: var(--br3-dk-2);
  background-color: var(--br2-lt-2);
}

.hero-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.hero-edit input,
.hero-edit textarea {
  padding: 0.5rem;
  border: 1px solid var(--br2-lt-3);
  border-radius: 0.5rem;
  font-family: inherit;
}

.hero-edit textarea {
  min-height: 100px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
}
</style>