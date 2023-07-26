<script setup lang="ts">
import { TwitchStream, TwitchUser } from '../types';
import { onMounted, onUnmounted } from 'vue';
import SVGIcon from './SVGIcon.vue';

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
            element.innerText = `${ 
                    (days ? days + " jour(s) et " : "")
                    + hours
                        .toLocaleString("fr-FR", {minimumIntegerDigits: 2})
                }:${
                    minutes
                        .toLocaleString("fr-FR", {minimumIntegerDigits: 2})
                }:${
                    seconds
                        .toLocaleString("fr-FR", {minimumIntegerDigits: 2})
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
                <h4>{{ stream.title }}</h4>
                <table class="description">
                    <tr>
                        <td>
                            <SVGIcon name="team-line" />
                        </td>
                        <td>{{ stream.viewer_count }}</td>
                    </tr>
                    <tr>
                        <td>
                            <SVGIcon name="gamepad-line" />
                        </td>
                        <td>{{ stream.game_name }}</td>
                    </tr>
                    <tr>
                        <td>
                            <SVGIcon name="time-line" />
                        </td>
                        <td :ref="(e) => refStreamSince(e as HTMLParagraphElement, stream!.started_at)"></td>
                    </tr>
                </table>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
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

.user > img {
	border-radius: 50%;
    width: 100%;
}

#streams .card {
    padding: 8px;
}

#streams .user {
    display: flex;
    width: 20%;
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

.stream {
    display: flex;
	font-weight: initial;
    width: 80%;
    height: 64px;
}

.stream > * {
    height: 100%;
}

.stream > img {
    width: 114px;
}

.stream > h4 {
    width: calc(75% - 114px);
    margin: 0px;
    overflow: hidden;
    text-overflow: clip;
    line-height: 32px;
}

.stream > .description {
    width: 25%;
}

.stream > .description td {
    padding: 0px;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.stream > .description td > svg {
    width: 16px;
    height: 16px;
}
</style>