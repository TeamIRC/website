import { Component } from "vue";
import cards from "./cards.vue";
import List from "./List.vue";
import WebTV from "./WebTV.vue";
export { default as Base } from './Base.vue';
export default {
    cards,
    List,
    WebTV
} as Record<string, Component>