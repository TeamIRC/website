<script setup lang="ts">
import { PropType, onMounted, ref, watch } from 'vue';
import Menu from './Menu.vue';
import logoGaming from '../assets/logo_gaming.png';
import logoPrevention from '../assets/logo_prevention.png';
import Dropdown from './Dropdown.vue';
import { useRoute } from 'vue-router';
import SideMenu from './SideMenu.vue';

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
const route = useRoute();
const logo = props.root == "prevention" ? logoPrevention : logoGaming;
const title = ref("");
const active = ref(false);
function setTitle() {
    title.value = props.routes.find(
        v => v.path == route.path.split('/')[2]
    )?.title??""
}

watch(() => route.path, setTitle);
onMounted(() => setTitle());
</script>

<template>
    <div class="side" :class="active ? 'active' : ''">
        <template v-if="current">
            <header>
                <div id="main-logo" class="logo">
                    <img :src="logo" :alt="`logo ${root}`">
                </div>
                <Menu class="menu-default" :root="root" :routes="routes"></Menu>
                <Dropdown class="menu-mobile" :label="title">
                    <Menu :root="root" :routes="routes"></Menu>
                </Dropdown>
            </header>
            <main>
                <router-view :root="root" v-slot="{ Component }"
                    :title="routes.find(v => v.path == $route.path.split('/')[2])?.title"
                    >
                    <template v-if="Component">
                        <KeepAlive>
                            <Suspense>
                                <Transition name="fade" mode="out-in">
                                    <template #default>
                                        <component :is="Component" :key="$route.path" />
                                    </template>
                                    <template #fallback>
                                        Chargement...
                                    </template>
                                </Transition>
                            </Suspense>
                        </KeepAlive>
                    </template>
                </router-view>
            </main>
        </template>
        <SideMenu v-else
            :side="root == 'prevention' ? 'left' : 'right'"
            :logo="logo"
            :root="root"
            :routes="routes"
            @switch="emits('switch')"
            @open="active = true"
            @close="active = false" />
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

.logo {
    width: 344px;
    height: 344px;
    max-width: 100%;
    margin: 8px;
    text-align: center;
}

.side-menu :deep(> div) {
    pointer-events: none;
}

.active .side-menu :deep(> div) {
    pointer-events: all;
}

.menu-mobile {
    display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
    header, main {
	    max-width: calc(100% - 32px);
    }

    header {
        flex-direction: column;
        height: 33vh;
		text-align: center; 
    /*    font-size: 22px;  */   
    }

    .menu-mobile {
        display: block;
        height: 32px;
    }

    .menu-default {
        display: none;
    }

    .logo {
        height: calc(100% - 2em - 48px);
    }
}
</style>

<style>
.logo > img {
	max-width: 100%;
	max-height: 100%;
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
    .logo > img {
        display: none;
    }

    .logo > img:last-child {
        display: initial;
        max-height: 100%;
    }
}
</style>