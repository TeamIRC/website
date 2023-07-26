<script setup lang="ts">
import { ref, watch } from 'vue';
import TwitchClient from '../components/TwitchClient.vue';
import { ListContent } from '../types';
import TwitchEmbed from '../components/TwitchEmbed.vue';
import ListBase from '../components/ListBase.vue';
import TwitchCard from '../components/TwitchCard.vue';
const props = defineProps<{
	content: ListContent<string>,
	edit: boolean
}>();
const emits = defineEmits<{
	(event: "modified", content: ListContent<string>): void
}>();
const hideEmbed = ref(false);
const list = ref(props.content);
watch(
    () => props.edit,
    () => {
		if (list.value.items.toString() !== props.content.items.toString())
			emits("modified", list.value);
	}
);
</script>

<template>
	<div>
		<ListBase v-if="edit" :edit="true"
			:items="content.items"
			:empty-item="''">
			<template #editor="{ index }">
				<input type="text" v-model="list.items[index]" />
			</template>
		</ListBase>
		<Suspense v-else>
			<template #fallback>
				Chargement
			</template>
			<TwitchClient
				:content="content.items"
				v-slot="{ profiles }">
				<TwitchEmbed
					id="embed"
					v-if="profiles.some((u) => u.stream)"
					:style="hideEmbed ? 'display:none' : ''"
					:channel="profiles.find((u) => u.stream)?.user.login"
					@error="hideEmbed = true" />
				<div id="streams">
				</div>
				<div id="profiles">
					<TwitchCard
						v-for="{ user, stream } in profiles"
						:user="user"
						:stream="stream" />
				</div>
			</TwitchClient>
		</Suspense>
	</div>
</template>

<style scoped>
#embed {
	width: 100%;
	aspect-ratio: 16 / 9;
	background-color: #00000033;
}

#profiles {
	display: grid;
    grid-template-columns: repeat(auto-fit, minmax(344px, auto));
	gap: 16px;
}
</style>