<script setup lang="ts">
import { TwitchStream, TwitchUser } from '../types';

defineProps<{
    user: TwitchUser;
    stream: TwitchStream | undefined;
}>()
</script>

<template>
    <Teleport to="#streams" :disabled="stream ? false : true">
        <div class="card">
            <img :src='user.profile_image_url' />
            <h2>{{ user.display_name }}</h2>
            <p>{{ user.description }}</p>
                <div class="stream" v-if="stream">
                    <img :src='stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080")' />
                    <h3>{{ stream.title }}</h3>
                    <p>{{ stream.viewer_count }} viewers</p>
                    <p>Joue à {{ stream.game_name }}</p>
                    <p>Stream depuis {{ stream.started_at }}</p>
                </div>
        </div>
    </Teleport>
</template>

<style scoped>
.card {
    text-align: center;
	font-weight: bold;
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
    padding: 16px;
}

.card img {
    width: 100%;
}

.card > img {
	border-radius: 50%;
}

.stream {
	font-weight: unset;
	background-color: var(--secondary-dk-3);
	border: 1px solid var(--secondary-lt-3);
	border-radius: 16px;
    padding: 16px;
}
</style>