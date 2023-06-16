<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Side from "./components/Side.vue";
import { gaming, prevention } from "./pages/sitemap.json";
const router = useRouter();
const isPrevention = ref(true);
router.afterEach((to) => isPrevention.value = to.fullPath.split('/')[1] == "prevention")
</script>

<template>
	<Side
		id="side-left"
		:class="isPrevention ? 'current' : 'menu'"
		:current="isPrevention"
		root="prevention"
		:routes="prevention"
		@switch="isPrevention = false" />
	<Side
		id="side-right"
		:class="!isPrevention ? 'current' : 'menu'"
		:current="!isPrevention"
		root="gaming"
		:routes="gaming"
		@switch="isPrevention = true" />
</template>

<style scoped>
.side {
	position: absolute;
	height: 100%;
	transition: width 1s;
}

#side-left {
	background-color: var(--primary-color-bg);
	color: var(--secondary-color-bg);
}

#side-right {
	background-color: var(--secondary-color-bg);
	color: var(--primary-color-bg);
}

.current {
	width: 100%;
}

.menu {
	z-index: 1;
	width: 32px;
}

#side-left {
	left: 0px;
}

#side-right {
	right: 0px;
}

.menu :deep(> nav) {
	display: none;
}

.menu:hover {
	width: 360px;
}

.menu:hover :deep(> nav) {
	display: flex;
}

#side-left.menu :deep(> nav) {
	position: absolute;
    right: 0;
}
</style>
