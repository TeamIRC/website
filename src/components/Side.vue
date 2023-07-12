<script setup lang="ts">
import { PropType } from 'vue';
import Menu from './Menu.vue';

defineProps({
    current: {
        type: Boolean,
        required: true
    },
    root: {
        type: String,
        required: true
    },
    routes: {
        type: Array as PropType<{ path:string, title: string }[]>,
        required: true
    }
});

const emits = defineEmits(["switch"])
</script>

<template>
    <div class="side">
        <template v-if="current">
            <header>
                <img :src="`../../public/logo_${root}.png`" :alt="`logo ${root}`" width="344" height="344">
                <Menu :root="root" :routes="routes"></Menu>
            </header>
            <main>
                <router-view :root="root" v-slot="{ Component }"
                    :title="routes.find(v => v.path == $route.path.split('/')[2])?.title"
                    >
                    <Suspense>
                        <template #default>
                            <component :is="Component" :key="$route.path"></component>
                        </template>
                        <template #fallback>
                            Chargement...
                        </template>
                    </Suspense>
                </router-view>
            </main>
        </template>
        <div v-else class="nav-container">
            <Menu :root="root" :routes="routes" @navigate="emits('switch')"></Menu>
        </div>
	</div>
</template>

<style scoped>
header,
main {
	margin: auto;
	max-width: 1218px;
	width: 100%;
}

header {
    display: flex;
}

nav {
    width: 296px;
}

.nav-container {
    display: flex;
    height: 344px;
}
</style>