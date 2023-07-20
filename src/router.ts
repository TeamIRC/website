import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import Login from "./components/Login.vue"
import Page from "./components/Page.vue"
import sitemap from "./pages/sitemap.json";
import { h } from "vue";

let routes: RouteRecordRaw[] = [
    { 
        path: '/:pathMatch(.*)',
        component: h("<div>Oups ! Cette page n'existe pas</div>")
    },
    {
        path: "/", redirect: '/prevention/home'
    },
    {
        path: "/login",
        component: h('<div>Connexion à GitHub<div>'),
        beforeEnter() {
            const state = new TextDecoder("utf-8")
                .decode(
                    crypto.getRandomValues(new Uint32Array(10))
                );
            localStorage.setItem('state', state);
            location.href = 'https://github.com/login/oauth/authorize?' 
                + `client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&`
                + `scope=${encodeURIComponent("read:user repo workflow")}&`
                + `state=${encodeURIComponent(state)}&`
                + `redirect_uri=${window.location.origin}/success`
        }
    },
    {
        path: "/success",
        component: Login
    }
];
let section: keyof typeof sitemap;
for (section in sitemap) 
    routes.push({
        path: '/' + section + '/:page',
        component: Page,
        props: true
    });
export default createRouter({
    history: createWebHistory(),
    routes,
});