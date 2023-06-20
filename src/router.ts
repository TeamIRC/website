import { createRouter, createWebHashHistory } from "vue-router"
import Login from "./components/Login.vue"
import Page from "./components/Page.vue"
import sitemap from "./pages/sitemap.json";
import { h } from "vue";

let routes = [];
let section: keyof typeof sitemap;
for (section in sitemap) 
    routes.push({
        path: '/' + section + '/:page',
        component: Page,
        props: true
    });

routes.push({ path: "/", redirect: '/prevention/home' });
routes.push({
    path: "/login",
    component: h('<div>Connexion à GitHub<div>'),
    beforeEnter() {
        const state = new TextDecoder("utf-8")
            .decode(
                crypto.getRandomValues(new Uint32Array(10))
            );
        localStorage.setItem('state', state);
        location.href = 'https://github.com/login/oauth/authorize?' 
            + `client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`
            + '&scope=read:user%20repo'
            + `&state=${state}`
    }
})
routes.push({
    path: "/success",
    component: Login
})
export default createRouter({
    history: createWebHashHistory(),
    routes,
})  