<script setup lang="ts">
import { ref, watch } from 'vue';
import Editor from '../components/Editor.vue';
import { BlogPostContent } from '../types';
const props = defineProps<{ content: BlogPostContent, edit: boolean }>();
const emit = defineEmits<{ (event: "modified", content: BlogPostContent): void }>()
let mutable = ref(props.content);
watch(
    () => props.edit,
    () => {
		if (mutable.value.article != props.content.article)
			emit("modified", mutable.value)
	}
);
</script>

<template>
	<div class="author">{{ mutable.author }} le {{ mutable.date }}</div>
	<Editor v-if="edit" v-model="mutable.article" />
	<article v-else v-html="mutable.article"></article>
</template>

<style scoped>
.author,
:deep(.author) {
	text-align: right;
	font-style: italic;
	margin-bottom: 32px;
	color: var(--secondary-lt-2);
	font-size: 0.95em;
}

article {
	text-align: justify;
	line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
}

:deep(p) {
	text-indent: 48px;
	margin-bottom: 20px;
}

:deep(p::first-letter) {
	font-size: 200%;
	font-weight: 800;
	color: var(--primary-lt-3);
    float: left;
    margin-right: 8px;
    line-height: 1;
}

:deep(blockquote) {
	display: block;
	margin: 48px 10%;
	padding: 24px;
	border-left: 4px solid var(--primary-lt-3);
	background-color: var(--secondary-dk-3);
	color: var(--secondary-lt-3);
	font-style: italic;
	line-height: 1.8;
	border-radius: 0 8px 8px 0;
}

:deep(h1), :deep(h2), :deep(h3) {
	margin: 40px 0 20px;
	color: var(--primary-lt-3);
}

:deep(img) {
	max-width: 100%;
	margin: 32px auto;
	display: block;
	border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}
</style>