<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Editor from './Editor.vue';

const props = defineProps<{ root: string, title: string, page: string }>();
const { content } = await import(`../pages/${props.root}/page-${props.page}.json`);
const edit = ref(false);
localStorage.setItem('origin', useRoute().fullPath);
</script>

<template>
  <div class="page">
    <button @click="edit = !edit">Editer</button>
    <div id="title">{{ title }}</div>
    <Editor v-if="edit" v-model="content" />
    <div v-else v-html="content"></div>
  </div>
</template>

<style>
#title {
  text-align: center;
  font-size: 2rem
}
</style>
