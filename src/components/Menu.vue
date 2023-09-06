<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
    root: {
        type: String,
        required: true
    },
    routes: {
        type: Array as PropType<{ path:string, title: string }[]>,
        required: true
    }
});
</script>

<template>
  	<nav class="menu">
		<router-link
			v-for="route in routes"
			:to="`/${root}/${route.path}`">
			{{ route.title }}
		</router-link>
	</nav>
</template>

<style scoped>
nav {
	display: flex;
	flex-direction: column;
  	text-align: center;
	font-size: 1.125rem;
	margin: auto;
}

a {
	transition: font-size 1s;
}

a:hover {
	font-size: 1.1875rem;
}

a.router-link-active{
	font-size: 1.25rem;
}
</style>