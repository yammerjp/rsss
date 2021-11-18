import { serve } from './deps.ts'
import { env } from "./deps.ts"
import { parse, stringify } from "./deps.ts"
const XML = { parse, stringify }

import { any2RSS2Channel } from './rss2.ts'

const fetchRSSText = async (): Promise<string> => {
  const response = await fetch('https://memo.yammer.jp/posts/index.xml');
  return response.text();
};

const fetchRSS = async (): Promise<any> => {
  const rssText = await fetchRSSText()
  const rssTree = XML.parse(rssText)

  if (
    !('rss' in rssTree) ||
    rssTree.rss === null || typeof rssTree.rss !== 'object' || !('channel' in rssTree.rss)
  ) {
    return {}
  }
  return await any2RSS2Channel(rssTree.rss.channel)
}

const addr = `:${env.get("PORT", "8080")}`;

const handler = async (request: Request): Promise<Response> => {
  try {
    const body = JSON.stringify((await fetchRSS()));

    return new Response(body, { status: 200, headers: {
      // 'Content-Type': 'application/rss+xml; charset=utf-8'
    }});

  }
  catch(e) {
    console.error(e)
    return new Response(e.toString(), { status: 200, headers: {
      // 'Content-Type': 'application/rss+xml; charset=utf-8'
    }});

  }
};

console.log(`HTTP webserver running. Access it at: http://localhost${addr}/`);
await serve(handler, { addr });

