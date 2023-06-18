import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (request: VercelRequest, response: VercelResponse) => {
    const req = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: process.env.VITE_GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: request.body
        }),
    });
    
    console.log(await req.text());

    const { access_token } = await req.json();

    response
        .setHeader('Set-Cookie', `github_token=${JSON.stringify(access_token)}; Path=/; Secure; HttpOnly`)
        .send(await getGithubUser(access_token));
}

async function getGithubUser (access_token: string) {
    return (await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `bearer ${access_token}`
        }
    })).json();
}