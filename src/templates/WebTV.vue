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
				<div v-for="{user, stream } in profiles">
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
			</TwitchClient>
		</Suspense>
	</div>
</template>

<style scoped></style>