<script setup lang="ts">
import { computed, ref } from "vue";
import { gaming, prevention } from "./pages/sitemap.json";
import { useRoute } from 'vue-router';

const routeRoot = ref(useRoute().fullPath.split('/')[0]);
const root = computed(() => 
	routeRoot.value == "prevention" ? prevention : gaming
);
const side = computed(() => 
	routeRoot.value == "prevention" ? gaming : prevention
);
</script>

<template>
	<div :class="routeRoot">
		<navigation id="side-menu">
			<router-link v-for="route in side" :to="route.path">{{ route.title }}</router-link>
		</navigation>
		<header>
			<navigation id="top-menu">
				<router-link v-for="route in root" :to="route.path">{{ route.title }}</router-link>
			</navigation>
		</header>
		<main>
	
		</main>
		<footer>
	
		</footer>
	</div>
</template>

<style scoped>
.prevention {
	background-color: #eee;
	color: #111;
}

.gaming {
	background-color: #111;
	color: #eee;
}

#side-menu {
	float: right;
	height: 100vh;
}
</style>
