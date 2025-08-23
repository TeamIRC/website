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
        <router-link to="/mentionslegales">Mentions légales</router-link>
      </div>

      <!-- Partners Column -->
      <div class="footer-column marquee-container">
        <h3>Nos Partenaires</h3>
        <Vue3Marquee id="partners" clone pauseOnHover>
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
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
}

.footer-column {
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

.marquee-container  {
  min-width: 0px;
}

.marquee-container img {
  height: 160px;
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

  .contact-info {
    text-align: center;
  }
}
</style>
