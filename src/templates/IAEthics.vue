<script setup lang="ts">
import { ref } from 'vue';

interface EthicsTopic {
  icon: string;
  title: string;
  description: string;
  tips: string[];
}

interface EthicsContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  introduction: {
    whatIsEthics: { title: string; content: string };
    whatIsAI: { title: string; content: string };
  };
  ethicsTopics: EthicsTopic[];
  warnings: Array<{ icon: string; title: string; description: string }>;
  goldenRules: Array<{ icon: string; title: string; description: string }>;
}


const currentIndex = ref(0);

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % (props.content?.ethicsTopics?.length || 1);
};

const prevSlide = () => {
  const length = props.content?.ethicsTopics?.length || 1;
  currentIndex.value = (currentIndex.value - 1 + length) % length;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

const props = defineProps<{
  content: EthicsContent;
  edit?: boolean;
}>();
</script>

<template>
  <div class="ia-ethics">
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-badge">{{ content.hero.badge }}</div>
      <h1 class="hero-title">{{ content.hero.title }}</h1>
      <p class="hero-description">{{ content.hero.description }}</p>
    </section>

    <!-- Introduction -->
    <section class="intro-section">
      <div class="intro-grid">
        <div class="intro-card">
          <h2>{{ content.introduction.whatIsEthics.title }}</h2>
          <p>{{ content.introduction.whatIsEthics.content }}</p>
        </div>
        <div class="intro-card">
          <h2>{{ content.introduction.whatIsAI.title }}</h2>
          <p>{{ content.introduction.whatIsAI.content }}</p>
        </div>
      </div>
    </section>

    <!-- Ethics Topics Carousel -->
    <section class="carousel-section">
      <div class="section-header">
        <h2>Les grands enjeux éthiques de l'IA</h2>
        <p>Que ce soit lors de sa création ou de son utilisation, l'IA soulève des questions importantes.</p>
      </div>

      <div class="carousel-container">
        <button @click="prevSlide" class="carousel-btn carousel-prev" aria-label="Précédent">‹</button>
        
        <div class="carousel-content">
          <div
            v-for="(topic, index) in content.ethicsTopics"
            :key="index"
            class="carousel-slide"
            :class="{ active: index === currentIndex }"
          >
            <div class="topic-card">
              <div class="topic-header">
                <span class="topic-icon">{{ topic.icon }}</span>
                <h3>{{ topic.title }}</h3>
              </div>
              <p class="topic-description">{{ topic.description }}</p>
              <div class="topic-tips">
                <h4>✅ Bonnes pratiques :</h4>
                <ul>
                  <li v-for="(tip, tipIndex) in topic.tips" :key="tipIndex">
                    <span class="bullet"></span>
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button @click="nextSlide" class="carousel-btn carousel-next" aria-label="Suivant">›</button>

        <div class="carousel-indicators">
          <button
            v-for="(_, index) in content.ethicsTopics"
            :key="index"
            @click="goToSlide(index)"
            class="indicator"
            :class="{ active: index === currentIndex }"
            :aria-label="`Aller au slide ${index + 1}`"
          ></button>
        </div>

        <div class="carousel-counter">
          {{ currentIndex + 1 }} / {{ content.ethicsTopics.length }}
        </div>
      </div>
    </section>

    <!-- Warnings -->
    <section class="warnings-section">
      <h2>⚠️ Points d'attention importants</h2>
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

    <!-- Golden Rules -->
    <section class="rules-section">
      <h2>🌟 Nos Engagements : Les Règles d'Or</h2>
      <div class="rules-grid">
        <div
          v-for="(rule, index) in content.goldenRules"
          :key="index"
          class="rule-card"
        >
          <div class="rule-icon">{{ rule.icon }}</div>
          <h3>{{ rule.title }}</h3>
          <p>{{ rule.description }}</p>
        </div>
      </div>
    </section>

    <!-- Footer Message -->
    <footer class="ethics-footer">
      <p>L'IA est un voyage passionnant. Explorons-le ensemble avec curiosité et responsabilité !</p>
    </footer>
  </div>
</template>

<style scoped>
.ia-ethics {
  width: 100%;
  font-family: 'NeuePlak-Light', sans-serif;
}

/* Hero */
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

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  color: var(--page-txt);
  opacity: 0.9;
}

/* Introduction */
.intro-section {
  padding: 3rem 2rem;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.intro-card {
  background-color: var(--card-bg-alt);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.intro-card h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--page-title);
}

.intro-card p {
  line-height: 1.6;
  color: var(--page-txt);
}

/* Carousel */
.carousel-section {
  padding: 4rem 2rem;
  background-color: var(--page-bg-alt);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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
}

.carousel-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

.carousel-content {
  position: relative;
  min-height: 500px;
}

.carousel-slide {
  display: none;
}

.carousel-slide.active {
  display: block;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.topic-card {
  background-color: var(--card-bg-alt);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.topic-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.topic-icon {
  font-size: 2.5rem;
}

.topic-header h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.5rem;
  color: var(--page-title);
}

.topic-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: var(--page-txt);
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

.carousel-btn {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  background-color: var(--card-bg-alt);
  border: 2px solid var(--br2-lt-3);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 2rem;
  color: var(--page-title);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-btn:hover {
  background-color: var(--br2-lt-2);
  transform: translateY(-50%) scale(1.1);
}

.carousel-prev {
  left: -60px;
}

.carousel-next {
  right: -60px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--br2-lt-3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: var(--br3-dk-2);
  transform: scale(1.2);
}

.carousel-counter {
  text-align: center;
  margin-top: 1rem;
  color: var(--page-txt);
  opacity: 0.7;
}

/* Warnings */
.warnings-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.warnings-section h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--page-title);
}

.warnings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.warning-card {
  background-color: var(--card-bg-alt);
  padding: 2rem;
  border-radius: 1rem;
  border-left: 4px solid var(--red-dk-2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.warning-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.warning-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--page-title);
}

.warning-card p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--page-txt);
}

/* Golden Rules */
.rules-section {
  padding: 4rem 2rem;
}

.rules-section h2 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--page-title);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.rule-card {
  background-color: var(--br2-lt-2);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.rule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.rule-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background-color: var(--br3-lt-2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.rule-card h3 {
  font-family: 'NeuePlak-Bold', sans-serif;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--page-title);
}

.rule-card p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--page-txt);
}

/* Footer */
.ethics-footer {
  text-align: center;
  padding: 3rem 2rem;
  border-top: 2px solid var(--br2-lt-3);
}

.ethics-footer p {
  font-size: 1.1rem;
  color: var(--page-txt);
}

/* Responsive */
@media (max-width: 1024px) {
  .carousel-prev {
    left: 10px;
  }
  
  .carousel-next {
    right: 10px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .section-header h2,
  .warnings-section h2,
  .rules-section h2 {
    font-size: 1.8rem;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}
</style>