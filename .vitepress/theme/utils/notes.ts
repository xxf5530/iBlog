export type NotesView = 'category' | 'timeline' | 'tags'

// make sure "cleanUrls: true" in vitepress config
const notesPathPrefix = '/notes#'

export function getLinkByNoteTag(tag: string, prefix = notesPathPrefix) {
  return `${prefix}view=tags&tag=${tag}`
}

export function getLinkByNoteView(view: NotesView, tag: string) {
  const url =
    view !== 'tags' ? `${notesPathPrefix}view=${view}` : getLinkByNoteTag(tag)
  return decodeURIComponent(url)
}

export function parseNotesUrlHash(hash: string): {
  view: NotesView
  tag?: string
} {
  const params = new URLSearchParams(hash.slice(1))
  const view = params.get('view')
  const tag = params.get('tag')
  if (view === 'tags' && tag) {
    return {
      view: 'tags',
      tag: decodeURIComponent(tag),
    }
  } else {
    return {
      view: view === 'category' || view === 'timeline' ? view : 'category',
    }
  }
}

export function getNotesByCategory(source: MarkdownArr, fallback = '未归类') {
  const acc = new Map<string, MarkdownArr>()
  source.forEach(item => {
    const { category = fallback } = item
    acc.set(category, [...(acc.get(category) || []), item])
  })
  acc.forEach((value, key) => {
    acc.set(
      key,
      value.sort((a, b) => b.title.localeCompare(a.title)),
    )
  })
  return Object.fromEntries(acc)
}

export function getNotesByTimeline(source: MarkdownArr, reverse?: boolean) {
  const acc = new Map<string, MarkdownArr>()
  const copied = reverse ? source.slice().reverse() : source
  copied.forEach(item => {
    const y = item.date.slice(0, 4)
    acc.set(y, [...(acc.get(y) || []), item])
  })
  return Object.fromEntries(acc)
}

export function getNotesByTags(source: MarkdownArr) {
  const raw = source.reduce((acc, cur) => {
    if (cur?.tags?.length) {
      cur.tags.forEach(tag => {
        if (acc[tag]) {
          acc[tag].push(cur)
        } else {
          acc[tag] = [cur]
        }
      })
    }
    return acc
  }, {} as MarkdownMap)

  return Object.fromEntries(
    Object.entries(raw).sort((a, b) => b[1].length - a[1].length),
  )
}
