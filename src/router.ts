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
  const routes: RouteRecordRaw[] = [
    ...getRoutes(sitemap.$r),
    // ToDo: Généraliser
    {
      path: "/blog/:id",
      component: Page,
    }
  ];
  return routes;
}

// Fonction pour récupérer les données du blog
async function getBlogData(blogId: string){
    try {
        const blogArticle = await import(`./pages/blog/${blogId}.json`);
        return blogArticle;
    } catch (error) {
        console.error(`Erreur lors du chargement de l'article du blog :${blogId}`, error);
        return null;
    }
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
    } else if (root === "blog" && page) {
        const blogData = await getBlogData(page);

        if (blogData && blogData.content) {
            // Pour BlogPost (articles individuels comme 0.json)
            title = blogData.content.article ? 
            `Article - ${blogData.content.author}` : 
            "Article de blog";
        } else {
            title = "Article introuvable";
        }
        console.log(root, page); // blog 1
        // ToDo: Récupérer le title depuis l'alias (sitemap) + index
    to.meta = {
        root,
        page,
        title,
        blogData
    };
    next();
    return;
} else {
    console.log("route non gérée", root, page); 
    title = "404";
 }
 to.meta = {
    root,
    page,
    title,
 };
 next();
})
export default router;