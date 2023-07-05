import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
    const id = process.env.TWITCH_CLIENT_ID;
    const twitchResponse = await (
      await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "client_id="+ id +"&client_secret="+ process.env.TWITCH_SECRET +"&grant_type=client_credentials"
    })).json();

  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
    twitchHeader: {
      "Authorization": "Bearer " + twitchResponse.access_token,
      "Client-Id": id
    } as HeadersInit
  });
}