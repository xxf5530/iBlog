/**
 * 2048 game model
 */

export interface TileBase {
  x: number
  y: number
  level: number
}

export interface TileMeta extends TileBase {
  key?: number // the key for vue 'v-for' directives
}

export interface ModelBase {
  score: number
  times: number // move times
  tiles: TileBase[]
}

let key = 0

export class G2048Model {
  gg = false
  score = 0
  times = 0
  tiles: TileMeta[] = []
  snaps: (TileBase | undefined)[][] = []
  prevScore?: number
  prevTiles?: string // only allow back one step

  init(options?: ModelBase) {
    this.gg = false
    this.score = options?.score ?? 0
    this.times = options?.times ?? 0
    this.tiles = options?.tiles ?? []
    this.updateTiles(true)
    if (this.tiles.length === 0) this.popup(2)
  }

  move(direction: 'up' | 'down' | 'left' | 'right') {
    if (this.gg) {
      return
    }
    const prevScore = this.prevScore ?? this.score
    const prevTiles = JSON.stringify(this.tiles)
    const reverse = direction === 'left' || direction === 'up'
    let prop: 'x' | 'y'
    let getItems: (i: number) => (TileMeta | undefined)[]
    if (direction === 'left' || direction === 'right') {
      prop = 'x'
      getItems = (y: number) => this.snaps[y]
    } else {
      prop = 'y'
      getItems = (x: number) => this.snaps.map(row => row[x])
    }

    for (let i = 0; i < 4; i++) {
      let items = getItems(i).filter(Boolean) as TileMeta[]
      items = this.mergeTileItems(items, reverse)
      const offset = reverse ? 0 : 4 - items.length
      items.forEach((item, index) => (item[prop] = offset + index))
    }

    this.updateTiles()
    if (this.score > prevScore || JSON.stringify(this.tiles) !== prevTiles) {
      this.popup()
      this.times++
      this.prevTiles = prevTiles
      this.prevScore = this.score
    }
  }

  back() {
    if (!this.prevTiles) {
      return
    }
    this.tiles = JSON.parse(this.prevTiles)
    this.score = this.prevScore!
    this.updateTiles()
    this.prevTiles = undefined
    this.gg = false
  }

  popup(count = 1) {
    const candidates: number[] = []
    this.snaps.flat().forEach((tile, i) => !tile && candidates.push(i))
    if (candidates.length < count) {
      return
    }
    const target = shuffle(candidates, count)
    target.forEach(i => {
      const tile = {
        x: i % 4,
        y: Math.floor(i / 4),
        level: Math.random() < 0.9 ? 1 : 2,
        key: key++,
      }
      this.tiles.push(tile)
      this.snaps[tile.y][tile.x] = tile
    })

    if (candidates.length === count) {
      this.gg = this.isGameOver()
    }
  }

  isGameOver() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const t = this.snaps[y][x]
        if (!t) {
          return false
        }
        if (x < 3) {
          const tx = this.snaps[y][x + 1]
          if (!tx || canIMerge(t, tx)) {
            return false
          }
        }
        if (y < 3) {
          const ty = this.snaps[y + 1][x]
          if (!ty || canIMerge(t, ty)) {
            return false
          }
        }
      }
    }
    return true
  }

  updateTiles(resetKey = false) {
    const snaps = Array.from({ length: 4 }, () => Array(4).fill(undefined))
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      const tile = this.tiles[i]
      if (!tile.level) {
        this.tiles.splice(i, 1)
        continue
      }
      resetKey && (tile.key = key++)
      snaps[tile.y][tile.x] = tile
    }
    this.snaps = snaps
  }

  mergeTileItems(items: TileMeta[], reverse = false) {
    if (items.length < 2) {
      return items
    }
    reverse && items.reverse()
    if (items.length === 2) {
      this.doMerge(items[0], items[1])
    } else if (items.length === 3) {
      !this.doMerge(items[1], items[2]) && this.doMerge(items[0], items[1])
    } else if (items.length === 4) {
      if (this.doMerge(items[2], items[3])) {
        this.doMerge(items[0], items[1])
      } else {
        !this.doMerge(items[1], items[2]) && this.doMerge(items[0], items[1])
      }
    }
    reverse && items.reverse()
    return items.filter(item => item.level)
  }

  doMerge(from: TileMeta, to: TileMeta) {
    if (canIMerge(from, to)) {
      from.level++
      to.level = 0
      this.score += 2 ** from.level
      return true
    }
  }
}

function canIMerge(from: TileMeta, to: TileMeta) {
  return from.level === to.level
}

function shuffle<T>(array: T[], target: number, length = array.length) {
  for (let i = 0; i < length; i++) {
    const j = Math.floor(Math.random() * (length - i)) + i
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.slice(0, target)
}
