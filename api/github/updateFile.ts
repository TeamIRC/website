import { VercelRequest, VercelResponse } from "@vercel/node";

function parseCookie(cookie?: string): { [k:string]: string | undefined } {
    let result = {};
    if (!cookie) return result;
    cookie
        .split(';')
        .forEach((el) => {
            const [key, value] = el.split('=');
            Object.defineProperty(result, key.trim(), value)
        })
    return result;    
}

export default async(request: VercelRequest, response: VercelResponse) => {
    const { root, page, content, branch } = request
        .body as {
            root: string,
            page: string,
            content: string,
            branch?: string
        };
    const refBranch = branch??'main';
    const url = `https://api.github.com/repos/TeamIRC/website/contents/src/pages/${root}/${page}.json`;
    const Authorization = "bearer " + parseCookie(request.headers.cookie).github_token
    const { sha } = await (await fetch(
        `${url}?ref=${refBranch}`,
        {
            method: "GET",
            headers: { Authorization }
        }
    )).json();

    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization
        },
        body: JSON.stringify({
            message: "update",
            refBranch,
            content,
            sha
        })
    });

    return response.status(200);
}