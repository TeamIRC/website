import { Component } from "vue";
import cards from "./cards.vue";
import List from "./List.vue";
import WebTV from "./WebTV.vue";
import Carrousel from "./Carrousel.vue";
import Gallery from "./Gallery.vue";
import Quote from "./Quote.vue";
import Video from "./Video.vue";
import Hero from "./Hero.vue";
import CardGrid from "./CardGrid.vue";

export { default as Base } from './Base.vue';
export default {
    cards,
    List,
    WebTV,
    Carrousel,
    Gallery,
    Quote,
    Video,
    Hero,
    CardGrid
    
} as Record<string, Component>