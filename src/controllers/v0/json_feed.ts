import { fetchFeeds, createJsonFeed } from '../../feeds.ts'
import type { RequestHandler } from '../../router.ts'

const handler: RequestHandler = async (request: Request) => {
  const entries = await fetchFeeds([
    'https://memo.yammer.jp/posts/index.xml',
    'https://qiita.com/yammerjp/feed.atom',
    'https://basd4g.hatenablog.com/feed',
  ])

  const title = 'yammer.jp'
  const link = 'https://yammer.jp'
  const feed_url = 'https://rsss.yammer.jp/json_feed'
  const description = "Keisuke Nakayama RSS Feed"

  return new Response(createJsonFeed(title, link, feed_url, description, entries), { status: 200, headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }});
}

export { handler };
