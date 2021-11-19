import { serve } from './deps.ts'
import { env } from "./deps.ts"
import { parseFeed } from "./deps.ts"

const fetchFeed = async (url: string): Promise<any> => {
  const response = await fetch(url);
  const responseText = await response.text();
  return await parseFeed(responseText);
}

const addr = `:${env.get("PORT", "8080")}`;

const handler = async (request: Request): Promise<Response> => {
  try {
    const feed = await fetchFeed('https://memo.yammer.jp/posts/index.xml');
    const body = JSON.stringify(feed);

    return new Response(body, { status: 200, headers: {
      // 'Content-Type': 'application/rss+xml; charset=utf-8'
    }});

  }
  catch(e) {
    console.error(e)
    return new Response(e.toString(), { status: 500, headers: {
      // 'Content-Type': 'application/rss+xml; charset=utf-8'
    }});

  }
};

class Router {
  private getHandlers: {[key: string]: (request: Request) => Promise<Response>};

  constructor() {
    this.getHandlers = {};
  }

  get(relativePath: string, handler: (request: Request) => Promise<Response>) {
    this.getHandlers[relativePath] = handler;
  }
  handle(request: Request):Response|Promise<Response> {
    const path = `/${request.url.split('/').slice(3).join('/')}`

    if (request.method === 'GET') {
      if (this.getHandlers[path]) {
        try {
          return this.getHandlers[path](request)
        } catch(e) {
          console.error(e)
          return new Response(e.toString(), {status: 500})
        }
      } else {
        return new Response('Not Found', { status: 404})
      }

    } else {
      return new Response('Method Not Allowed', { status: 405})
    }
  }
}

const router = new Router();

router.get('/', async (reqeust: Request) => {
  const feed = await fetchFeed('https://memo.yammer.jp/posts/index.xml');
  const body = JSON.stringify(feed);

  return new Response(body, { status: 200, headers: {
    // 'Content-Type': 'application/rss+xml; charset=utf-8'
  }});
})

console.log(`HTTP webserver running. Access it at: http://localhost${addr}/`);
// await serve(handler, { addr });
await serve(router.handle, { addr });

