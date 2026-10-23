import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parse } from 'cookie';

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'PUT') {
    response.setHeader('Allow', 'PUT').status(405).end();
    return;
  }

  const token = parse(request.headers.cookie || '').github_token;
  if (!token) {
    response.status(401).json({ message: 'Connexion à GitHub requise.' });
    return;
  }

  const { root, page, content, branch } = (request.body || {}) as {
    root: string;
    page: string;
    content: string;
    branch?: string;
  };
  if (![root, page].every(part => typeof part === 'string' && /^[\w$-]+$/.test(part)) || typeof content !== 'string') {
    response.status(400).json({ message: 'Page ou contenu invalide.' });
    return;
  }

  const url = `https://api.github.com/repos/TeamIRC/website/contents/src/pages/${root}/${page}.json`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const fileResponse = await fetch(url + (branch ? '?ref=' + encodeURIComponent(branch) : ''), { headers });
    if (!fileResponse.ok) {
      response.status(fileResponse.status).json({ message: 'Impossible de lire la page sur GitHub.' });
      return;
    }
    const { sha } = await fileResponse.json();
    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `update ${root}/${page}`,
        branch,
        content: Buffer.from(content).toString('base64'),
        sha,
      }),
    });
    if (!updateResponse.ok) {
      response.status(updateResponse.status).json({ message: 'Impossible d’enregistrer la page sur GitHub.' });
      return;
    }
    response.status(200).end();
  } catch {
    response.status(502).json({ message: 'GitHub est momentanément indisponible.' });
  }
};
