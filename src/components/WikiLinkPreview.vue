<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
	path: string;
	title: string;
	description?: string;
}>();

const preview = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const position = ref({ x: 0, y: 0 });

const previewStyle = computed(() => ({
	left: `${position.value.x}px`,
	top: `${position.value.y}px`,
	opacity: isVisible.value ? '1' : '0',
	pointerEvents: isVisible.value ? 'auto' : 'none'
}));

const showPreview = (event: MouseEvent) => {
	const element = event.currentTarget as HTMLElement;
	const rect = element.getBoundingClientRect();
	
	position.value = {
		x: rect.right + 10,
		y: rect.top + window.scrollY
	};
	
	isVisible.value = true;
};

const hidePreview = () => {
	isVisible.value = false;
};

const updatePosition = (event: MouseEvent) => {
	if (!isVisible.value) return;
	
	const element = event.currentTarget as HTMLElement;
	const rect = element.getBoundingClientRect();
	
	let x = rect.right + 10;
	let y = rect.top + window.scrollY;
	
	if (preview.value) {
		const previewRect = preview.value.getBoundingClientRect();
		
		if (x + previewRect.width > window.innerWidth) {
			x = rect.left - previewRect.width - 10;
		}
		
		if (y + previewRect.height > window.scrollY + window.innerHeight) {
			y = window.scrollY + window.innerHeight - previewRect.height - 10;
		}
	}
	
	position.value = { x, y };
};
</script>

<template>
	<span 
		class="wiki-link-wrapper"
		@mouseenter="showPreview"
		@mouseleave="hidePreview"
		@mousemove="updatePosition"
	>
		<slot></slot>
		
		<Teleport to="body">
			<div 
				ref="preview"
				class="wiki-link-preview"
				:style="previewStyle"
			>
				<div class="preview-header">
					<h3>{{ title }}</h3>
				</div>
				<div class="preview-content">
					<p v-if="description">{{ description }}</p>
					<p v-else class="no-description">Aucune description disponible</p>
				</div>
				<div class="preview-footer">
					<span class="preview-path">{{ path }}</span>
				</div>
			</div>
		</Teleport>
	</span>
</template>

<style scoped>
.wiki-link-wrapper {
	display: inline;
	position: relative;
}

.wiki-link-preview {
	position: absolute;
	z-index: 9999;
	width: 320px;
	max-width: 90vw;
	background-color: var(--secondary-dk-1);
	border: 2px solid var(--primary-lt-3);
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
	transition: opacity 0.2s ease-in-out;
	overflow: hidden;
}

.preview-header {
	background: linear-gradient(135deg, var(--primary-lt-3) 0%, var(--primary-lt-2) 100%);
	padding: 12px 16px;
	border-bottom: 1px solid var(--secondary-lt-2);
}

.preview-header h3 {
	margin: 0;
	font-size: 1.1em;
	color: var(--secondary-dk-3);
	font-weight: 600;
}

.preview-content {
	padding: 16px;
	max-height: 200px;
	overflow-y: auto;
}

.preview-content p {
	margin: 0;
	color: var(--secondary-lt-3);
	line-height: 1.6;
	font-size: 0.95em;
}

.preview-content .no-description {
	font-style: italic;
	color: var(--secondary-lt-2);
}

.preview-footer {
	padding: 8px 16px;
	background-color: var(--secondary-dk-2);
	border-top: 1px solid var(--secondary-lt-1);
}

.preview-path {
	font-size: 0.85em;
	color: var(--secondary-lt-2);
	font-family: monospace;
}

/* Scrollbar */
.preview-content::-webkit-scrollbar {
	width: 6px;
}

.preview-content::-webkit-scrollbar-track {
	background: var(--secondary-dk-2);
}

.preview-content::-webkit-scrollbar-thumb {
	background: var(--secondary-lt-2);
	border-radius: 3px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
	background: var(--secondary-lt-3);
}
</style>