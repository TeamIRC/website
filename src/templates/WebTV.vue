<script setup lang="ts">
import { watch } from 'vue';
import TwitchClient from '../components/TwitchClient.vue';
import { WebTVContent } from '../types';
const props = defineProps<{
	content: WebTVContent,
	edit: boolean
}>();
const emit = defineEmits<{
	(event: "modified", content: WebTVContent): void
}>();
let webTV = props.content;
watch(() => props.edit,
	() => {
		if (webTV.userlist.toString() !==
			props.content.userlist.toString())
			emit("modified", webTV);
	}
);
</script>

<template>
	<div>
		<Suspense>
			<template #fallback>
				Chargement
			</template>
			<TwitchClient :content="content" v-slot="{profiles}">
				<div id="embed"></div>
				<div id="profiles">
					<div class="card" v-for="{ user, stream } in profiles">
						<img :src='user.profile_image_url' />
						<h2>{{ user.display_name }}</h2>
						<p>{{ user.description }}</p>
						<div v-if="stream">
							<img :src='stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080")' />
							<h3>{{ stream.title }}</h3>
							<p>{{ stream.viewer_count }} viewers</p>
							<p>Joue à {{ stream.game_name }}</p>
							<p>Stream depuis {{ stream.started_at }}</p>
						</div>
					</div>
				</div>
			</TwitchClient>
		</Suspense>
	</div>
</template>

<style scoped>
#embed {
	display: none;
	width: 100%;
	aspect-ratio: 16 / 9;
	background-color: #00000033;
}

#profiles {
	display: grid;
    grid-template-columns: repeat(auto-fit, minmax(344px, auto));
	gap: 16px;
}

.card {
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
	background-color: var(--secondary-dk-2);
}
</style>