/*
type Image = {
}
type Cloud = {
}
type Email = string
type Channel = {
  title: string
  link: string
  description: string
  language?: 'en-us'
  copyright?: string
  managingEditor?: Email
  webMaster?: Email
  pubDate?: Date
  lastBuildDate?: Date
  category?: string[]
  generator?: string
  docs?: string
  cloud?: string
  ttl?: number
  image?: Image
  rating?: string
}
*/

type RSS2Item = {
  title: string
  link: string
  pubDate: string
  guid: string
  description: string
}

type RSS2Channel = {
  title: string
  link: string
  description: string
  generator: string
  language: string
  copyright: string
  lastBuildDate: string
  item: RSS2Item[]
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

async function any2RSS2Channel(rssTree: any): Promise<RSS2Channel> {
  if (typeof rssTree !== 'object') {
    return Promise.reject(new ValidationError('RSS2Channel needs Object'))
  }

  const {title, link, description, generator, language, copyright, lastBuildDate, item} = rssTree;

  if (typeof title !== 'string') {
    return Promise.reject(new ValidationError('title needs string'))
  }
  if (typeof link !== 'string') {
    return Promise.reject(new ValidationError('link needs string'))
  }
  if (typeof description !== 'string') {
    return Promise.reject(new ValidationError('description needs string'))
  }
  if (typeof generator !== 'string') {
    return Promise.reject(new ValidationError('generator needs string'))
  }
  if (typeof language !== 'string') {
    return Promise.reject(new ValidationError('language needs string'))
  }
  if (typeof copyright !== 'string') {
    return Promise.reject(new ValidationError('copyright needs string'))
  }

  if (typeof lastBuildDate !== 'string') {
    return Promise.reject(new ValidationError('lastBuildDate needs string'))
  }
  if (!Array.isArray(item)) {
    return Promise.reject(new ValidationError('item needs array'))
  }
  const items = await Promise.all<RSS2Item>(item.map(array2RSS2Items))

  return Promise.resolve({
    title, link, description, generator, language, copyright, lastBuildDate, item: items
  })
}

function array2RSS2Items(rssTreeItem: any): Promise<RSS2Item> {
  if (typeof rssTreeItem !== 'object') {
    return Promise.reject(new ValidationError('RSS2Item needs Object'))
  }
  const { title, link, pubDate, guid, description } = rssTreeItem

  if (typeof title !== 'string') {
    return Promise.reject(new ValidationError('title needs string'))
  }
  if (typeof link !== 'string') {
    return Promise.reject(new ValidationError('link needs string'))
  }
  if (typeof pubDate !== 'string') {
    return Promise.reject(new ValidationError('generator needs string'))
  }
  if (typeof guid !== 'string') {
    return Promise.reject(new ValidationError('generator needs string'))
  }
  if (typeof description !== 'string') {
    return Promise.reject(new ValidationError('description needs string'))
  }
  return Promise.resolve({title, link, pubDate, guid, description})
}

export { any2RSS2Channel }
export type { RSS2Item, RSS2Channel }
