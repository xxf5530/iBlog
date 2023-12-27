import { reactive, toRefs } from 'vue'
import { levelPresets } from './config.json'

export type State = 'ready' | 'playing' | 'victory' | 'defeat'
export type Level = 'easy' | 'medium' | 'hard' | 'custom'

export interface Position {
  x: number
  y: number
}

export interface BoardMeta {
  w: number
  h: number
  m: number
}

export interface TimerMeta {
  start: number
  duration: number
}

export interface GridMeta {
  uid: number
  open?: boolean
  flag?: boolean
  mine?: boolean
  boom?: boolean
  adjacentMines?: number
}

export interface StorageOptions {
  timer: TimerMeta
  board: BoardMeta
  grids: GridMeta[]
}

export function useModel() {
  const m = reactive(new Model())
  const { state, board, grids, flags, timer } = toRefs(m)
  return {
    state,
    board,
    grids,
    flags,
    timer,
    init: m.init.bind(m),
    load: m.load.bind(m),
    save: m.save.bind(m),
    redo: m.redo.bind(m),
    open: m.open.bind(m),
    mark: m.mark.bind(m),
    uidToPos: m.uidToPos.bind(m),
    posToUid: m.posToUid.bind(m),
    getHighlight: m.getHighlight.bind(m),
  }
}

class Model {
  state!: State
  board!: BoardMeta
  timer!: TimerMeta
  grids: GridMeta[] = []
  flags: number[] = []

  constructor() {
    this.init()
  }

  init(): void
  init(level: Level): void
  init(board: BoardMeta): void
  init(args?: Level | BoardMeta): void {
    if (typeof args == 'string' && args !== 'custom') {
      this.board = levelPresets[args]
    } else if (typeof args == 'object') {
      this.board = { ...args }
    } else if (!this.board) {
      this.board = levelPresets.easy
    }

    this.state = 'ready'
    this.initTimer()
    this.flags.length = 0
    this.grids = Array.from(
      { length: this.board.w * this.board.h },
      (_, uid) => ({ uid }),
    )
  }

  initTimer() {
    this.timer = { start: Date.now(), duration: 0 }
  }

  initMines(firstOpen: Position) {
    const { w, h, m } = this.board
    const excludes = [this.posToUid(firstOpen)]
    shuffle([...Array(w * h).keys()], m, excludes).forEach(id => {
      this.grids[id].mine = true
    })
    this.initTimer()
  }

  posToUid(pos: Position) {
    return pos.x + pos.y * this.board.w
  }

  uidToPos(uid: number): Position {
    return {
      x: uid % this.board.w,
      y: Math.floor(uid / this.board.w),
    }
  }

  load(options: StorageOptions) {
    const { board, grids, timer } = options
    this.board = board
    this.flags.length = 0
    this.grids = Array.from(
      { length: this.board.w * this.board.h },
      (_, uid) => ({
        uid,
        open: false,
      }),
    )
    grids.forEach(item => {
      this.grids[item.uid] = item
      item.flag && this.flags.push(item.uid)
    })

    this.initTimer()
    this.timer.duration = timer.duration
    this.state = 'playing'
  }

  save(): StorageOptions {
    return {
      grids: this.grids.filter(value => value.open || value.flag || value.mine),
      board: this.board,
      timer: {
        start: this.timer.start,
        duration: this.timer.duration + Date.now() - this.timer.start,
      },
    }
  }

  redo() {
    if (this.state === 'ready') {
      return
    }
    this.flags.length = 0
    this.grids.forEach(grid => {
      grid.open = false
      grid.flag = false
      grid.boom = false
    })
    this.state = 'playing'
    this.initTimer()
  }

  open(pos: Position, allowOpenAdjacent = false) {
    if (this.state === 'ready') {
      this.initMines(pos)
      this.state = 'playing'
    }
    if (this.state !== 'playing') {
      return
    }
    const grid = this.grids[this.posToUid(pos)]
    if (grid.flag) {
      this.mark(pos)
      return
    }
    if (grid.open && allowOpenAdjacent) {
      this.openAdjacent(grid)
      return
    }
    this.doOpen(grid)
  }

  mark(pos: Position) {
    if (this.state === 'ready') {
      this.initMines(pos)
      this.state = 'playing'
    }
    if (this.state !== 'playing') {
      return
    }
    const grid = this.grids[this.posToUid(pos)]
    if (grid.open) {
      this.openAdjacent(grid)
      return
    }
    grid.flag = !grid.flag
    const index = this.flags.indexOf(grid.uid)
    if (index > -1) {
      this.flags.splice(index, 1)
    } else {
      this.flags.push(grid.uid)
    }
    this.doVictoryJudgement('flag')
  }

  openAdjacent(grid: GridMeta) {
    const adjacent = this.getAdjacentMines(grid)
    if (adjacent === 0) {
      return
    }
    const siblings = this.getSiblings(grid, 'hide')
    if (!siblings.length) {
      return
    }
    let flagCount = 0
    const waitingOpen: GridMeta[] = []
    siblings.forEach(grid => {
      if (!grid.flag) {
        waitingOpen.push(grid)
      } else {
        flagCount++
      }
    })
    if (flagCount === adjacent) {
      waitingOpen.forEach(grid => this.doOpen(grid))
    }
  }

  openAll() {
    if (this.state === 'victory') {
      this.grids.forEach(grid => {
        grid.mine ? (grid.flag = true) : (grid.open = true)
      })
    } else if (this.state === 'defeat') {
      this.grids.forEach(grid => {
        ;(grid.mine || grid.flag) && (grid.open = true)
      })
    }
  }

  doVictoryJudgement(mode: 'open' | 'flag') {
    let victory: boolean
    const count = this.board.m
    if (mode === 'open') {
      let hide = 0
      for (let i = 0; i < this.grids.length && hide < count + 1; i++) {
        !this.grids[i].open && hide++
      }
      victory = hide === count
    } else {
      victory =
        count === this.flags.length &&
        this.flags.every(uid => this.grids[uid].mine)
    }
    if (victory) {
      this.state = 'victory'
      this.openAll()
    }
  }

  doOpen(grid: GridMeta) {
    grid.open = true
    if (grid.mine) {
      grid.boom = true
      this.state = 'defeat'
      this.openAll()
      return
    }
    this.doAutoOpenIfZero(grid)
    this.doVictoryJudgement('open')
  }

  doAutoOpenIfZero(grid: GridMeta) {
    if (this.getAdjacentMines(grid) !== 0) {
      return
    }
    this.getSiblings(grid, 'hide').forEach(grid => {
      if (!grid.flag) {
        grid.open = true
        this.doAutoOpenIfZero(grid)
      }
    })
  }

  getHighlight(pos: Position) {
    const grid = this.grids[this.posToUid(pos)]
    if (!grid.open) {
      return [grid.uid]
    }
    return this.getSiblings(grid, 'hide')
      .filter(grid => !grid.flag)
      .map(grid => grid.uid)
  }

  getAdjacentMines(grid: GridMeta) {
    if (grid.adjacentMines !== undefined) {
      return grid.adjacentMines
    }
    const count = this.getSiblings(grid, 'mine').length
    grid.adjacentMines = count
    return count
  }

  getSiblings(grid: GridMeta, mode?: 'mine' | 'hide'): GridMeta[] {
    const result: GridMeta[] = []
    const { w, h } = this.board
    const pos = this.uidToPos(grid.uid)
    const vec = [
      [1, 1],
      [1, 0],
      [1, -1],
      [0, 1],
      [0, -1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ]

    for (let i = 0; i < vec.length; i++) {
      const [dx, dy] = vec[i]
      const x = dx + pos.x
      const y = dy + pos.y
      if (x < 0 || x >= w || y < 0 || y >= h) {
        continue
      }
      const grid = this.grids[this.posToUid({ x, y })]
      if ((mode === 'mine' && !grid.mine) || (mode === 'hide' && grid.open)) {
        continue
      }
      result.push(grid)
    }
    return result
  }
}

function shuffle(source: number[], target: number, excludes?: number[]) {
  let length = source.length
  const result = source.slice()
  if (target > length) target = length

  if (excludes && excludes.length) {
    for (let i = 0; i < excludes.length; i++) {
      length--
      _swap(excludes[i], length)
    }
  }
  for (let i = 0; i < target; i++) {
    _swap(_rand(i, length), i)
    length--
  }
  return result.slice(0, target)

  function _swap(l: number, r: number, arr = result) {
    const temp = arr[l]
    arr[l] = arr[r]
    arr[r] = temp
  }
  // N ∈ [min, max)
  function _rand(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min))
  }
}
