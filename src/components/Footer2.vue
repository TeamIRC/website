<script setup lang="ts">
const partners: {
  name: string;
  url: string;
  logo: string;
}[] = [
  { name: "France Active", url: "https://www.franceactive.org/", logo: "france-active.png" },
  { name: "BGE Ouest Hérault", url: "https://www.bgeouestherault.fr/", logo: "bge-ouest-herault.png" },
  { name: "Département de l’Hérault", url: "https://herault.fr/", logo: "herault.jpg" },
  { name: "Montpellier 3M", url: "https://www.montpellier3m.fr/", logo: "montpellier-3m.jpg" },
  { name: "Ville de Montpellier", url: "https://www.montpellier.fr/", logo: "Ville_de_Montpellier.png" },
  { name: "Ville de Sète", url: "https://www.sete.fr/", logo: "ville-sete.png" },
  { name: "Ville de Pèzenas", url: "https://www.ville-pezenas.fr/", logo: "pezenas.webp" },
  { name: "Ville de Ganges", url: "https://www.ganges.fr/", logo: "ville-ganges.png" },
  { name: "Ville de Lunel", url: "https://www.lunel.com/", logo: "lunel.png" },
  { name: "Ville de Lavérune", url: "https://www.laverune.fr/", logo: "laverune.png" },
  { name: "Ville de Prades-le-Lez", url: "https://www.prades-le-lez.fr/", logo: "pradeslelez.png" },
  { name: "Cités Éducatives", url: "https://www.citeseducatives.fr/", logo: "cites-educatives.jpg" },
  { name: "Pass Culture", url: "https://www.passculture.app/", logo: "pass-culture.jpg" },
  { name: "FDVA", url: "https://associations.gouv.fr/fonds-pour-le-developpement-de-la-vie-associative-fdva", logo: "fdva.png" },
  { name: "CAF", url: "https://www.caf.fr/", logo: "caf.webp" },
  { name: "Maison des Adolescents de l’Hérault", url: "https://mda34.org/", logo: "mda34.jpeg" },
  { name: "Les Promeneurs du Net", url: "https://www.promeneursdunet.fr/", logo: "pdn.jpg" },
  { name: "CRIJ Hérault", url: "https://www.crij.org/herault/fr/", logo: "crij-herault.png" },
  { name: "Ubisoft", url: "https://www.ubisoft.com/", logo: "ubisoft.webp" },
  { name: "Battlestate Games", url: "https://www.battlestategames.com/", logo: "battlestate-games.jpg" },
  { name: "Yooz", url: "https://www.yooz.fr/", logo: "yooz.png" },
  { name: "France Esports", url: "https://www.france-esports.org/", logo: "france-esports.jpg" },
  { name: "MUC Omnisports", url: "https://www.mucomnisports.fr/", logo: "muc.jpg" },
  { name: "Rocalys Esport", url: "https://www.rocalys-esport.fr/", logo: "rocalys.webp" },
  { name: "Rigel Esport", url: "https://rigelesport.fr/", logo: "rigel-esport.png" },
  { name: "LavaStudios", url: "https://discord.gg/9xgRXSjQwj", logo: "lavastudios.png" },
  { name: "Friendly Fire United", url: "", logo: "ffu.jpg" },
  { name: "Zone-Delta", url: "", logo: "zonedelta.webp" },
  { name: "M8", url: "", logo: "m8.jpg" },
  { name: "Flying Fish Production", url: "https://flyingfishproduction.com/", logo: "FFLOGO.webp" },
  { name: "SPL Occitanie Events", url: "https://www.parc-expo-montpellier.com/occitanie-events/", logo: "sploe.jpg" },
  { name: "Toulouse Game Show", url: "https://tgs-montpellier.fr/", logo: "tgs.png" },
  { name: "PédaGoJeux", url: "https://www.pedagojeux.fr/", logo: "pedagojeux_logo.webp" },
  { name: "UFCV", url: "https://www.ufcv.fr/", logo: "UFCV.webp" },
  { name: "Unapei 34", url: "https://unapei34.org/", logo: "unapei34.jpg" },
  { name: "Gaming Campus", url: "https://gamingcampus.fr/", logo: "gaming-campus.png" },
  { name: "AFPA", url: "https://www.afpa.fr/", logo: "afpa.jpg" },
  { name: "EPSI", url: "https://www.epsi.fr/", logo: "epsi.png" },
  { name: "ISART Digital", url: "https://www.isart.fr/", logo: "isart-digital.jpg" },
  { name: "Epitech", url: "https://www.epitech.eu/", logo: "epitech.png" },
  { name: "ESMA", url: "https://www.esma-artistique.com/", logo: "esma.jpg" }
];
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Contact Column -->
      <div class="footer-column">
        <table class="contact-info">
          <tbody>
            <tr>
              <td><v-icon name="fa-at" /></td>
              <td>
                <a href="mailto:accueil@lesparrainsdunumerique.org">
                  accueil@lesparrainsdunumerique.org
                </a>
              </td>
            </tr>
            <tr>
              <td><v-icon name="fa-phone" /></td>
              <td><a href="tel:+33607949850">06 07 94 98 50</a></td>
            </tr>
            <tr>
              <td><v-icon name="fa-envelope" /></td>
              <td>
                721 rue du Pré aux Clercs <br />
                34000 Montpellier
              </td>
            </tr>
          </tbody>
        </table>
        <router-link to="/association/legal">Mentions légales</router-link>
      </div>

      <!-- Partners Column -->
      <div class="footer-column marquee-container">
        <h3>Ils nous font confiance</h3>
        <Vue3Marquee id="partners" duration="60" clone pauseOnHover>
          <a
            v-for="partner in partners"
            :key="partner.name"
            :href="partner.url"
            :title="partner.name"
            class="partner-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img :src="`/assets/img/${partner.logo}`" :alt="`Logo ${partner.name}`" />
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
  z-index: 1;
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
  margin-bottom: 1rem;
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
    margin-bottom: 0.7rem;
    border-spacing: 0.3rem;
    line-height: 1rem;
}

.marquee-container  {
  min-width: 0px;
}

.partner-link {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0 8px;
}

.partner-link img {
  max-width: 160px;
  max-height: 64px;
  width: auto;
  height: auto;
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
