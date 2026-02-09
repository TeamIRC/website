import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import Login from "./components/Login.vue"
import Page from "./components/Page.vue"
import sitemap from "./pages/sitemap.json";
import { h } from "vue";
import { type Route } from "./types"

let routes: RouteRecordRaw[] = [
    { 
        path: '/:pathMatch(.*)',
        component: h("div", "Oups ! Cette page n'existe pas")
    },
    {
        path: "/", redirect: '/aboutus'
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

function getRoutes(root: Route[], path?: string): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  const basePath = path ? path + "/" : "/";
  root.forEach((route) => {
    if (route.children) {
      const innerRoutes = getRoutes(route.children, basePath + route.path);
      routes.push(...innerRoutes);
    } else
      routes.push({
        path: basePath + route.path,
        component: Page,
      });
  });
  return routes;
}

function resolveRoutes() {
  let routes: RouteRecordRaw[] = getRoutes(sitemap.$r);
  for (const alias in sitemap) {
    if (alias === "$r") continue;
    routes.push({
      path: `/${alias}/:id`,
      component: Page,
    });
  }
  return routes;
}

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...resolveRoutes()],
});

router.beforeEach(async(to, _, next) => {
    const { fullPath } = to;
    const splittedPath = fullPath.split("/");
    splittedPath.shift();
    const page = splittedPath.pop();
    const root = splittedPath.pop() ?? "$r";
    let title = "";
    if (root == "$r") {
        const route = sitemap.$r.find((r) => {
        if (r.children) {
            return r.children.find((c) => c.path === page);
        } else return r.path === page;
        });
        const subpageRoute = route?.children?.find((c) => c.path === page);
        title = subpageRoute?.title ?? route?.title ?? "404";
    } else {
        const source = await import(`./pages/$r/${root}.json`);
        title = source.content.items[parseInt(page!)].title;
    }
    to.meta = {
        root,
        page,
        title,
        sitemapData: sitemap
    };
    next();
    return;
});

export default router;