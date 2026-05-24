<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CSSProperties } from 'vue';

defineProps<{
	path: string;
	title: string;
	description?: string;
}>();

const preview = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const position = ref({ x: 0, y: 0 });

const previewStyle = computed<CSSProperties>(() => ({
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
/* ============================================
   STYLES DE BASE - WikiLinkPreview.vue
   ============================================ */

.wiki-link-wrapper {
	display: inline;
	position: relative;
}

/* ============================================
   TOOLTIP - MODE LIGHT (par défaut)
   PLUS GRAND et moderne
   ============================================ */

.wiki-link-preview {
	position: absolute;
	z-index: 9999;
	width: 520px; /* Augmenté de 420px à 520px */
	max-width: 95vw;
	
	/* Couleurs mode light */
	background-color: #ffffff;
	border: 2px solid var(--secondary-lt-2);
	border-top: 5px solid var(--primary-lt-3); /* Barre d'accentuation plus épaisse */
	
	border-radius: 16px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1);
	transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
	overflow: hidden;
	backdrop-filter: blur(10px);
}

/* En-tête - MODE LIGHT */
.preview-header {
	background: linear-gradient(135deg, var(--secondary-dk-1) 0%, var(--secondary-dk-2) 100%);
	padding: 24px 28px; /* Augmenté de 20px 24px */
	border-bottom: 1px solid var(--secondary-lt-1);
}

.preview-header h3 {
	margin: 0;
	font-size: 1.5em; /* Augmenté de 1.35em */
	color: var(--primary-lt-3);
	font-weight: 700;
	letter-spacing: -0.02em;
}

/* Contenu - MODE LIGHT */
.preview-content {
	padding: 28px; /* Augmenté de 24px */
	max-height: 320px; /* Augmenté de 280px */
	overflow-y: auto;
	color: var(--secondary-lt-4);
	line-height: 1.75; /* Augmenté de 1.7 */
	font-size: 1.05em; /* Texte légèrement plus grand */
}

.preview-content p {
	margin: 0;
}

.preview-content .no-description {
	font-style: italic;
	color: var(--secondary-lt-2);
	opacity: 0.7;
}

/* Scrollbar personnalisée - MODE LIGHT */
.preview-content::-webkit-scrollbar {
	width: 8px;
}

.preview-content::-webkit-scrollbar-track {
	background: var(--secondary-dk-1);
	border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb {
	background: var(--secondary-lt-2);
	border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
	background: var(--primary-lt-2);
}

/* Footer - MODE LIGHT */
.preview-footer {
	padding: 16px 28px; /* Augmenté de 12px 24px */
	background: linear-gradient(135deg, var(--secondary-dk-1) 0%, var(--secondary-dk-2) 100%);
	border-top: 1px solid var(--secondary-lt-1);
}

.preview-path {
	font-size: 0.9em; /* Augmenté de 0.85em */
	color: var(--primary-lt-2);
	font-family: 'Fira Code', 'Courier New', monospace;
	font-weight: 600;
	display: flex;
	align-items: center;
}

.preview-path::before {
	content: "🔗";
	margin-right: 10px; /* Augmenté de 8px */
	font-size: 1em;
	opacity: 0.8;
}

/* ============================================
   MODE DARK - Préférence système
   ============================================ */

@media (prefers-color-scheme: dark) {
	.wiki-link-preview {
		background-color: #1a1a2e;
		border-color: #3a3a5a;
		border-top-color: #6b9eff;
		box-shadow: 0 20px 70px rgba(0, 0, 0, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4);
	}
	
	.preview-header {
		background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
		border-bottom-color: #3a3a5a;
	}
	
	.preview-header h3 {
		color: #a8c5ff;
	}
	
	.preview-content {
		color: #c8c8e8;
		background-color: #1a1a2e;
	}
	
	.preview-content .no-description {
		color: #7a7a9a;
	}
	
	/* Scrollbar dark */
	.preview-content::-webkit-scrollbar-track {
		background: #0f0f1e;
	}
	
	.preview-content::-webkit-scrollbar-thumb {
		background: #4a4a6a;
	}
	
	.preview-content::-webkit-scrollbar-thumb:hover {
		background: #6b9eff;
	}
	
	.preview-footer {
		background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
		border-top-color: #3a3a5a;
	}
	
	.preview-path {
		color: #7ab2ff;
	}
	
	.preview-path::before {
		opacity: 1;
		filter: brightness(1.2);
	}
}

/* ============================================
   MODE DARK - Toggle manuel
   Utilise .dark sur html ou [data-theme="dark"]
   ============================================ */

:root[data-theme="dark"] .wiki-link-preview,
html.dark .wiki-link-preview {
	background-color: #1a1a2e;
	border-color: #3a3a5a;
	border-top-color: #6b9eff;
	box-shadow: 0 20px 70px rgba(0, 0, 0, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4);
}

:root[data-theme="dark"] .preview-header,
html.dark .preview-header {
	background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
	border-bottom-color: #3a3a5a;
}

:root[data-theme="dark"] .preview-header h3,
html.dark .preview-header h3 {
	color: #a8c5ff;
}

:root[data-theme="dark"] .preview-content,
html.dark .preview-content {
	color: #c8c8e8;
	background-color: #1a1a2e;
}

:root[data-theme="dark"] .preview-content .no-description,
html.dark .preview-content .no-description {
	color: #7a7a9a;
}

/* Scrollbar dark - Toggle manuel */
:root[data-theme="dark"] .preview-content::-webkit-scrollbar-track,
html.dark .preview-content::-webkit-scrollbar-track {
	background: #0f0f1e;
}

:root[data-theme="dark"] .preview-content::-webkit-scrollbar-thumb,
html.dark .preview-content::-webkit-scrollbar-thumb {
	background: #4a4a6a;
}

:root[data-theme="dark"] .preview-content::-webkit-scrollbar-thumb:hover,
html.dark .preview-content::-webkit-scrollbar-thumb:hover {
	background: #6b9eff;
}

:root[data-theme="dark"] .preview-footer,
html.dark .preview-footer {
	background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
	border-top-color: #3a3a5a;
}

:root[data-theme="dark"] .preview-path,
html.dark .preview-path {
	color: #7ab2ff;
}

:root[data-theme="dark"] .preview-path::before,
html.dark .preview-path::before {
	opacity: 1;
	filter: brightness(1.2);
}

/* ============================================
   ANIMATIONS ET EFFETS
   ============================================ */

.wiki-link-preview {
	animation: fadeInScale 0.25s ease-out;
}

@keyframes fadeInScale {
	from {
		opacity: 0;
		transform: scale(0.95) translateY(-5px);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media screen and (max-width: 768px) {
	.wiki-link-preview {
		width: 420px; /* Réduit sur mobile */
		max-width: 90vw;
	}
	
	.preview-header {
		padding: 20px 24px;
	}
	
	.preview-header h3 {
		font-size: 1.3em;
	}
	
	.preview-content {
		padding: 24px;
		max-height: 280px;
		font-size: 1em;
	}
	
	.preview-footer {
		padding: 14px 24px;
	}
	
	.preview-path {
		font-size: 0.85em;
	}
}

@media screen and (max-width: 480px) {
	.wiki-link-preview {
		width: 100%;
		max-width: 95vw;
		left: 2.5vw !important;
		right: 2.5vw !important;
	}
}
</style>
