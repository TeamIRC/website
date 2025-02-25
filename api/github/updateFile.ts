import { VercelRequest, VercelResponse } from "@vercel/node";
import { parse } from "cookie";
//import { client } from "../../backend/vercel/github/client"

export default async(request: VercelRequest, response: VercelResponse) => {
        if (!request.headers.cookie) {
            response.status(501).end();
            return;
        }
        const cookie = parse(request.headers.cookie)
        let token = cookie.github_token;

        const { root, page, content, branch } = request
            .body as {
                root: string,
                page: string,
                content: string,
                branch?: string
            };
        const url = `https://api.github.com/repos/TeamIRC/website/contents/src/pages/${root}/page-${page}.json`;
        const Authorization = "Bearer " + token;
        const { sha } = await (await fetch(
            url + (branch?'?ref='+branch:''),
            {
                method: "GET",
                headers: {
                    Authorization,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }
        )).json();
        const updateRequest = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization
            },
            body: JSON.stringify({
                message: `update ${root}/${page}`,
                branch,
                content: Buffer.from(content).toString("base64"),
                sha
            })
        });

        console.log(await updateRequest.json());

        response.status(200).end();
    }