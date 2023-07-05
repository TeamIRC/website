<script setup lang="ts">
import { watch } from 'vue';

type TwitchUser = {
	id: string;
	login: string;
	display_name: string;
	type: string;
	broadcaster_type: string;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	email: string;
	created_at: string;
};

type TwitchStream = {
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	game_id: string;
	game_name: string;
	type: string;
	title: string;
	tags: string[];
	viewer_count: number;
	started_at: string;
	language: string;
	thumbnail_url: string;
	tag_ids: string[];
	is_mature: boolean;
};

type TwitchProfile = {
	user: TwitchUser,
	stream?: TwitchStream
}

type WebTVContent = { userlist: string[] };

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

const request = await fetch('/api/TwitchClient');
const json = await request.json();
const header = await json.twitchHeader;

async function fetchUsers(users: string[]): Promise<TwitchUser[]> {
	const params = new URLSearchParams(users.map((u) => ['login', u]));

	const response = await fetch('https://api.twitch.tv/helix/users?' + params, {
		headers: header,
	});

	type JSONResponse = {
		data: TwitchUser[]
	}

	const { data }: JSONResponse = await response.json();

	if (response.ok) {
		if (data) {
			return data;
		} else {
			return Promise.reject(new Error(`No user found`));
		}
	} else return Promise.reject(new Error(`No response`));
}

async function fetchStreams(ids: string[]): Promise<TwitchStream[]> {
	const params = new URLSearchParams(ids.map((u) => ['user_id', u]));

	const response = await fetch('https://api.twitch.tv/helix/streams?' + params, {
		headers: header,
	});

	type JSONResponse = {
		data: TwitchStream[]
	}
	const { data }: JSONResponse = await response.json();

	if (response.ok) {
		if (data) {
			return data;
		} else {
			return Promise.reject(new Error(`No user found`));
		}
	} else return Promise.reject(new Error(`No response`));
}

const profiles: TwitchProfile[] = await fetchUsers(webTV.userlist)
	.then(async (users) => {
		const streams = await fetchStreams(users.map(v => v.id));
		return users.map((user) => {
			return {
				user: user,
				stream: streams.find((v) => v.user_id == user.id)
			}
		});
	});

</script>

<template>
	<div>
		<div v-for="profile in profiles">
			{{profile.stream?.thumbnail_url}}
		</div>
	</div>
</template>

<style scoped></style>