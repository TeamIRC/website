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

.current {
	width: 100%;
}

.menu {
	z-index: 1;
	transition: width 1s;
	width: 32px;
}

.menu:not(.active) {
	animation: 4s infinite bounce;
}

#side-left {
	left: 0px;
}

#side-right {
	right: 0px;
}

@keyframes bounce {
  from {
    width: 32px;
  }
  75% {
    width: 32px;
  }
  90% {
    width: 40px;
  }
  to {
    width: 32px;
  }
}

.menu.active {
	animation-play-state: paused;
	width: 360px;
}

#side-left.menu :deep(.side-menu) {
    right: 0;
}

#side-right.menu :deep(.side-menu) {
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
