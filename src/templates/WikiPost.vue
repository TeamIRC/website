<script setup lang="ts">
import { ref, computed, watch, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WikiLinkPreview from '../components/WikiLinkPreview.vue';
import { Route, WikiPostContent } from '../types';

const props = defineProps<{ 
	content: WikiPostContent, 
	edit: boolean
}>();

const emit = defineEmits<{ (event: "modified", template: string, content: WikiPostContent): void }>();
const router = useRouter();
const sitemapData = useRoute().meta.sitemap as { $r: Route[] };
let mutable = ref(props.content);

watch(
    () => props.edit,
    () => {
		if (mutable.value.article != props.content.article)
			emit("modified", "WikiPost", mutable.value)
	}
);

/**
 * Parse le contenu HTML pour détecter les liens internes
 * Format: [[chemin/vers/page|Texte du lien]] ou [[chemin/vers/page]]
 */
const parseInternalLinks = (html: string) => {
	const linkPattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
	let parsedHtml = html;
	const matches = Array.from(html.matchAll(linkPattern));
	
	matches.forEach(match => {
		const fullMatch = match[0];
		const path = match[1].trim();
		const text = match[2]?.trim() || path.split('/').pop() || path;
		
		const pageInfo = findPageInSitemap(path);
		
		if (pageInfo) {
			const placeholder = `___WIKI_LINK_${Math.random().toString(36).substr(2, 9)}___`;
			parsedHtml = parsedHtml.replace(fullMatch, placeholder);
			parsedHtml = parsedHtml.replace(
				placeholder,
				`<span class="wiki-internal-link" data-path="${path}" data-title="${pageInfo.title}" data-description="${pageInfo.description || ''}">${text}</span>`
			);
		} else {
			parsedHtml = parsedHtml.replace(
				fullMatch,
				`<span class="wiki-broken-link" title="Page non trouvée: ${path}">${text}</span>`
			);
		}
	});
	
	return parsedHtml;
};

/**
 * Cherche une page dans le sitemap
 */
const findPageInSitemap = (path: string): { title: string, description?: string, fullPath: string } | null => {
	if (!sitemapData?.$r) return null;
	
	const parts = path.split('/');
	
	for (const route of sitemapData.$r) {
		if (parts.length === 1 && route.path === parts[0]) {
			return {
				title: route.title,
				description: route.description,
				fullPath: `/${route.path}`
			};
		}
		
		if (parts.length === 2 && route.path === parts[0] && route.children) {
			const child = route.children.find((c: any) => c.path === parts[1]);
			if (child) {
				return {
					title: child.title,
					description: child.description,
					fullPath: `/${route.path}/${child.path}`
				};
			}
		}
	}
	
	return null;
};

/**
 * Rend le HTML avec les composants Vue pour les liens internes
 */
const renderContent = computed(() => {
	if (props.edit) return null;
	
	const parsedHtml = parseInternalLinks(mutable.value.article);
	const temp = document.createElement('div');
	temp.innerHTML = parsedHtml;
	
	const internalLinks = temp.querySelectorAll('.wiki-internal-link');
	
	if (internalLinks.length === 0) {
		return h('article', { innerHTML: parsedHtml });
	}
	
	const children: any[] = [];
	let currentHtml = '';
	
	const processNode = (node: Node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			currentHtml += node.textContent;
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as HTMLElement;
			
			if (element.classList.contains('wiki-internal-link')) {
				if (currentHtml) {
					children.push(h('span', { innerHTML: currentHtml }));
					currentHtml = '';
				}
				
				const path = element.dataset.path || '';
				const title = element.dataset.title || '';
				const description = element.dataset.description || '';
				const text = element.textContent || '';
				const fullPath = findPageInSitemap(path)?.fullPath || `/${path}`;
				
				children.push(
					h(WikiLinkPreview, {
						path: fullPath,
						title: title,
						description: description
					}, {
						default: () => h('a', {
							href: fullPath,
							class: 'wiki-link',
							onClick: (e: Event) => {
								e.preventDefault();
								router.push(fullPath);
							}
						}, text)
					})
				);
			} else if (element.classList.contains('wiki-broken-link')) {
				if (currentHtml) {
					children.push(h('span', { innerHTML: currentHtml }));
					currentHtml = '';
				}
				
				children.push(
					h('span', {
						class: 'wiki-broken-link',
						title: element.title
					}, element.textContent)
				);
			} else {
				const tagName = element.tagName.toLowerCase();
				const attrs: any = {};
				
				Array.from(element.attributes).forEach(attr => {
					attrs[attr.name] = attr.value;
				});
				
				const childNodes: any[] = [];
				element.childNodes.forEach(child => {
					if (child.nodeType === Node.TEXT_NODE) {
						childNodes.push(child.textContent);
					} else if (child.nodeType === Node.ELEMENT_NODE) {
						const childElement = child as HTMLElement;
						if (childElement.classList.contains('wiki-internal-link') || 
						    childElement.classList.contains('wiki-broken-link')) {
							if (currentHtml) {
								children.push(h('span', { innerHTML: currentHtml }));
								currentHtml = '';
							}
							processNode(child);
						} else {
							childNodes.push(child);
						}
					}
				});
				
				if (childNodes.length > 0) {
					currentHtml += element.outerHTML;
				}
			}
		}
	};
	
	temp.childNodes.forEach(processNode);
	
	if (currentHtml) {
		children.push(h('span', { innerHTML: currentHtml }));
	}
	
	return h('article', {}, children);
});
</script>

<template>
	<div class="author">{{ mutable.author }} le {{ mutable.date }}</div>
	<div v-if="edit">
		<div class="wiki-syntax-help">
			💡 <strong>Syntaxe des liens internes :</strong> 
			<code>[[chemin/page|Texte]]</code> ou <code>[[chemin/page]]</code>
			<br>Exemple : <code>[[sensibilisation/emi|Éducation aux Médias]]</code>
		</div>
		<textarea v-model="mutable.article" rows="20"></textarea>
	</div>
	<component v-else :is="renderContent" />
</template>

<style scoped>
.author,
:deep(.author) {
	text-align: right;
	font-style: italic;
}

article {
	text-align: justify;
}

:deep(p) {
	text-indent: 64px;
}

:deep(p::first-letter) {
	font-size: 150%;
	font-weight: bolder;
	color: var(--secondary-lt-3);
}

:deep(blockquote) {
	display: block;
	margin: 32px;
	padding: 16px;
	border: 1px solid var(--secondary-lt-3);
	background-color: var(--secondary-dk-3);
	color: var(--secondary-lt-3);
	font-size: .95em;
	font-style: italic;
	line-height: 1.9em;
	text-indent: 64px;
}

:deep(.quote::before),
:deep(.quote::after) {
	content: "\FF02";
	color: var(--secondary-lt-4);
	font-size: 150%;
	font-weight: bolder;
}

:deep(.author::before) {
	content: "- ";
}

/* Styles pour les liens internes Wiki */
:deep(.wiki-link) {
	color: var(--primary-lt-3);
	text-decoration: none;
	border-bottom: 2px dotted var(--primary-lt-3);
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	padding: 2px 4px;
	border-radius: 4px;
}

:deep(.wiki-link:hover) {
	background-color: var(--primary-lt-3);
	color: var(--secondary-dk-3);
	border-bottom-style: solid;
}

:deep(.wiki-broken-link) {
	color: #dc3545;
	text-decoration: line-through;
	cursor: not-allowed;
	padding: 2px 4px;
}

/* Info box pour la syntaxe en mode édition */
.wiki-syntax-help {
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 8px;
	padding: 12px;
	margin-bottom: 16px;
	font-size: 0.9em;
	color: var(--secondary-lt-3);
}

.wiki-syntax-help code {
	background-color: var(--secondary-dk-3);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
	color: var(--primary-lt-3);
}

/* Style pour le textarea en mode édition */
textarea {
	width: 100%;
	padding: 12px;
	background-color: var(--secondary-dk-3);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 4px;
	color: var(--secondary-lt-3);
	font-family: monospace;
	font-size: 0.9em;
	resize: vertical;
	min-height: 400px;
}

textarea:focus {
	outline: none;
	border-color: var(--primary-lt-3);
}
</style>