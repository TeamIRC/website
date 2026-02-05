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
    // ToDo: Généraliser pour blog et wiki
    {
      path: "/blog/:id",
      component: Page,
    },
    {
      path: "/wiki/:id",
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

// Fonction pour récupérer les données du wiki
async function getWikiData(wikiId: string){
    try {
        const wikiArticle = await import(`./pages/wiki/${wikiId}.json`);
        return wikiArticle;
    } catch (error) {
        console.error(`Erreur lors du chargement de l'article wiki :${wikiId}`, error);
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
        
        // Passe les données du sitemap et du blog
        to.meta = {
            root,
            page,
            title,
            blogData,
            sitemapData: sitemap // AJOUT: Passe le sitemap pour les liens internes
        };
        next();
        return;
    } else if (root === "wiki" && page) {
        // AJOUT: Gestion du wiki
        const wikiData = await getWikiData(page);

        if (wikiData && wikiData.content) {
            title = wikiData.content.article ? 
                `Wiki - ${wikiData.content.author}` : 
                "Article wiki";
        } else {
            title = "Article introuvable";
        }
        
        // Passe les données du sitemap et du wiki
        to.meta = {
            root,
            page,
            title,
            wikiData,
            sitemapData: sitemap // AJOUT: Passe le sitemap pour les liens internes
        };
        next();
        return;
    } else {
        console.log("route non gérée", root, page); 
        title = "404";
    }
    
    // Pour toutes les autres routes, passe aussi le sitemap
    to.meta = {
        root,
        page,
        title,
        sitemapData: sitemap // AJOUT: Passe le sitemap pour tous les cas
    };
    next();
})

export default router;