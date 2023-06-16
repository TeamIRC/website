import { createRouter, createWebHashHistory } from "vue-router"
import Page from "./components/Page.vue"
import sitemap from "./pages/sitemap.json";

let routes = [];
let section: keyof typeof sitemap;
for (section in sitemap) 
    routes.push({
        path: '/' + section,
        children : sitemap[section].map(v => {
            return { path: v.path, component: Page }
        })
    });

Object.assign(routes[0].children[0], {
    alias: ['/', '/prevention']
})

Object.assign(routes[0].children[0], {
    alias: '/gaming'
})

export default createRouter({
    history: createWebHashHistory(),
    routes,
})  