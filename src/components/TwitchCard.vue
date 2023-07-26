<script setup lang="ts">
import { TwitchStream, TwitchUser } from '../types';
import { onMounted, onUnmounted } from 'vue';

defineProps<{
    user: TwitchUser;
    stream: TwitchStream | undefined;
}>()

const elapsedMap = new Map<HTMLParagraphElement, number>();
function refStreamSince(e: HTMLParagraphElement, since: string) {
    elapsedMap.set(e, new Date(since).getTime());
}
let interval : number | undefined;
onMounted(() => {
    interval = setInterval(() => {
        const current = new Date().getTime();
        elapsedMap.forEach((since, element) => {
            const elapsed = current - since;
            //Arrange the difference of date in days, hours, minutes, and seconds format
            let days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            let hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
            element.innerText =
                `Depuis ${ 
                    (days ? days + " jour(s) et " : "")
                    + hours.toFixed(2)
                }:${
                    minutes.toFixed(2)
                }:${
                    seconds.toFixed(2)
                }`;
        })
    }, 1000);
});

onUnmounted(() => clearInterval(interval))
</script>

<template>
    <Teleport to="#streams" :disabled="stream ? false : true">
        <div class="card">
            <div class="user">
                <img :src='user.profile_image_url' />
                <h3>{{ user.display_name }}</h3>
                <p>{{ user.description }}</p>
            </div>
            <div class="stream" v-if="stream">
                <img :src='stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080")' />
                <div>
                    <h4>{{ stream.title }}</h4>
                    <div class="description">
                        <p>{{ stream.viewer_count }} viewers</p>
                        <p>Joue à {{ stream.game_name }}</p>
                        <p :ref="(e) => refStreamSince(e as HTMLParagraphElement, stream!.started_at)"></p>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
#streams .user {
    display: flex;
    width: 33%;
}

#streams .user > img {
    width: 64px;
    height: 64px;
}

#streams .user > h3 {
    margin: 8px;
    line-height: 48px;
}

#streams .user > p {
    display: none;
}

.card {
    display: flex;
    gap: 16px;
    text-align: center;
	font-weight: bold;
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
    padding: 16px;
}

.card > img {
	border-radius: 50%;
    width: 100%;
}

.stream {
    display: flex;
	font-weight: unset;
}

.stream > img {
    width: 114px;
    height: 64px;
}

.stream > div {
    width: calc(100% - 114px);
}

.stream .description {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.stream h4,
.stream p {
    margin: 4px;
}

.stream h4 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>