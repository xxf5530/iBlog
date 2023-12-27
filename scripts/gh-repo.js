import { join } from 'node:path'
import { ofetch } from 'ofetch'
import fs from 'fs-extra'

// owner/repo
const endPoints = [
  // about.md
  'vuejs/vitepress',
  'vuejs/core',
  'vueuse/vueuse',
  'unocss/unocss',

  // ts-type-gym.md
  'type-challenges/type-challenges',
  'sindresorhus/type-fest',
  'total-typescript/ts-reset',
]

async function request(path) {
  const api = `https://api.github.com/repos/${path}`
  const res = await ofetch(api, {
    headers: {
      Accept: 'application/vnd.github.v4+json',
    },
  })
  return {
    key: path,
    avatar_url: res?.owner.avatar_url,
    html_url: res.html_url,
    description: res.description,
    language: res.language,
    stargazers_count: res.stargazers_count,
    forks_count: res.forks_count,
    pushed_at: res.pushed_at,
  }
}

;(async function () {
  const prs = endPoints.map(path => request(path))
  const res = await Promise.all(prs)
  const content = {}
  res.forEach(item => {
    content[item.key] = {
      ...item,
      key: undefined,
    }
  })

  fs.outputJSON(
    join(process.cwd(), 'press/public/json/gh-repo.json'),
    {
      stamp: Date.now(),
      items: content,
    },
    {
      spaces: 2,
    }
  )
})()
