<script setup lang="ts">
import { watch } from 'vue';
import { ListContent } from '../types';
const props = defineProps<{
	content: ListContent,
	edit: boolean
}>();
const emit = defineEmits<{ 
	(event: "modified", content: ListContent): void }>()
let list = props.content;
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
		<div v-for="{ image, description } in content.items">
			<div class="image-container">
				<img :src="image" />
			</div>
			<div class="description" v-html="description"></div>
		</div>
	</div>
</template>

<style scoped>
.list > div {
	display: flex;
	height: 344px;
	margin: 8px;
}

.image-container {
	display: flex;
	width: 344px;
	height: 344px;
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
</style>