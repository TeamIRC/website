<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import Menu from './Menu.vue';
import SVGIcon from './SVGIcon.vue';
import { useElementHover, useSwipe } from '@vueuse/core';

const props = defineProps({
    direction: {
        type: String,
        required: true
    },
    logo: {
        type: String,
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
const emits = defineEmits(["switch", "open", "close"]);
const menu = ref();
const target = ref();
const hover = useElementHover(menu);
const { isSwiping, direction } = useSwipe(menu);
watch(hover, (n: boolean) =>
    !isSwiping && n
        ? emits("open") 
        : emits("close")
);
watch(isSwiping, (n: boolean) =>
    n && direction.value == props.direction
        ? emits("close")
        : emits("open")
);
</script>

<template>
    <div ref="menu" class="side-menu">
        <div class="logo">
            <img :src="logo" :alt="`logo side`">
        </div>
        <div ref="target" class="nav-container">
            <Menu :root="root" :routes="routes" @navigate="emits('switch')"></Menu>
        </div>
        <div ref="target" class="menu-footer">
            <div class="social-media">
                <a href="https://twitter.com/team_irc">
                    <SVGIcon name="twitter" alt="twitter" width="32" height="32" />
                </a>
            </div>
            <div class="social-media">
                <a href="https://www.twitch.tv/team_irc">
                    <SVGIcon name="twitch" alt="twitch" width="32" height="32" />
                </a>
            </div>
            <div class="social-media">
                <a href="https://www.instagram.com/team_irc">
                    <SVGIcon name="instagram" alt="instagram" width="32" height="32" />
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.side-menu {
    position: absolute;
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

@media screen and (max-width: 360px) /*Phone media querie*/
{
    .logo {
        width: auto;
        height: calc(33vh - 2em - 48px);
    }
}
</style>