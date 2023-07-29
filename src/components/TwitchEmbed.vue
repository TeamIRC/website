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
    volume: {
        type: Number,
        default: 0.5,
    },
    quality: {
        type: String,
        default: 'medium',
    },
    playsInline: {
        type: Boolean,
        default: false,
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
if (props.playsInline) {
    options.playsinline = true;
}
defineExpose({ setChannel });
onMounted(() => {
    const Twitch = (window as ( Window & typeof globalThis & { Twitch: any })).Twitch;
    embed = new Twitch.Embed(`twitch-embed-${props.channel}`, options);
})
</script>

<template>
    <div>
        <div :id="`twitch-embed-${channel}`"></div>
    </div>
</template>

<style>
[id^="twitch-embed"] {
    height: 100%;
}

[id^="twitch-embed"] iframe {
    width: 100%;
    height: 100%;
}
</style>