<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TwitchEmbedOptions } from "../types";

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
                    <SVGIcon :name="active?'arrow-right-double-line':'arrow-left-double-line'" />
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

.chat-buttons > button {
    height: 16px;
	border: 1px solid var(--1-bg);
	background-color: var(--1-txt);
	transition: 200ms;
}

.chat-buttons > button:hover {
	background-color: var(--2-bg);
}

.chat-buttons > button svg path {
    color: var(--2-bg);
	transition: 200ms;
}

.chat-buttons >  button:hover svg path{
    color: var(--1-txt);
}

.twitch-chat > iframe {
    opacity: 0;
    transition: 200ms;
}

.twitch-chat.active {
    width: 340px;
}

.twitch-chat.active > iframe {
    opacity: 1;
}
</style>