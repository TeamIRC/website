<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Base, default as templates } from '../templates'

const props = defineProps<{ root: string, title: string, page: string }>();
const { template, content } = await import(`../pages/${props.root}/page-${props.page}.json`);
const edit = ref(false);
localStorage.setItem('origin', useRoute().fullPath);
const login = localStorage.getItem('login')
const onModified = async (c: string) => {
	await fetch(
		window.location.origin + '/api/github/updateFile',
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				root: props.root,
				page: props.page,
				content: JSON.stringify({content: c})
			})
		}
	);
};
</script>

<template>
	<div class="page">
		<div id="title">
			{{ title }}
			<button v-if="login"
				@click="edit = !edit">
				{{ edit ? "Mettre-à-jour" : "Editer" }}
			</button>
		</div>
		<component v-if="template"
			:is="templates[template]"
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
	font-size: 2rem;
}
.page {
    height: calc(100vh - 392px);
    overflow-y: auto;
	animation: 1s show;
    margin: 16px 0px;
    padding: 0 16px;
}
@keyframes show {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@media screen and (max-width: 720px) /*Phone media querie*/
{
	.page {
		height: 67vh;
		scroll-snap-type: y mandatory;
    	margin: 0;
	}

	#title {
		display: none;
	}
}
</style>