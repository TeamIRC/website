<script setup lang="ts">
import { watch } from 'vue';
import Editor from '../components/Editor.vue';
const props = defineProps<{ content: string, edit: boolean }>();
const emit = defineEmits<{ (event: "modified", content: string): void }>()
let html = props.content;
watch(
    () => props.edit,
    () => {
		if (html != props.content) {
			console.log(html);
			emit("modified", html)
		}
	}
);
</script>

<template>
	<div>
		<Editor class="content" v-if="edit" v-model="html" />
		<div class="content" v-else v-html="html"></div>
	</div>
</template>

<style>
.content li {
	list-style: none;
	padding-bottom: 16px;
}
</style>