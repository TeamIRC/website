<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const position = ref(0);
const isPaused = ref(false);
let animationFrame: number | null = null;
const speed = 0.03; // pixels per frame

const animate = () => {
  if (!isPaused.value) {
    position.value -= speed;
    if (position.value <= -100) {
      position.value = 0;
    }
  }
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  animationFrame = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Contact Column -->
      <div class="footer-column">
        <h3>Contact</h3>
        <table class="contact-info">
          <tbody>
            <tr>
              <td><v-icon name="fa-at" /></td>
              <td><a href="mailto:contact@example.com">contact@example.com</a></td>
            </tr>
            <tr>
              <td><v-icon name="fa-phone" /></td>
              <td><a href="tel:+33123456789">+33 1 23 45 67 89</a></td>
            </tr>
            <tr>
              <td><v-icon name="fa-envelope" /></td>
              <td>
                123 Rue Example<br />
                75000 Paris, France
              </td>
            </tr>
          </tbody>
        </table>
        <router-link to="/mentions-legales">Mentions légales</router-link>
      </div>

      <!-- Missions Column -->
      <div class="footer-column">
        <h3>Nos Missions</h3>
        <ul class="missions-list">
          <li><a href="#">Mission1</a></li>
          <li><a href="#">Mission2</a></li>
          <li><a href="#">Mission3</a></li>
          <li><a href="#">Mission4</a></li>
        </ul>
      </div>

      <!-- Partners Column -->
      <div class="footer-column">
        <h3>Nos Partenaires</h3>
        <Vue3Marquee id="partners" class="marquee-container" clone pauseOnHover>
          <a href="https://herault.fr/" target="_blank">
            <img src="/assets/img/herault.jpg" alt="Partner Logo" />
          </a>
          <a href="https://www.montpellier.fr/" target="_blank">
            <img
              src="/assets/img/Ville_de_Montpellier.png"
              alt="Partner Logo"
            />
          </a>
          <a href="https://flyingfishproduction.com/" target="_blank">
            <img src="/assets/img/FFLOGO.webp" alt="Partner Logo" />
          </a>
          <a href="https://www.pedagojeux.fr/" target="_blank">
            <img src="/assets/img/pedagojeux_logo.webp" alt="Partner Logo" />
          </a>
          <a href="https://www.promeneursdunet.fr/" target="_blank">
            <img
              src="/assets/img/PROMENEURS_DU_NET_2.webp"
              alt="Partner Logo"
            />
          </a>
          <a href="https://www.ufcv.fr/" target="_blank">
            <img src="/assets/img/UFCV.webp" alt="Partner Logo" />
          </a>
        </Vue3Marquee>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--foot-bg);
  color: var(--foot-text);
  box-shadow: 0 -2px 10px var(--foot-box);
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: "NeuePlak-Bold";
  font-weight: bold;
  font-style: normal;
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  max-width: 100vw;
  gap: 1rem;
}

.footer-column {
  flex: 1;
  min-width: 0;
  padding: 1rem;
  justify-items: center;
}

.footer-column h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.footer-column h3::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--foot-text-hover);
  transition: width 0.3s ease;
}

.footer-column:hover h3::after {
  width: 100%;
}

/* Contact Styles */
.contact-info {
  font-size: 0.95rem;
  margin-bottom: 1em;
  border-spacing: 1em;
  line-height: 1em;
}

a {
  color: var(--foot-link);
  text-decoration: none;
  transition: all 0.3s ease;
}

a:hover {
  color: var(--foot-link-hover);
  text-decoration: underline;
}

/* Missions Styles */
.missions-list {
  list-style: none;
  padding: 0;
}

.missions-list li {
  margin-bottom: 0.75rem;
}

.missions-list a {
  position: relative;
  padding-left: 0rem;
}

.missions-list a::before {
  content: "→";
  position: absolute;
  left: 0;
  opacity: 0;
  transform: translateX(-1rem);
  transition: all 0.3s ease;
}

.missions-list a:hover {
  padding-left: 2rem;
}

.missions-list a:hover::before {
  opacity: 1;
  transform: translateX(0);
}

.marquee-container img {
  height: 96px;
  margin: 0 5px;
  object-fit: contain;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-content {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 3rem;
  }

  .footer-column {
    text-align: center;
    padding: 0;
  }

  .footer-column h3::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .missions-list a {
    padding-left: 0;
  }

  .missions-list a:hover {
    padding-left: 0;
  }

  .missions-list a::before {
    display: none;
  }

  .contact-info {
    text-align: center;
  }
}
</style>
