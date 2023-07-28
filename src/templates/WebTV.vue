<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import ListBase from '../components/ListBase.vue';
import SVGIcon from '../components/SVGIcon.vue';
import TwitchClient from '../components/TwitchClient.vue';
import TwitchEmbed from '../components/TwitchEmbed.vue';
import { ListContent, TwitchProfile } from '../types';

const props = defineProps<{
	content: ListContent<string>,
	edit: boolean
}>();
const emits = defineEmits<{
	(event: "modified", content: ListContent<string>): void
}>();
const list = ref(props.content);
const embed = ref<InstanceType<typeof TwitchEmbed>[]>();
const currentChannels = ref<string[]>([])
const cardsMap = new Map<string, HTMLDivElement>();
const elapsedMap = new Map<HTMLParagraphElement, number>();
let interval : number | undefined;
function refCardsChannels(channel: string, e: HTMLDivElement) {
    cardsMap.set(channel, e);
}
function refStreamSince(e: HTMLParagraphElement, since: string) {
    elapsedMap.set(e, new Date(since).getTime());
}
function selectStream(e: MouseEvent, stream: boolean, login: string) {
	if (!stream || currentChannels.value.some((u) => u == login)) 
		return;
	if ((e.target as HTMLElement).closest('figure')?.className == 'thumbnail')
		currentChannels.value.push(login);
	else currentChannels.value = [ login ];
}
watch(
    () => props.edit,
    () => {
		if (list.value.items.toString() !== props.content.items.toString())
			emits("modified", list.value);
	}
);
watch(
	() => currentChannels,
	(n, o) => {
		const added = n.value.filter(x => !o.value.includes(x));
		const removed = o.value.filter(x => !n.value.includes(x));
		added.forEach(v => cardsMap?.get(v)?.classList.add("active"))
		removed.forEach(v => cardsMap?.get(v)?.classList.remove("active"))
	}
)
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
onUnmounted(() => clearInterval(interval));
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
		<template v-else>
			<div id="streams">
				<div id="mosaic">
				</div>
			</div>
			<Suspense>
				<template #fallback>
					Chargement
				</template>
				<TwitchClient
					:content="content.items"
					v-slot="{ profiles }"
					@loaded="(profiles: TwitchProfile[]) => {
						const first = profiles.find((u) => u.stream);
						if (first) currentChannels.push(first.user.login)
					}"
					>
					<Teleport to="#mosaic">
						<TwitchEmbed
							ref="embed"
							id="embed"
							v-for="channel of currentChannels"
							:channel="channel"/>	
					</Teleport>
					<h2>
						Nos autres chaînes
					</h2>
					<div id="profiles">
						<div v-for="{ user, stream } in profiles">
							<Teleport to="#streams" :disabled="stream ? false : true">
								<div
									:ref="(el) => refCardsChannels(user.login, el as HTMLDivElement)"
									class="card"
									@click="(e) => selectStream(e, stream ? true : false, user.login)"
								>
									<div class="user">
										<img :src='user.profile_image_url' />
										<h3>{{ user.display_name }}</h3>
										<SVGIcon v-if="stream" name="question-line" width="32" height="64" />
										<p>{{ user.description }}</p>
									</div>
									<div v-if="stream" class="stream">
										<figure class="thumbnail">
											<img :src='stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080")' />
										</figure>
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
						</div>
					</div>
				</TwitchClient>
			</Suspense>
		</template>
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

.card {
    display: flex;
	height: calc(100% - 32px);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
    padding: 16px;
	background-color: var(--secondary-dk-2);
    text-align: center;
	font-weight: bold;
}

.user > img {
	border-radius: 50%;
    width: 100%;
}

#streams .card {
	padding: 0px;
}

#streams .card:not(.active):hover {
	background-color: var(--secondary-dk-4);
	cursor: pointer;
}

#streams .card.active {
	background-color: var(--secondary-dk-3);
}

#streams .card > * {
	background-color: inherit;
	padding: 8px;
    transition: 200ms;
}

#streams .user {
    display: flex;
    position: relative;
    width: 20%;
	border-right: 1px solid var(--secondary-lt-2);
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
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
    position: absolute;
    left: 100%;
    top: 0px;
    width: 0%;
    height: 64px;
    margin: 0px;
    padding: 8px 0px;
    z-index: 1;
	background-color: inherit;
	overflow: hidden;
	border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
	transition: 200ms;
}

#streams .user:hover > p {
    width: 375%;
    padding: 8px 8px;
}

.stream {
    display: flex;
	font-weight: initial;
    width: 80%;
    height: 64px;
	border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
}

.stream > * {
    height: 100%;
}

.stream > figure {
	position: relative;
    width: 114px;
	margin: 0px;
}

#streams .card:not(.active) figure::before {
	background: var(--secondary-dk-5);
	color: var(--secondary-lt-5);
    position: absolute;
    width: 114px;
    height: 64px;
    content: "+";
	line-height: 64px;
    font-size: 32px;
	opacity: 0;
    transition: 200ms;
}

#streams .card:not(.active) figure:hover::before {
    opacity: .8;
}

figure > img {
    width: 100%;
    height: auto;
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