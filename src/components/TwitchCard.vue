<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core';
import { TwitchStream, TwitchUser } from '../types';

defineProps<{
    user: TwitchUser;
    stream: TwitchStream | undefined;
}>()
</script>

<template>
    <Teleport to="#streams" :disabled="stream ? false : true">
        <div class="card">
            <div class="user">
                <img :src='user.profile_image_url' />
                <h2>{{ user.display_name }}</h2>
                <p>{{ user.description }}</p>
            </div>
            <div class="stream" v-if="stream">
                <img :src='stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080")' />
                <div>
                    <h3>{{ stream.title }}</h3>
                    <div class="description">
                        <p>{{ stream.viewer_count }} viewers</p>
                        <p>Joue à {{ stream.game_name }}</p>
                        <p>Stream depuis {{ useTimeAgo(new Date(stream.started_at)) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
#streams > .card > .user {
    display: flex;
    width: 33%;
}

#streams > .card > .user > p {
    display: none;
}

#streams > .card > .user > img {
    width: 64px;
    height: 64px;
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
    width: 128px;
    height: 77px;
}

.stream > .description {
    display: flex;
    gap: 16px;
}
</style>