/**
 * model for sliding puzzle (alas known as 15 puzzle)
 */

import { getMoveGuideMap, solveByAStar } from './utils'

type PositionID = number
type MoveCommand = 'up' | 'down' | 'left' | 'right'

export interface TileProps {
  value: any
  position: PositionID
  locked?: boolean
}

export interface ModelProps {
  w: PositionID
  h: PositionID
  times: number
  tiles: TileProps[]
  blank?: any
  lockedPositions?: PositionID[]
}

export class SlidingPuzzleModel implements ModelProps {
  w = 0
  h = 0
  times = 0
  tiles: TileProps[] = []
  win = false
  private currentBlank: TileProps = { value: 0, position: 0 }
  private moveGuideMap: Record<PositionID, PositionID[]> = {}

  constructor(props?: ModelProps) {
    this.reset(props)
  }

  reset(props: Partial<ModelProps> = {}) {
    const {
      w = 3,
      h = 3,
      times = 0,
      tiles = [],
      blank = 0,
      lockedPositions = [],
    } = props

    const length = w * h
    this.moveGuideMap = getMoveGuideMap(w, length, lockedPositions)
    if (tiles.length === 0) {
      this.tiles = Array.from(
        {
          length: length - 1,
        },
        (_, i) => ({ value: i + 1, position: i })
      )
      this.currentBlank = {
        value: blank,
        position: length - 1,
      }
    } else {
      this.tiles = tiles
      this.currentBlank = {
        value: blank,
        position: tiles.reduce(
          (prev, curr) => prev - curr.position,
          length * (length - 1) * 0.5
        ),
      }
    }
    this.w = w
    this.h = h
    this.times = times
    this.win = false
  }

  shuffle(loops?: number) {
    const length = this.w * this.h
    if (length === 0) {
      return
    }
    loops = loops ?? length * 20
    for (let i = 0; i < loops; i++) {
      this.moveOnceRandom()
    }
  }

  move(args: TileProps | PositionID | MoveCommand) {
    if (this.win) {
      return
    }
    if (typeof args === 'string') {
      this.moveOnceByCommand(args)
    } else {
      this.moveOnce(args)
    }
    this.win = this.isWin(this.tiles)
  }

  moveOnceRandom() {
    const moveList = this.moveGuideMap[this.currentBlank.position]
    const moveFrom = moveList[Math.floor(Math.random() * moveList.length)]
    this.moveOnce(moveFrom)
  }

  isWin(tiles: TileProps[]) {
    return tiles.every((tile, i) => tile.position === i)
  }

  solve() {
    const from = new Array(this.tiles.length + 1).fill(0)
    this.tiles.forEach(tile => (from[tile.position] = tile.value))
    const road = solveByAStar(from, this.w, this.moveGuideMap)
    if (!road) {
      return
    }
    let path: PositionID[] = []
    for (let i = 1; i < road.length; i++) {
      const from = road[i].findIndex(v => v === 0)
      path.push(from)
    }
    return path
  }

  private moveOnceByCommand(direction: MoveCommand) {
    let x = this.currentBlank.position % this.w
    let y = Math.floor(this.currentBlank.position / this.w)
    if (direction === 'up') {
      y += 1
    } else if (direction === 'down') {
      y -= 1
    } else if (direction === 'left') {
      x += 1
    } else {
      x -= 1
    }
    const movePositionFrom = y * this.w + x
    this.moveOnce(movePositionFrom)
  }

  private moveOnce(args: TileProps | PositionID) {
    const isObject = typeof args === 'object'
    const fromID = isObject ? args.position : args
    const moveList = this.moveGuideMap[this.currentBlank.position]
    if (!moveList.includes(fromID)) {
      return
    }
    const fromTile = isObject
      ? args
      : this.tiles.find(tile => tile.position === fromID)!
    fromTile.position = this.currentBlank.position
    this.currentBlank.position = fromID
    this.times++
  }
}
