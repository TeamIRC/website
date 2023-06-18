<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const params = new URL(document.location.href).searchParams;
// ToDo : const state = params.get("state")
const router = useRouter();
const previous = localStorage.getItem('origin')!;

onMounted(async () => {
    if (localStorage.getItem('state') != params.get('state')) return;
    const origin = window.location.origin;
    const infos = await(
        await fetch(origin + '/api/oauth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: params.get("code") })
        })
    ).json();
    Object
        .entries(infos)
        .forEach(v => localStorage.setItem(v[0], JSON.stringify(v[1])));
    router.push(previous);
});
</script>
<template>
    <div>
        <p>Connecté à GitHub, autorisation en cours...</p>
        <p>Vous allez être redirigé. Ne fermez pas la fenêtre</p>
    </div>
</template>