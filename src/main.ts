import { OhVueIcon, addIcons } from "oh-vue-icons";
import { 
    FaLinkedinIn,
    FaTwitter,
    FaInstagram,
    FaFacebookF,
    FaBars,
    FaTimes,
    FaSun,
    FaMoon,
    FaAt,
    FaPhone,
    FaEnvelope,
} from "oh-vue-icons/icons";
import { createApp } from 'vue'
import Vue3Marquee from "vue3-marquee"
import './normalize.css'
import './style.css'
import App from './App.vue'
import router from './router'

addIcons(
    FaLinkedinIn,
    FaTwitter,
    FaInstagram,
    FaFacebookF,
    FaBars,
    FaTimes,
    FaSun,
    FaMoon,
    FaAt,
    FaPhone,
    FaEnvelope,
);

createApp(App)
    .use(router)
    .component("v-icon", OhVueIcon)
    .use(Vue3Marquee)
    .mount('#app')
