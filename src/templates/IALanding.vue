<script setup lang="ts">
interface Feature {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface LandingContent {
  hero: {
    badge: { icon: string; text: string };
    title: { gradient: string; normal: string };
    description: string;
    cta: Array<{
      text: string;
      icon: string;
      link: string;
      primary: boolean;
    }>;
  };
  features: Feature[];
  whatToLearn: {
    title: string;
    subtitle: string;
  };
  callToAction: {
    gradient: boolean;
    title: string;
    description: string;
    button: {
      text: string;
      icon: string;
      link: string;
    };
  };
}

defineProps<{
  content: LandingContent;
  edit?: boolean;
}>();
</script>

<template>
  <div class="ia-landing">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span>{{ content.hero.badge.icon }}</span>
          <span>{{ content.hero.badge.text }}</span>
        </div>
        
        <h1 class="hero-title">
          <span class="gradient-text">{{ content.hero.title.gradient }}</span>
          <br />
          <span>{{ content.hero.title.normal }}</span>
        </h1>
        
        <p class="hero-description">{{ content.hero.description }}</p>

        <div class="hero-cta">
          <router-link
            v-for="(cta, index) in content.hero.cta"
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

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2>{{ content.whatToLearn.title }}</h2>
        <p>{{ content.whatToLearn.subtitle }}</p>
      </div>

      <div class="features-grid">
        <router-link
          v-for="(feature, index) in content.features"
          :key="index"
          :to="feature.link"
          class="feature-card"
        >
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <div class="feature-link">
            En savoir plus →
          </div>
        </router-link>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div :class="['cta-container', { 'gradient-bg': content.callToAction.gradient }]">
        <h2>{{ content.callToAction.title }}</h2>
        <p>{{ content.callToAction.description }}</p>
        <router-link :to="content.callToAction.button.link" class="cta-main-button">
          {{ content.callToAction.button.text }}
          <span>{{ content.callToAction.button.icon }}</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ia-landing {
  width: 100%;
  font-family: 'NeuePlak-Light', sans-serif;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 5rem 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
}

.hero-content {
  max-width: 1000px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--br3-lt-2);
  color: var(--br3-dk-3);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.hero-title {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
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
  line-height: 1.8;
  color: var(--page-txt);
  opacity: 0.9;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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

.cta-primary:hover {
  background-color: var(--gre-dk-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.cta-secondary {
  background-color: var(--card-bg-alt);
  color: var(--page-title);
  border: 2px solid var(--br2-lt-3);
}

.cta-secondary:hover {
  border-color: var(--br3-dk-2);
  background-color: var(--br2-lt-2);
}

/* Features Section */
.features-section {
  padding: 5rem 2rem;
  background-color: var(--page-bg-alt);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--page-title);
}

.section-header p {
  font-size: 1.1rem;
  color: var(--page-txt);
  opacity: 0.8;
  max-width: 700px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: var(--card-bg-alt);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  border-color: var(--br3-dk-2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  transform-origin: center;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--page-title);
}

.feature-card p {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--page-txt);
}

.feature-link {
  display: inline-flex;
  align-items: center;
  color: var(--br3-dk-2);
  font-weight: 600;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-link {
  color: var(--br3-dk-3);
  transform: translateX(5px);
}

/* CTA Section */
.cta-section {
  padding: 5rem 2rem;
}

.cta-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 3rem;
  border-radius: 2rem;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.gradient-bg {
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
  color: white;
}

.cta-container h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-container p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-main-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  background-color: white;
  color: var(--br3-dk-3);
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-container {
    padding: 2.5rem 1.5rem;
  }

  .cta-container h2 {
    font-size: 2rem;
  }
}
</style>