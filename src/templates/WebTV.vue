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
				<div v-for="profile in profiles">
					{{profile.stream?.thumbnail_url}}
				</div>
			</TwitchClient>
		</Suspense>
	</div>
</template>

<style scoped></style>