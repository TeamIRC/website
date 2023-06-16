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
const emits = defineEmits(["navigate"])
</script>

<template>
  <nav class="menu">
			<router-link
				v-for="route in routes"
        @click="emits('navigate')"
				:to="`/${root}/${route.path}`"
			>
				{{ route.title }}
			</router-link>
	</nav>
</template>

<style scoped>
nav {
	display: flex;
	flex-direction: column;
  text-align: center;
	font-size: 1.25rem;
	margin: auto;
	padding: 32px;
}
</style>