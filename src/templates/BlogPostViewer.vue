<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { BlogPost } from '../types';

const props = defineProps<{
    articles: BlogPost[]
}>();

const route = useRoute();
const articleIndex = computed(() => {
    const path = route.path.split('/');
    return parseInt(path[path.length - 1]);
});

const article = computed(() => props.articles[articleIndex.value]);

const relatedArticles = computed(() => {
    if (!article.value?.links) return [];
    
    // Trouver les articles correspondant aux liens
    return article.value.links
        .map(link => {
            // Si c'est un lien vers un autre article du blog
            if (link.startsWith('/blog/')) {
                const idx = parseInt(link.split('/').pop() || '');
                return props.articles[idx];
            }
            // Si c'est un lien vers une autre page du site
            return null;
        })
        .filter(a => a !== null && a !== undefined) as BlogPost[];
});

const externalLinks = computed(() => {
    if (!article.value?.links) return [];
    
    // Récupérer les liens vers d'autres pages du site
    return article.value.links
        .filter(link => !link.startsWith('/blog/'))
        .map(link => {
            // Extraire le nom de la page depuis l'URL
            const parts = link.split('/').filter(p => p);
            const pageName = parts[parts.length - 1];
            return {
                url: link,
                name: formatPageName(pageName)
            };
        });
});

const formatPageName = (name: string) => {
    const names: Record<string, string> = {
        'home': 'Qui sommes-nous',
        'web-tv': 'Web TV',
        'valorant': 'Équipe Valorant',
        'rocket-league': 'Équipe Rocket League',
        'fortnite': 'Équipe Fortnite',
        'legal': 'Mentions légales'
    };
    return names[name] || name;
};
</script>

<template>
    <div v-if="article" class="article-view">
        <article class="article-content">
            <header class="article-header">
                <img 
                    v-if="article.thumbnail" 
                    :src="`/contents/${article.thumbnail}`" 
                    :alt="article.title"
                    class="article-cover" />
                
                <h1>{{ article.title }}</h1>
                
                <div class="article-meta">
                    <span class="author">Par {{ article.author }}</span>
                    <span class="separator">•</span>
                    <span class="date">{{ article.date }}</span>
                </div>
            </header>

            <div class="article-body" v-html="article.content"></div>
        </article>

        <!-- Section des liens vers d'autres pages -->
        <aside v-if="externalLinks.length > 0" class="external-links">
            <h2>Pages liées</h2>
            <div class="links-grid">
                <router-link
                    v-for="link in externalLinks"
                    :key="link.url"
                    :to="link.url"
                    class="link-card">
                    <span>{{ link.name }}</span>
                    <span class="arrow">→</span>
                </router-link>
            </div>
        </aside>

        <!-- Section des articles liés -->
        <aside v-if="relatedArticles.length > 0" class="related-articles">
            <h2>Articles liés</h2>
            <div class="related-grid">
                <router-link
                    v-for="(related, idx) in relatedArticles"
                    :key="idx"
                    :to="'/blog/' + props.articles.indexOf(related)"
                    class="related-card">
                    <img 
                        v-if="related.thumbnail" 
                        :src="`/contents/${related.thumbnail}`" 
                        :alt="related.title" />
                    <div class="related-info">
                        <h3>{{ related.title }}</h3>
                        <p>{{ related.summary }}</p>
                        <span class="read-more">Lire l'article →</span>
                    </div>
                </router-link>
            </div>
        </aside>

        <!-- Bouton retour -->
        <router-link to="/blog" class="back-link">
            ← Retour aux articles
        </router-link>
    </div>
    <div v-else class="error-state">
        <h2>Article introuvable</h2>
        <p>L'article demandé n'existe pas ou a été supprimé.</p>
        <router-link to="/blog">Retour aux articles</router-link>
    </div>
</template>

<style scoped>
.article-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 16px;
}

.article-content {
    background-color: var(--secondary-dk-2);
    border: 1px solid var(--secondary-lt-2);
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 32px;
}

.article-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 2px solid var(--secondary-lt-2);
}

.article-cover {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 24px;
}

.article-header h1 {
    margin: 0 0 16px 0;
    color: var(--primary-lt-3);
    font-size: 2.5em;
    line-height: 1.2;
}

.article-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--secondary-lt-2);
    font-size: 0.95em;
}

.article-meta .author {
    font-weight: 600;
    color: var(--secondary-lt-3);
}

.separator {
    color: var(--secondary-lt-1);
}

.article-body {
    color: var(--secondary-lt-3);
    line-height: 1.8;
    font-size: 1.05em;
}

.article-body :deep(h2) {
    margin-top: 32px;
    margin-bottom: 16px;
    color: var(--primary-lt-3);
}

.article-body :deep(h3) {
    margin-top: 24px;
    margin-bottom: 12px;
    color: var(--primary-lt-4);
}

.article-body :deep(h4) {
    margin-top: 20px;
    margin-bottom: 10px;
    color: var(--primary-lt-4);
}

.article-body :deep(p) {
    margin-bottom: 16px;
}

.article-body :deep(ul),
.article-body :deep(ol) {
    margin: 16px 0;
    padding-left: 24px;
}

.article-body :deep(li) {
    margin-bottom: 8px;
}

.article-body :deep(a) {
    color: var(--primary-lt-3);
    text-decoration: underline;
    transition: 200ms;
}

.article-body :deep(a:hover) {
    color: var(--primary-lt-2);
}

.article-body :deep(a[data-internal-link="true"]) {
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid var(--primary-lt-3);
    padding-bottom: 2px;
}

.article-body :deep(a[data-internal-link="true"]:hover) {
    border-bottom-color: var(--primary-lt-2);
    color: var(--primary-lt-2);
}

.article-body :deep(strong) {
    color: var(--secondary-lt-4);
    font-weight: 700;
}

.article-body :deep(em) {
    color: var(--secondary-lt-2);
}

.external-links,
.related-articles {
    background-color: var(--secondary-dk-3);
    border: 1px solid var(--secondary-lt-2);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
}

.external-links h2,
.related-articles h2 {
    margin: 0 0 16px 0;
    color: var(--primary-lt-4);
    font-size: 1.5em;
}

.links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.link-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--secondary-dk-2);
    border: 1px solid var(--secondary-lt-2);
    border-radius: 8px;
    text-decoration: none;
    color: var(--primary-lt-3);
    font-weight: 600;
    transition: 200ms;
}

.link-card:hover {
    background-color: var(--secondary-dk-1);
    border-color: var(--primary-lt-3);
    transform: translateX(4px);
}

.link-card .arrow {
    font-size: 1.2em;
}

.related-grid {
    display: grid;
    gap: 16px;
}

.related-card {
    display: flex;
    gap: 16px;
    padding: 16px;
    background-color: var(--secondary-dk-2);
    border: 1px solid var(--secondary-lt-2);
    border-radius: 8px;
    text-decoration: none;
    transition: 200ms;
}

.related-card:hover {
    background-color: var(--secondary-dk-1);
    border-color: var(--primary-lt-3);
    transform: translateX(4px);
}

.related-card img {
    width: 120px;
    height: 90px;
    object-fit: cover;
    border-radius: 4px;
}

.related-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.related-info h3 {
    margin: 0;
    color: var(--primary-lt-3);
    font-size: 1.1em;
}

.related-info p {
    margin: 0;
    color: var(--secondary-lt-2);
    font-size: 0.9em;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.read-more {
    margin-top: auto;
    color: var(--primary-lt-3);
    font-size: 0.9em;
    font-weight: 600;
}

.back-link {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    background-color: var(--secondary-dk-2);
    border: 1px solid var(--secondary-lt-2);
    border-radius: 8px;
    color: var(--secondary-lt-3);
    text-decoration: none;
    font-weight: 600;
    transition: 200ms;
}

.back-link:hover {
    background-color: var(--secondary-dk-1);
    border-color: var(--primary-lt-3);
    color: var(--primary-lt-3);
}

.error-state {
    max-width: 600px;
    margin: 64px auto;
    padding: 48px;
    text-align: center;
    background-color: var(--secondary-dk-2);
    border: 1px solid var(--secondary-lt-2);
    border-radius: 8px;
}

.error-state h2 {
    margin: 0 0 16px 0;
    color: var(--red-lt3);
}

.error-state p {
    margin: 0 0 24px 0;
    color: var(--secondary-lt-2);
}

.error-state a {
    display: inline-block;
    padding: 12px 24px;
    background-color: var(--primary-dk-3);
    border: 1px solid var(--primary-lt-3);
    border-radius: 4px;
    color: var(--primary-lt-3);
    text-decoration: none;
    font-weight: 600;
    transition: 200ms;
}

.error-state a:hover {
    background-color: var(--primary-dk-2);
}

@media screen and (max-width: 768px) {
    .article-content {
        padding: 24px 16px;
    }

    .article-header h1 {
        font-size: 2em;
    }

    .related-card {
        flex-direction: column;
    }

    .related-card img {
        width: 100%;
        height: 150px;
    }

    .links-grid {
        grid-template-columns: 1fr;
    }
}
</style>