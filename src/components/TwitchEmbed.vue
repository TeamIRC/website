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
    collection: String,
    video: String,
});

const emits = defineEmits<{(event: 'error', message?: string) : void}>()

const twitchScript = document.createElement('script');
twitchScript.setAttribute('src', 'https://embed.twitch.tv/embed/v1.js');
document.head.appendChild(twitchScript);
    
const options: TwitchEmbedOptions = {
    width: props.width,
    height: props.height,
};

if (props.playsInline) {
    options.playsinline = true;
}

if (props.channel) {
    options.channel = props.channel;
} else if (props.collection) {
    options.collection = props.collection;
} else if (props.video) {
    options.video = props.video;
} else {
    emits('error', 'no source')
}

onMounted(() => {
    const embedScript = document.createElement('script');
    embedScript.setAttribute('type', 'text/javascript');
    embedScript.innerHTML = `new Twitch.Embed("twitch-embed", ${JSON.stringify(options)});`;
    document.body.appendChild(embedScript);
})
</script>

<template>
  <div id="twitch-embed"></div>
</template>