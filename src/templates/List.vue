<script setup lang="ts">
import { vElementVisibility } from '@vueuse/components';
import { ref, watch } from 'vue';
import { ListContent } from '../types';
import Editor from '../components/Editor.vue';
import SVGIcon from '../components/SVGIcon.vue';
import vDrag from '../vue-dnd/drag';
import vDrop from '../vue-dnd/drop';

const props = defineProps<{
	content: ListContent,
	edit: boolean
}>();
const emit = defineEmits<{ 
	(event: "modified", content: ListContent): void }>()
const listEl = ref<HTMLDivElement>()
const list = ref(props.content);
const isVisible = ref(new Array<boolean>(list.value.items.length).fill(false))
function onElementVisibility(state: boolean, element: number) {
	isVisible.value[element] = state;
}
function arrayMove(arr: Array<any>, old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

const onDrag = (dropzone: Element, el: Element) => {
	const currentList = [...listEl.value!.children];
	arrayMove(
		list.value.items,
		currentList.indexOf(el.closest('.item-line')!),
		currentList.indexOf(dropzone)!);
	setTimeout(() => dropzone.classList.remove('dragover'), 200);
}

watch(
    () => props.edit,
    () => {
		const listValue = list.value;
		if (listValue.items.length != props.content.items.length) {
			emit("modified", listValue);
			return;
		}
		for (const [i, item] of listValue.items.entries()) {
			const origin = props.content.items[i];
			if (
				item.description != origin.description ||
				item.title != origin.title ||
				item.image != origin.image
			) {
				emit("modified", listValue);
				break;
			}
		}
	}
);
</script>

<template>
	<div ref="listEl" class="list" :class="edit ? 'edit' : ''">
		<div class="item-line"
			v-for="{ image, title, description }, i in list.items"
			v-element-visibility="(state: boolean) => onElementVisibility(state, i)"
			v-drop="{ channel: 'list' }"
			:key="title">
			<template v-if="edit">
				<button class="add-button" @click="() => list.items.splice(i, 0, { image: '', title: '', description: '<p></p>'})">
					<SVGIcon name="add-line" width="12" height="12" />
				</button>
				<div class="item-edit">
					<div class="item-move"
						v-drag="{ 
							channels: ['list'],
							filter: (el:HTMLElement) => [el.closest('.item-line')],
							callbacks: {
								effects: [{
									selectors: '.item-line',
									action: onDrag
								}]
							}
						}">
						<SVGIcon name="drag-move-2-fill" width="24" height="24" />
					</div>
					<div class="item-form">
						<input type="text" v-model="list.items[i].image" />
						<input type="text" v-model="list.items[i].title" />
						<Editor v-model="list.items[i].description" />
					</div>
				</div>
			</template>
			<template v-else>
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
			</template>
		</div>
		<button v-if="edit" class="add-button" @click="() => list.items.push({ image: '', title: '', description: '<p></p>'})">
			<SVGIcon name="add-line" width="12" height="12" />
		</button>
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
	min-height: 344px;
}

.list.edit > div {
	flex-direction: column;
}

.list:not(.edit) > div {
	padding: 8px;
}

.add-button {
	height: 16px;
    line-height: 0;
}

.list > .add-button {
	width: 100%;
}

.item-edit {
	display: flex;
	min-height: calc(344px - 16px);
	border: 1px solid var(--1-txt);
    -webkit-user-modify: read-write;
}

.item-form {
	display: flex;
	flex-direction: column;
	width: calc(100% - 33px);
}

.item-move {
	position: relative;
	width: 32px;
	min-height: calc(344px - 16px);
	border-right: 1px solid var(--1-txt);
	-webkit-user-drag: element;
}

.item-move {
	cursor: move;
}

.item-line {
	transition: 200ms;
}

.dragover:not(.dragged) {
	background-color: var(--1-txt);
	color: var(--2-bg);
}

[draggable] {
	user-select: none;
}

.item-move > svg {
	position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
}

.list:not(.edit) > div:nth-child(even) {
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