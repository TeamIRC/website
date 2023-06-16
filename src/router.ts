import { createRouter, createWebHashHistory } from "vue-router"
import Page from "./components/Page.vue"
import sitemap from "./pages/sitemap.json";

let routes = [];
let section: keyof typeof sitemap;
for (section in sitemap) 
    routes.push({
        path: '/' + section + '/:page',
        component: Page,
        props: true
    });

routes.push({ path: "/", redirect: '/prevention/home' });
    
export default createRouter({
    history: createWebHashHistory(),
    routes,
})  