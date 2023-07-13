<script setup lang="ts">
import { PropType } from 'vue';
import Menu from './Menu.vue';
import logoGaming from '../assets/logo_gaming.png';
import logoPrevention from '../assets/logo_prevention.png';
import SVGIcon from './SVGIcon.vue';

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
                            <component :is="Component" :key="$route.path" />
                        </template>
                        <template #fallback>
                            Chargement...
                        </template>
                    </Suspense>
                </router-view>
            </main>
        </template>
        <div v-else class="side-menu">
            <div class="nav-container">
                <Menu :root="root" :routes="routes" @navigate="emits('switch')"></Menu>
            </div>
            <div class="menu-footer">
                <div class="social-media">
                    <a href="https://twitter.com/team_irc">
                        <SVGIcon name="twitter" alt="twitter" />
                    </a>
                </div>
                <div class="social-media">
                    <a href="https://www.twitch.tv/team_irc">
                        <SVGIcon name="twitch" alt="twitch" />
                    </a>
                </div>
            </div>
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

.side-menu {
    position: relative;
    width: 360px;
    height: 100vh;
}

.nav-container {
    display: flex;
    height: 360px;
}

.logo {
    width: 344px;
    height: 344px;
    margin: 8px;
    text-align: center;
}

.logo > img {
	max-width: 100%;
	height: auto;
}

.menu-footer {
    display: flex;
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 32px;
    justify-content: center;
    gap: 8px;
}

.social-media {
    width: 32px;
    height: 32px;
}

.social-media > a {
    display: flex;
    width: 100%;
    height: 100%;
	align-items: center;
}

.social-media > a > img {
	max-width: 32px;
	height: auto;
}
</style>