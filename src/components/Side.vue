<script setup lang="ts">
import { PropType } from 'vue';
import Menu from './Menu.vue';
import logoGaming from '../assets/logo_gaming.png';
import logoPrevention from '../assets/logo_prevention.png';

const props = defineProps({
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
const logo = props.root == "prevention" ? logoPrevention : logoGaming;
</script>

<template>
    <div class="side">
        <template v-if="current">
            <header>
                <div class="logo">
                    <img :src="logo" :alt="`logo ${root}`">
                </div>
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

.logo {
    width: 344px;
    height: 344px;
    margin: 16px;
}

.logo > img {
    height: 100%
}
</style>