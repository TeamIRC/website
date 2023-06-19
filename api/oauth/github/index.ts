import { VercelRequest, VercelResponse } from "@vercel/node";
import { Octokit } from "@octokit/rest";

export default async (request: VercelRequest, response: VercelResponse) => {
    const { access_token } = await (
        await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.VITE_GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: request.body
            }),
    })).json();
    response
        .setHeader('Set-Cookie', `github_token=${JSON.stringify(access_token)}; Path=/; Secure; HttpOnly`)
        .send(await getGithubUser(access_token));
}

async function getGithubUser (access_token: string) {
    const octokit = new Octokit({auth: access_token});
    return await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
}