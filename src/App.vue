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
	background-color: var(--secondary-lt-5);
	color: var(--primary-dk-1);
}
#side-left :deep(a) {
	color: var(--primary-dk-5);
}
#side-left :deep(a:hover) {
	color: var(--primary-dk-2);
}
#side-left :deep(a:focus) {
	color: var(--primary-dk-4);
}
#side-left :deep(a:active),
#side-left :deep(a.router-link-active) {
	color: var(--primary-dk-3);
}

#side-right {
	background-color: var(--secondary-dk-1);
	color: var(--primary-lt-1);
}
#side-right :deep(a) {
	color: var(--primary-lt-5);
}
#side-right :deep(a:hover) {
	color: var(--primary-lt-2);
}
#side-right :deep(a:focus) {
	color: var(--primary-lt-4);
}
#side-right :deep(a:active),
#side-right :deep(a.router-link-active) {
	color: var(--primary-lt-3);
}

#side-left :deep(button) {
    background-color: var(--secondary-lt-4);
    border-color: var(--secondary-dk-4);
}

#side-right :deep(button) {
    background-color: var(--primary-lt-4);
    border-color: var(--primary-dk-4);
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

.menu:hover {
	width: 360px;
}

.menu:hover :deep(> div > nav) {
	display: flex;
}

.menu :deep(> div) {
	position: absolute;
}

#side-left.menu :deep(> div) {
    right: 0;
}

#side-right.menu :deep(> div) {
    left: 0;
}

#side-right :deep(> header) {
    flex-flow: row-reverse;
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
	.side :deep(header),
	.side :deep(main) {
		position: absolute;
	}

	.side :deep(main) {
		top: 33vh;
	}

	#side-right :deep(> header) {
		flex-flow: column;
	}

	#side-left :deep(header),
	#side-left :deep(main) {
		right: 32px;
	}

	#side-right :deep(header),
	#side-right :deep(main) {
		left: 32px;
	}
}
</style>
