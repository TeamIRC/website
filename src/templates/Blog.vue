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
.item-container {
    display: flex;
    gap: 16px;
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
    gap: 8px;
}

.description h2 {
    margin: 0;
    color: var(--primary-lt-3);
    font-size: 1.3em;
}

.meta {
    display: flex;
    gap: 12px;
    font-size: 0.9em;
    color: var(--secondary-lt-2);
}

.author {
    font-weight: 600;
}

.date {
    font-style: italic;
}

.summary {
    margin: 0;
    color: var(--secondary-lt-3);
    line-height: 1.5;
}

.related-links {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    padding-top: 8px;
    border-top: 1px solid var(--secondary-lt-1);
    font-size: 0.85em;
    color: var(--primary-lt-3);
}

.related-links svg {
    width: 16px;
    height: 16px;
    fill: var(--primary-lt-3);
}

.v-center {
    align-items: center;
}

.card {
    text-align: left;
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
    padding: 16px;
    transition: 200ms ease-in-out;
}

.card:hover {
    border-color: var(--primary-lt-3);
}

/* Styles pour l'éditeur */
input, textarea {
    width: 100%;
    padding: 8px 12px;
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

@media screen and (max-width: 768px) {
    .item-container {
        flex-direction: column;
    }
    
    img {
        width: 100%;
        height: 200px;
        border-radius: 8px;
    }
}
</style>