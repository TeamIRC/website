<script setup lang="ts">
import { vElementVisibility } from '@vueuse/components';
import { ref, watch } from 'vue';
import { ListContent } from '../types';
const props = defineProps<{
	content: ListContent,
	edit: boolean
}>();
const emit = defineEmits<{ 
	(event: "modified", content: ListContent): void }>()
const list = props.content;
const isVisible = ref(new Array<boolean>(list.items.length).fill(false))
function onElementVisibility(state: boolean, element: number) {
  isVisible.value[element] = state;
}
watch(
    () => props.edit,
    () => {
		if (list.items.length != props.content.items.length) {
			emit("modified", list);
			return;
		}
		for (const [i, item] of list.items.entries()) {
			const origin = props.content.items[i];
			if (
				item.description != origin.description ||
				item.image != origin.image
			) {
				emit("modified", list);
				break;
			}
		}
	}
);
</script>

<template>
	<div class="list">
		<div v-for="{ image, title, description }, i in content.items" v-element-visibility="(state: boolean) => onElementVisibility(state, i)">
			<div class="image-container">
				<img :src="image" />
			</div>
			<Teleport v-if="isVisible[i]" to="#main-logo">
				<img class="image-ext" :src="image" />
			</Teleport>
			<div class="item">
				<h2>{{ title }}</h2>
				<div v-html="description"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.image-container {
	display: flex;
	width: 344px;
	min-height: 344px;
	align-items: center;
}

img {
	max-width: 344px;
	max-height: 344px;
	height: auto;
}

.list > div {
	display: flex;
	padding: 8px;
}

.list > div:nth-child(even) {
	flex-direction: row-reverse;
}

.item {
	max-width: calc(80% - 344px);
	margin: auto;
	text-align: center;
}

.image-ext {
	display: none;
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
	.list {
		height: 100%;
	}

	.list > div {
		min-height: 100%;
		scroll-snap-align: start;
	}

	.image-container {
		display: none;
	}
	
	.image-ext {
		display: initial;
	}

	.item {
		max-width: 100%;
	}
}
</style>