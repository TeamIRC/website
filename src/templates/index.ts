import { Component } from "vue";
import cards from "./cards.vue";
import List from "./List.vue";
import WebTV from "./WebTV.vue";
import Carrousel from "./Carrousel.vue";
import Gallery from "./Gallery.vue";
import Quote from "./Quote.vue";
import Video from "./Video.vue";
import IAEthics from "./IAEthics.vue";
import IALanding from "./IALanding.vue";
import IARecommendations from "./IARecommendations.vue";
import IATools from "./IATools.vue";

export { default as Base } from './Base.vue';
export default {
    cards,
    List,
    WebTV,
    Carrousel,
    Gallery,
    Quote,
    Video,
    IAEthics,
    IALanding,
    IARecommendations,
    IATools
    
} as Record<string, Component>