<script setup lang="ts">
import { onMounted } from "vue";
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
        <div class="twitch-chat">
            <iframe
                frameborder="0"
                scrolling="no"
                :src="`https://www.twitch.tv/embed/${channel}/chat?parent=les-parrains-du-numerique.vercel.app`"
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
    width: calc(100% - 32px);
    height: 100%;
}

.twitch-player iframe {
    width: 100%;
    height: 100%;
}

.twitch-chat {
    width: 32px;
    transition: 200ms;
}
.twitch-chat * {
    opacity: 0;
    transition: 200ms;
}

.twitch-chat:hover,
.twitch-chat:focus {
    width: 340px;
}

.twitch-chat:hover *,
.twitch-chat:focus * {
    opacity: 1;
}
</style>