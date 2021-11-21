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

type RSSItem = {
  title?: string
  link?: string
  description: string
  guid: {
    "@isPermalink": boolean
    "#text": string
  },
  pubDate?: string
  category?: string[]
}

function isUrl(str: string): boolean {
  return /^https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+$/.test(str)
}

function html2text(htmlStr: string): string {
 return htmlStr.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').slice(0, 300)
}


function entry2description(entry: Entry): string {
  if (typeof entry.description?.value === 'string') {
    if (entry.description?.type === 'html') {
      return html2text(entry.description?.value)
    }
    return entry.description?.value
  }
  if (typeof entry.content?.value === 'string') {
    if (entry.content?.type === 'html') {
      return html2text(entry.content?.value)
    }
    return entry.content?.value
  }
  return ''
}

function entry2rssItem(entry: Entry): RSSItem {
  const link = entry.links.length > 0 ? entry.links[0]?.href : undefined

  const category = entry.categories?.map((c: any) => c?.label)

  const guid = {
    "@isPermalink": isUrl(entry.id),
    "#text": entry.id,
  }

  const description = entry2description(entry)

  return {
    title: entry.title?.value,
    link,
    description,
    guid,
    pubDate: entry.publishedRaw,
    category,
    // enclosure
  }
}

type JsonFeedItem = {
  id: string,
  url?: string,
  title: string
  summary: string
  date_published?: string
  tags?: string[]
}

function entry2jsonFeedItem(entry: Entry): JsonFeedItem {
  const url = entry.links.length > 0 ? entry.links[0]?.href : undefined
  const tags = entry.categories?.map((c: any) => c?.label)
  const summary = entry2description(entry)
  return {
    id: entry.id,
    title: entry.title?.value || '',
    url,
    tags,
    summary,
    date_published: entry.publishedRaw
  }
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
        item: entries.map(entry2rssItem)
      }
    }
  };
  return '<?xml version="1.0"?>\n' + stringify(rssTree)
}

function createJsonFeed(title: string, home_page_url: string, feed_url: string, description: string, entries: Entry[]): string {
  return JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title,
    home_page_url,
    feed_url,
    description,
    items: entries.map(entry2jsonFeedItem),
  })
}

export { fetchFeeds, createRSS, createJsonFeed }
