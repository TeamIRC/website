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
		<div v-for="{ image, description }, i in content.items" v-element-visibility="(state: boolean) => onElementVisibility(state, i)">
			<div class="image-container">
				<img :src="image" />
			</div>
			<Teleport v-if="isVisible[i]" id="image-ext" to="#main-logo">
				<img :src="image" />
			</Teleport>
			<div class="description" v-html="description"></div>
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
	height: auto;
}

.list > div:nth-child(even) {
	flex-direction: row-reverse;
}

.description {
	max-width: calc(80% - 344px);
	margin: auto;
	text-align: center;
}

#image-ext {
	display: none;
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
	.list {
		height: calc(100% - 2rem);
		scroll-snap-type: y mandatory;
	}

	.list > div {
		display: flex;
		height: 100%;
		margin: 8px;
		scroll-snap-align: start;
	}

	.image-container {
		display: none;
	}
	
	#image-ext {
		display: block;
	}

	.description {
		max-width: 100%;
	}
}
</style>