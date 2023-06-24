<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Base from '../templates/Base.vue'

const props = defineProps<{ root: string, title: string, page: string }>();
const { template, content } = await import(`../pages/${props.root}/page-${props.page}.json`);
const edit = ref(false);
localStorage.setItem('origin', useRoute().fullPath);
// const login = localStorage.getItem('login')
const onModified = async () => await fetch(
	window.location.origin + '/api/github/updateFile',
	{
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			root: props.root,
			page: props.page,
			content: JSON.stringify({content})
		})
	}
);
</script>

<template>
	<div class="page">
		<div id="title">
			{{ title }}
			<!-- <button v-if="login" -->
			<button
				@click="edit = !edit">
				{{ edit ? "Mettre à jour" : "Editer" }}
			</button>
		</div>
		<component v-if="template"
			:is="template"
			:content="content"
			:edit="edit"
			@modified="onModified" />
		<Base v-else
			:content="content"
			:edit="edit"
			@modified="onModified" />
	</div>
</template>

<style>
#title {
	text-align: center;
	font-size: 2rem
}
</style>