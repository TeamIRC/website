import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (request: VercelRequest, response: VercelResponse) => {
    const req = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.VITE_GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: request.body
        }),
    });
    console.log(req);
    const json = await req.json()
    const { access_token } = json;
    response
        .setHeader('Set-Cookie', `github_token=${JSON.stringify(access_token)}; Path=/; Secure; HttpOnly`)
        .send(await getGithubUser(access_token));
}

async function getGithubUser(access_token: string) {
    return (await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })).json();
}