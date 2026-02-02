import { env } from "./deps.ts"

import { Router } from './src/router.ts'

import { handler as indexHandler } from './src/controllers/v0/index.ts'
import { handler as rssHandler } from './src/controllers/v0/rss.ts'
import { handler as jsonFeedHandler } from './src/controllers/v0/json_feed.ts'

const router = new Router();

router.get('/v0', indexHandler)
router.get('/v0/rss', rssHandler)
router.get('/v0/json_feed', jsonFeedHandler)
router.allowOrigin('https://yammer.jp')
router.allowOrigin('http://localhost:8080')
router.allowOrigin('http://localhost:8081')

const port = parseInt(env.get("PORT", "8080"));
console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

const handler = (req: Request): Promise<Response> => {
  return router.handle(req)
}

Deno.serve({ port }, handler);

