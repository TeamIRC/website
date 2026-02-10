<script setup lang="ts">
import { ref, watch } from 'vue';
import { BlogSection } from '../types';
import Editor from '../components/Editor.vue';
import ListBase from '../components/ListBase.vue';
import SVGIcon from '../components/SVGIcon.vue';

const props = defineProps<{
	content: BlogSection,
	edit: boolean
}>();

const emits = defineEmits<{
	(event: "modified", content: BlogSection): void
}>();

const list = ref(props.content);

watch(
    () => props.edit,
    () => {
		if (list.value.items.toString() !== props.content.items.toString())
			emits("modified", list.value);
	}
);
</script>

<template>
    <ListBase :edit="edit" :items="content.items" :empty-item="{
        title: '',
        thumbnail: '',
        author: '',
        date: '',
        summary: '',
        content: '',
        links: []
    }">
        <template #editor="{ index }">
			<input type="text" v-model="list.items[index].thumbnail" placeholder="Image (ex: solo.webp)" />
			<input type="text" v-model="list.items[index].title" placeholder="Titre de l'article" />
			<input type="text" v-model="list.items[index].author" placeholder="Auteur" />
			<input type="text" v-model="list.items[index].date" placeholder="Date (JJ/MM/AAAA)" />
			<textarea v-model="list.items[index].summary" placeholder="Résumé de l'article" rows="3"></textarea>
			<Editor v-model="list.items[index].content" />
		</template>
        <template #item="{ item, index }">
            <router-link class="item-container card v-center" :to="'/' + content.name + '/' + index">
                <img :src="`/contents/${ item.thumbnail }`" :alt="item.title">
                <div class="description">
				    <h2>{{ item.title }}</h2>
                    <div class="meta">
                        <span class="author">Par {{ item.author }}</span>
                        <span class="date">{{ item.date }}</span>
                    </div>
                    <p class="summary">{{ item.summary }}</p>
                    
                    <!-- Afficher les liens internes -->
                    <div v-if="item.links && item.links.length > 0" class="related-links">
                        <SVGIcon name="link" />
                        <span>{{ item.links.length }} lien{{ item.links.length > 1 ? 's' : '' }} interne{{ item.links.length > 1 ? 's' : '' }}</span>
                    </div>
                </div>
			</router-link>
        </template>
    </ListBase>
</template>

<style scoped>
/* ============================================
   STYLES DE BASE - Blog.vue
   ============================================ */

.item-container {
    display: flex;
    gap: 20px;
    width: 100%;
    text-decoration: none;
}

.item-container:hover {
    transform: translateY(-2px);
}

img {
    width: 156px;
    height: 156px;
    object-fit: cover;
	border-radius: 50%;
    border: 2px solid var(--secondary-lt-2);
}

.description {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.description h2 {
    margin: 0 0 4px 0;
    color: var(--primary-lt-3);
    font-size: 1.3em;
}

.meta {
    display: flex;
    gap: 16px;
    font-size: 0.9em;
    color: var(--secondary-lt-2);
    margin-bottom: 4px;
}

.author {
    font-weight: 600;
}

.date {
    font-style: italic;
}

.summary {
    margin: 8px 0;
    color: var(--secondary-lt-3);
    line-height: 1.6;
}

.related-links {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--secondary-lt-1);
    font-size: 0.85em;
    color: var(--primary-lt-2);
    font-weight: 500;
}

.related-links svg {
    width: 16px;
    height: 16px;
    fill: var(--primary-lt-2);
}

.v-center {
    align-items: center;
}

.card {
    text-align: left;
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    transition: 200ms ease-in-out;
}

.card:hover {
    border-color: var(--primary-lt-3);
}

/* Styles pour l'éditeur */
input, textarea {
    width: 100%;
    padding: 10px 14px;
    margin-bottom: 12px;
    background-color: var(--secondary-dk-3);
    border: 1px solid var(--secondary-lt-2);
    border-radius: 4px;
    color: var(--secondary-lt-3);
    font-family: inherit;
}

input:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-lt-3);
}

textarea {
    resize: vertical;
}

/* ============================================
   MODE DARK - Préférence système
   ============================================ */

@media (prefers-color-scheme: dark) {
    .card {
        background-color: #1a1a2e;
        border-color: #3a3a5a;
    }
    
    .card:hover {
        border-color: #6b9eff;
        box-shadow: 0 4px 16px rgba(107, 158, 255, 0.2);
    }
    
    img {
        border-color: #4a4a6a;
    }
    
    .description h2 {
        color: #a8c5ff;
    }
    
    .meta {
        color: #8a8aaa;
    }
    
    .summary {
        color: #b8b8d8;
    }
    
    .related-links {
        border-top-color: #3a3a5a;
        color: #7ab2ff;
    }
    
    .related-links svg {
        fill: #7ab2ff;
    }
    
    input, textarea {
        background-color: #0f0f1e;
        border-color: #3a3a5a;
        color: #d8d8f8;
    }
    
    input:focus, textarea:focus {
        border-color: #6b9eff;
        box-shadow: 0 0 0 3px rgba(107, 158, 255, 0.15);
    }
    
    input::placeholder, textarea::placeholder {
        color: #6a6a8a;
    }
}

/* ============================================
   MODE DARK - Toggle manuel
   Utilise .dark sur html ou [data-theme="dark"]
   ============================================ */

:root[data-theme="dark"] .card,
html.dark .card {
    background-color: #1a1a2e;
    border-color: #3a3a5a;
}

:root[data-theme="dark"] .card:hover,
html.dark .card:hover {
    border-color: #6b9eff;
    box-shadow: 0 4px 16px rgba(107, 158, 255, 0.2);
}

:root[data-theme="dark"] img,
html.dark img {
    border-color: #4a4a6a;
}

:root[data-theme="dark"] .description h2,
html.dark .description h2 {
    color: #a8c5ff;
}

:root[data-theme="dark"] .meta,
html.dark .meta {
    color: #8a8aaa;
}

:root[data-theme="dark"] .summary,
html.dark .summary {
    color: #b8b8d8;
}

:root[data-theme="dark"] .related-links,
html.dark .related-links {
    border-top-color: #3a3a5a;
    color: #7ab2ff;
}

:root[data-theme="dark"] .related-links svg,
html.dark .related-links svg {
    fill: #7ab2ff;
}

:root[data-theme="dark"] input,
:root[data-theme="dark"] textarea,
html.dark input,
html.dark textarea {
    background-color: #0f0f1e;
    border-color: #3a3a5a;
    color: #d8d8f8;
}

:root[data-theme="dark"] input:focus,
:root[data-theme="dark"] textarea:focus,
html.dark input:focus,
html.dark textarea:focus {
    border-color: #6b9eff;
    box-shadow: 0 0 0 3px rgba(107, 158, 255, 0.15);
}

:root[data-theme="dark"] input::placeholder,
:root[data-theme="dark"] textarea::placeholder,
html.dark input::placeholder,
html.dark textarea::placeholder {
    color: #6a6a8a;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media screen and (max-width: 768px) {
    .item-container {
        flex-direction: column;
    }
    
    img {
        width: 100%;
        height: 200px;
        border-radius: 8px;
    }
    
    .card {
        padding: 16px;
        margin-bottom: 16px;
    }
    
    .description {
        gap: 10px;
    }
}
</style>