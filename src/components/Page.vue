<script setup lang="ts">
import { ref } from 'vue';
import Editor from './Editor.vue';

const props = defineProps<{ root: string, page: string }>();
const { title, content } = await import(`../pages/${props.root}/page-${props.page}.json`);
const edit = ref(false);
</script>

<template>
  <div class="page">
    <button @click="edit = !edit">Editer</button>
    <div id="title">{{ title }}</div>
    <Editor v-if="edit" v-model="content" />
    <div v-else v-html="content"></div>
  </div>
</template>

<style scoped>
#title {
  font-size: 1.5rem
}
</style>
