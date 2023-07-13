<script setup lang="ts">
import { TwitchProfile, TwitchStream, TwitchUser, WebTVContent } from '../types';

const props = defineProps<{
	content: WebTVContent
}>();

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

const userlist = props.content.userlist;

const profiles: TwitchProfile[] = await fetchUsers(userlist)
	.then(async (users) => {
		const streams = await fetchStreams(users.map(v => v.id));
		return users.map((user) => {
			return {
				user: user,
				stream: streams.find((v) => v.user_id == user.id)
			}
		}).sort((a, b) => userlist.findIndex((o) => o == a.user.login) - userlist.findIndex((o) => o == b.user.login));
	});

</script>

<template>
	<slot :profiles="profiles"></slot>
</template>

<style scoped></style>