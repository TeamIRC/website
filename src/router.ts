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
        path: "/", redirect: '/association/aboutus'
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

function findRouteByPath(routes: Route[], path: string[]): Route | undefined {
  const [current, ...rest] = path;
  const route = routes.find((r) => r.path === current);

  if (!route) return undefined;
  if (rest.length === 0) return route;
  if (!route.children) return undefined;

  return findRouteByPath(route.children, rest);
}

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...resolveRoutes()],
});

router.beforeEach(async(to, _, next) => {
    const pathSegments = to.path.split("/").filter(Boolean);
    const page = pathSegments[pathSegments.length - 1];
    const root = pathSegments.length > 1
        ? pathSegments[pathSegments.length - 2]
        : "$r";
    let title = "";
    const sitemapRoute = findRouteByPath(
        sitemap.$r,
        pathSegments
    );

    if (sitemapRoute) {
        title = sitemapRoute.title;
    } else if (root === "$r") {
        title = "404";
    } else {
        const source = await import(`./pages/$r/${root}.json`);
        title = source.content.items[parseInt(page!)].title;
    }
    to.meta = {
        root,
        page,
        title,
        sitemap
    };
    next();
    return;
});

export default router;
