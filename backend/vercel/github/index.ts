import { VercelRequest, VercelResponse } from "@vercel/node";
import { parse } from "cookie"

export function client(fn: (req: VercelRequest, res: VercelResponse, token: string) => Promise<void>) {
    return async (request: VercelRequest, response: VercelResponse) => {
        if (!request.headers.cookie) {
            response.status(501).end();
            return;
        }
        return await fn(
            request,
            response,
            parse(request.headers.cookie).github_token
        )
    }
}