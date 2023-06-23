<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Editor from './Editor.vue';

const props = defineProps<{ root: string, title: string, page: string }>();
const { content } = await import(`../pages/${props.root}/page-${props.page}.json`);
const edit = ref(false);
localStorage.setItem('origin', useRoute().fullPath);
//const login = localStorage.getItem('login')
const toggleEdit = async () => {
	/*
	if (edit.value) {
		await fetch(window.location.origin + '/api/github/updateFile', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				root: props.root,
				page: props.page,
				content
			})
		})
	}
	*/
	edit.value = !edit.value;
}
</script>

<template>
	<div class="page">
		<div id="title">
			{{ title }}
			<!-- <button v-if="login" -->
			<button
				@click="toggleEdit">
				{{ edit ? "Mettre à jour" : "Editer" }}
			</button>
		</div>
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
../../api/github/updateFile