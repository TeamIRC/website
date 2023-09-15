<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TwitchEmbedOptions } from "../types";
import SVGIcon from './SVGIcon.vue';

const props = defineProps({
    width: {
        type: String,
        default: '400',
    },
    height: {
        type: String,
        default: '300',
    },
    channel: String,
});
const active = ref(false);
const options: TwitchEmbedOptions = {
    width: props.width,
    height: props.height,
    autoplay: true,
    allowFullscreen: true,
    channel: props.channel,
    parent: ['les-parrains-du-numerique.vercel.app']
};
let embed: any;
function setChannel(channel: string) {
    embed.setChannel(channel);
}
defineExpose({ setChannel });
onMounted(() => {
    const Twitch = (window as ( Window & typeof globalThis & { Twitch: any })).Twitch;
    embed = new Twitch.Player(`player-${props.channel}`, options);
})
</script>

<template>
    <div class="twitch-embed">
        <div class="twitch-player" :id="`player-${channel}`"></div>
        <div class="twitch-chat" :class="{ active }">
            <div class="chat-buttons">
                <button><SVGIcon name="close-line" /></button>
                <button @click="active = !active">
                    <SVGIcon v-if="active" name="arrow-right-double-line" />
                    <SVGIcon v-else name="arrow-left-double-line" />
                </button>
            </div>
            <iframe
                frameborder="0"
                scrolling="no"
                :src="`https://www.twitch.tv/embed/${channel}/chat?parent=les-parrains-du-numerique.vercel.app&darkpopout`"
                height="100%"
                width="100%">
            </iframe>
        </div>
    </div>
</template>

<style>
.twitch-embed {
    display: flex;
}

.twitch-player {
    width: calc(100% - 16px);
    height: 100%;
}

.twitch-player iframe {
    width: 100%;
    height: 100%;
}

.twitch-chat {
    width: 16px;
    transition: 200ms;
}

.chat-buttons {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 8px;
    transition: 200ms;
}

.chat-buttons > button {
    width: 16px;
    height: 16px;
    padding: 0px;
	border: 1px solid var(--1-bg);
	background-color: var(--1-txt);
	transition: 200ms;
}

.chat-buttons > button:hover {
	background-color: var(--2-bg);
}

.chat-buttons > button > svg {
    width: 14px;
    height: 14px;
}

.chat-buttons > button svg path {
    color: var(--2-bg);
	transition: 200ms;
}

.chat-buttons > button:hover svg path{
    color: var(--1-txt);
}

.twitch-chat > iframe {
    display: none;
    opacity: 0;
    transition: 200ms;
}

.twitch-chat.active {
    width: 340px;
}

.twitch-chat.active > .chat-buttons {
    right: 240px;
}

.twitch-chat.active > iframe {
    display: block;
    opacity: 1;
}
</style>