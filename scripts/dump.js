import { execSync } from 'child_process'
import fg from 'fast-glob'
import gm from 'gray-matter'
import fs from 'fs-extra'

const root = process.cwd()
const from = `${root}/press`.replace(/\\/g, '/')
const save = `${root}/.vitepress/data`.replace(/\\g/, '/')

async function dumpMarkdowns(options = {}) {
  const { fromDir = from, saveDir = save } = options
  const markdownFiles = await fg(`**/*.md`, { cwd: fromDir })
  const results = await Promise.all(
    markdownFiles.map(async file => {
      const filepath = `${fromDir}/${file}`
      const { data, content } = gm.read(filepath)
      let { date, title, description, cover, category, tags, draft } = data
      if (!date || !title || draft) {
        return
      }
      let coverImage = cover
      if (!coverImage) {
        const match = content.match(/(?<=!\[.*]\()(.+)(?=\))/g)
        match && (coverImage = match)
      }
      if (!description) {
        //
      }
      let lastUpdateTime = getLastUpdateTime(filepath)
      return {
        slug: file.split('/')[0],
        date: new Date(Date.parse(date)).toISOString(),
        link: `/${file.replace(/\.md$/, '')}`,
        title,
        description,
        cover: coverImage,
        category,
        tags,
        lastUpdateTime,
      }
    })
  )

  const groupedResults = results
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .reduce((acc, cur) => {
      const { slug, ...rest } = cur
      acc[slug] ? acc[slug].push(rest) : (acc[slug] = [rest])
      return acc
    }, {})

  for (const key in groupedResults) {
    await fs.outputJSON(`${saveDir}/__${key}.json`, groupedResults[key], {
      spaces: 2,
    })
  }
}

function getLastUpdateTime(filepath) {
  try {
    const command = `git log -1 --pretty="format:%ci" ${filepath}`
    const lastUpdateTime = execSync(command, { encoding: 'utf-8' })
    const formattedTime = new Date(lastUpdateTime.trim()).toISOString()
    return formattedTime
  } catch (error) {}
}

;(async () => {
  try {
    dumpMarkdowns()
  } catch (error) {}
})()