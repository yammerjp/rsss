import { serve } from './deps.ts'
const addr = ":8080";

const handler = async (request: Request): Promise<Response> => {
  const body = await fetchRSS();

  return new Response(body, { status: 200, headers: {
    'Content-Type': 'application/rss+xml; charset=utf-8'
  }});
};

const fetchRSS = async (): Promise<string> => {
  const response = await fetch('https://memo.yammer.jp/posts/index.xml');
  return response.text();
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { addr });
