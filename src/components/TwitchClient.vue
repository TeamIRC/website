<script setup lang="ts">
import { ref } from 'vue';
import type { TwitchProfile, TwitchStream, TwitchUser } from '../types';

const props = defineProps<{
	content: string[]
}>();

const emits = defineEmits<{
	(event: 'loaded', profiles: TwitchProfile[]) : void
}>()

const profiles = ref<TwitchProfile[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

async function fetchTwitchHeader(): Promise<HeadersInit> {
	const response = await fetch('/api/TwitchClient');
	const contentType = response.headers.get('content-type') ?? '';

	if (!response.ok || !contentType.includes('application/json')) {
		throw new Error('The Twitch API proxy is not available from this dev server.');
	}

	const json = await response.json();
	if (!json.twitchHeader) {
		throw new Error('The Twitch API proxy response is missing credentials.');
	}

	return json.twitchHeader;
}

async function fetchUsers(
	users: string[],
	header: HeadersInit
): Promise<TwitchUser[]> {
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

async function fetchStreams(
	ids: string[],
	header: HeadersInit
): Promise<TwitchStream[]> {
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

const userlist = props.content;

async function loadProfiles() {
	try {
		const header = await fetchTwitchHeader();
		profiles.value = await fetchUsers(userlist, header)
			.then(async (users) => {
			const streams = await fetchStreams(users.map(v => v.id), header);
			const result = users.map((user) => { return {
					user: user,
					stream: streams.find((v) => v.user_id == user.id)
				}})
				.sort((a, b) => userlist.indexOf(a.user.login) - userlist.indexOf(b.user.login));
			emits('loaded', result);
			return result;
		});
	} catch (err) {
		console.warn('Unable to load Twitch profiles:', err);
		error.value = 'Impossible de charger les chaînes Twitch pour le moment.';
		emits('loaded', []);
	} finally {
		loading.value = false;
	}
}

loadProfiles();
</script>

<template>
	<slot :profiles="profiles" :error="error" :loading="loading"></slot>
</template>

<style scoped></style>
