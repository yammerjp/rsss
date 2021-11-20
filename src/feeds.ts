import { parseFeed } from "../deps.ts"
import { stringify } from "../deps.ts"
import type { Feed } from "../deps.ts"

const fetchFeed = async (url: string): Promise<any> => {
  const response = await fetch(url);
  const responseText = await response.text();
  return await parseFeed(responseText);
}

type Entry = Feed["entries"][number];

async function fetchFeeds(urls: string[]): Promise<Entry[]> {
  const Feeds = await Promise.all(urls.map(async url => await fetchFeed(url)))
  const entriesUnsorted: Entry[] = [].concat(...(Feeds.map(f => f.entries)))
  const entries: Entry[] = entriesUnsorted.sort(
    (a: Entry, b: Entry) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0)
  )
  return entries;
}

function createRSS(title: string, link: string, description: string, entries: Entry[]):string {
  const rssTree = {
    "rss": {
      "@version": "2.0",
      "channel": {
        title,
        link,
        description,
        "lastBuildDate": new Date().toUTCString(),
        "docs": "http://blogs.law.harvard.edu/tech/rss",
        "generator": "https://github.com/yammerjp/rsss",
        "item": entries.map(({id, title, links, publishedRaw, description, categories}) => ({
          title: title?.value,
          link: links.length > 0 ? links[0]?.href : '',
          description: description?.value,
          guid: {
            "@isPermalink": /^https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+$/.test(id),
            "#text": id,
          },
          pubDate: publishedRaw,
          category: categories?.map((c: any) => c?.label)
          // enclosure
        }))
      }
    }
  };
  return '<?xml version="1.0"?>\n' + stringify(rssTree)
}

export { fetchFeeds, createRSS }


