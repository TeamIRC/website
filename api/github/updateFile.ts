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
        const Authorization = "bearer " + token;
        
        const fileData = await fetch(
            `${url}?ref=${refBranch}`,
            {
                method: "GET",
                headers: { Authorization }
            }
        );
        console.log(fileData);
        const jsonFile = await fileData.json();
        console.log(jsonFile);
        const { sha } = jsonFile;
        console.log(sha);
        const updateRequest = await fetch(url, {
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

        console.log(await updateRequest.json());

        response.status(200).end();
    }
)