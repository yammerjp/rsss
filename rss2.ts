// https://cyber.harvard.edu/rss/languages.html
type Language =
    "af"     // Afrikaans
  | "sq "    // Albanian
  | "eu"     // Basque
  | "be"     // Belarusian
  | "bg"     // Bulgarian
  | "ca"     // Catalan
  | "zh-cn"  // Chinese (Simplified)
  | "zh-tw"  // Chinese (Traditional)
  | "hr"     // Croatian
  | "cs"     // Czech
  | "da"     // Danish
  | "nl"     // Dutch
  | "nl-be"  // Dutch (Belgium)
  | "nl-nl"  // Dutch (Netherlands)
  | "en"     // English
  | "en-au"  // English (Australia)
  | "en-bz"  // English (Belize)
  | "en-ca"  // English (Canada)
  | "en-ie"  // English (Ireland)
  | "en-jm"  // English (Jamaica)
  | "en-nz"  // English (New Zealand)
  | "en-ph"  // English (Phillipines)
  | "en-za"  // English (South Africa)
  | "en-tt"  // English (Trinidad)
  | "en-gb"  // English (United Kingdom)
  | "en-us"  // English (United States)
  | "en-zw"  // English (Zimbabwe)
  | " et"    // Estonian
  | "fo"     // Faeroese
  | "fi"     // Finnish
  | "fr"     // French
  | "fr-be"  // French (Belgium)
  | "fr-ca"  // French (Canada)
  | "fr-fr"  // French (France)
  | "fr-lu"  // French (Luxembourg)
  | "fr-mc"  // French (Monaco)
  | "fr-ch"  // French (Switzerland)
  | "gl"     // Galician
  | "gd"     // Gaelic
  | "de"     // German
  | "de-at"  // German (Austria)
  | "de-de"  // German (Germany)
  | "de-li"  // German (Liechtenstein)
  | "de-lu"  // German (Luxembourg)
  | "de-ch"  // German (Switzerland)
  | "el"     // Greek
  | "haw"    // Hawaiian
  | "hu"     // Hungarian
  | "is"     // Icelandic
  | "in"     // Indonesian
  | "ga"     // Irish
  | "it"     // Italian
  | "it-it"  // Italian (Italy)
  | "it-ch"  // Italian (Switzerland)
  | "ja"     // Japanese
  | "ko"     // Korean
  | "mk"     // Macedonian
  | "no"     // Norwegian
  | "pl"     // Polish
  | "pt"     // Portuguese
  | "pt-br"  // Portuguese (Brazil)
  | "pt-pt"  // Portuguese (Portugal)
  | "ro"     // Romanian
  | "ro-mo"  // Romanian (Moldova)
  | "ro-ro"  // Romanian (Romania)
  | "ru"     // Russian
  | "ru-mo"  // Russian (Moldova)
  | "ru-ru"  // Russian (Russia)
  | "sr"     // Serbian
  | "sk"     // Slovak
  | "sl"     // Slovenian
  | "es"     // Spanish
  | "es-ar"  // Spanish (Argentina)
  | "es-bo"  // Spanish (Bolivia)
  | "es-cl"  // Spanish (Chile)
  | "es-co"  // Spanish (Colombia)
  | "es-cr"  // Spanish (Costa Rica)
  | "es-do"  // Spanish (Dominican Republic)
  | "es-ec"  // Spanish (Ecuador)
  | "es-sv"  // Spanish (El Salvador)
  | "es-gt"  // Spanish (Guatemala)
  | "es-hn"  // Spanish (Honduras)
  | "es-mx"  // Spanish (Mexico)
  | "es-ni"  // Spanish (Nicaragua)
  | "es-pa"  // Spanish (Panama)
  | "es-py"  // Spanish (Paraguay)
  | "es-pe"  // Spanish (Peru)
  | "es-pr"  // Spanish (Puerto Rico)
  | "es-es"  // Spanish (Spain)
  | "es-uy"  // Spanish (Uruguay)
  | "es-ve"  // Spanish (Venezuela)
  | "sv"     // Swedish
  | "sv-fi"  // Swedish (Finland)
  | "sv-se"  // Swedish (Sweden)
  | "tr"     // Turkish
  | "uk"     // Ukranian
  ;

// TODO: Need specified definition
type dateRFC822 = string

// TODO: Need specified definition
type Category = string[];

// TODO: Need specified definition
// https://cyber.harvard.edu/rss/rss.html#ltcloudgtSubelementOfLtchannelgt
type Cloud = {
};

// https://cyber.harvard.edu/rss/rss.html#ltimagegtSubelementOfLtchannelgt
type Image = {
  url: string;
  title: string;
  link: string;
  // max: 144, default: 88
  width?: number;
  // max: 400, default: 31
  height?: number;
  description?: string;
}

// TODO: Need specified definition
// https://cyber.harvard.edu/rss/rss.html
type TextInput = object;

// https://cyber.harvard.edu/rss/skipHoursDays.html#skiphours
type SkipHours = {
  hour: 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23
}[]

// https://cyber.harvard.edu/rss/skipHoursDays.html#skipdays
type SkipDays = {
  day:  "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday "
      | "Sunday"
}[]


// https://cyber.harvard.edu/rss/rss.html#requiredChannelElements
type Channel = {
  title: string;
  link: string;
  description: string;
  language?: Language;
  copyright?: string;
  managingEditor?: string;
  pubDate?: dateRFC822;
  lasgBuildDate?: dateRFC822;
  category?: Category;
  generator?: string;
  docs?: string;
  cloud?: Cloud;
  ttl?: number;
  image?: Image;
  // Need specified definition
  rating?: string;
  textInput?: TextInput;
  skipHours?: SkipHours;
  skipDays?: SkipDays;
}




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
