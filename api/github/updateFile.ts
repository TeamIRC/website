import { VercelRequest, VercelResponse } from "@vercel/node";
import { client } from "../../backend/vercel/github/client"

export default client(
    async(request: VercelRequest, response: VercelResponse, token: string) => {
        const { root, page, content, branch } = request
            .body as {
                root: string,
                page: string,
                content: string,
                branch?: string
            };
        const refBranch = branch??'main';
        const url = `https://api.github.com/repos/TeamIRC/website/contents/src/pages/${root}/${page}.json`;
        const Authorization = "Bearer " + token;
        const fileData = await (await fetch(
            `${url}?ref=${refBranch}`,
            {
                method: "GET",
                headers: {
                    Authorization,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }
        )).json();
        console.log(fileData);
        const { sha } = fileData;
        const updateRequest = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization
            },
            body: JSON.stringify({
                message: `update ${root}/${page}`,
                branch: refBranch,
                content,
                sha
            })
        });

        console.log(await updateRequest.json());

        response.status(200).end();
    }
)