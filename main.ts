import { serve } from './deps.ts'
import { env } from "./deps.ts"

import { Router } from './src/router.ts'

import { handler as indexHandler } from './src/controllers/v0/index.ts'
import { handler as rssHandler } from './src/controllers/v0/rss.ts'
import { handler as jsonFeedHandler } from './src/controllers/v0/json_feed.ts'

const router = new Router();

router.get('/v0', indexHandler)
router.get('/v0/rss', rssHandler)
router.get('/v0/json_feed', jsonFeedHandler)

router.registerCommonHeader('Access-Control-Allow-Origin', 'https://yammer.jp')

const addr = `:${env.get("PORT", "8080")}`;
console.log(`HTTP webserver running. Access it at: http://localhost${addr}/`);

const handler = (req: Request): Promise<Response> => {
  return router.handle(req)
}

await serve(handler, { addr });

