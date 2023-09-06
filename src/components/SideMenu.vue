<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import Menu from './Menu.vue';
import SVGIcon from './SVGIcon.vue';
import { useElementHover, useSwipe } from '@vueuse/core';

const props = defineProps({
    side: {
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
const isActive = ref(false);
function setActive(v: boolean) {
    v ? emits("open") : emits("close");
    isActive.value = v;
}
const hover = useElementHover(menu);
const { isSwiping, direction } = useSwipe(menu);
watch(hover, (n: boolean) => setActive(n));
watch(isSwiping, (n: boolean) => {
    if (n) setActive(direction.value != props.side);
});
const colorSide = props.side == "left" ? "dk" : "lt";
const style = getComputedStyle(document.querySelector(':root')!);
const ltColor = style.getPropertyValue(`--secondary-${colorSide}-5`);
const dkColor = style.getPropertyValue(`--secondary-${colorSide}-1`);
const colorList = `${ltColor};${dkColor};${dkColor};${ltColor}`
</script>

<template>
    <div ref="menu" class="side-menu">
        <div class="logo">
            <img :src="logo" :alt="`logo side`">
        </div>
        <div ref="target" class="nav-container">
            <Menu :root="root" :routes="routes" @navigate="() => emits('switch')"></Menu>
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
        <div id="indicator" :class="side">
            <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
                <linearGradient id="gradient-left" x2="1">
                    <stop offset="0%" :stop-color="ltColor" />
                    <stop offset="100%" :stop-color="ltColor">
                        <animate attributeName="stop-color" dur="4s"
                            :values="colorList"
                            repeatCount="indefinite" />
                        <animate attributeName="offset" dur="4s"
                            values="1;1;0;0" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" :stop-color="ltColor" />
                </linearGradient>
                <linearGradient id="gradient-right" x2="1">
                    <stop offset="0%" :stop-color="ltColor" />
                    <stop offset="0%" :stop-color="ltColor">
                        <animate attributeName="stop-color" dur="4s"
                            :values="colorList"
                            repeatCount="indefinite" />
                        <animate attributeName="offset" dur="4s"
                            values="0;0;1;1" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" :stop-color="ltColor" />
                </linearGradient>
            </svg>
            <SVGIcon
                id="left"
                v-show="isActive 
                    ? side == 'left'
                    : side == 'right'"
                name="arrow-left-double-line"
                width="32"
                height="32"
            />
            <SVGIcon
                id="right"
                v-show="!isActive 
                    ? side == 'left'
                    : side == 'right'"
                name="arrow-right-double-line"
                width="32"
                height="32"
            />
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

#indicator {
    position: absolute;
    top: 0px;
}

#indicator #left :deep(path) {
    fill: url(#gradient-left);
}

#indicator #right :deep(path) {
    fill: url(#gradient-right);
}

#indicator.left {
    right: 0px;
}

#indicator.right {
    left: 0px;
}
</style>