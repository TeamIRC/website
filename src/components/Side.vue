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
                <img src="../assets/vue.svg" alt="" width="344" height="344">
                <Menu :root="root" :routes="routes"></Menu>
            </header>
            <main>
                <router-view :root="root" v-slot="{ Component }">
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
        <Menu v-else :root="root" :routes="routes" @navigate="emits('switch')"></Menu>
	</div>
</template>

<style scoped>
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
</style>