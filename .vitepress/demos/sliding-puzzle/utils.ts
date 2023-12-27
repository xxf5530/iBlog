type Board = number[]

interface SearchNode {
  board: Board
  parent?: SearchNode
  g: number
  f: number
}

export class PriorityQueue<T extends { f: number }> {
  private queue: T[] = []

  enqueue(node: T) {
    let added = false
    for (let i = 0; i < this.queue.length; i++) {
      if (node.f < this.queue[i].f) {
        this.queue.splice(i, 0, node)
        added = true
        break
      }
    }
    if (!added) {
      this.queue.push(node)
    }
  }

  dequeue() {
    return this.queue.shift()
  }

  isEmpty() {
    return this.queue.length === 0
  }
}

function heuristic$1(board: Board) {
  let h = 0
  board.forEach((num, i) => {
    if (num !== 0 && num !== i + 1) {
      h++
    }
  })
  return h
}

function heuristic$2(board: Board, width: number) {
  let h = 0
  board.forEach((num, i) => {
    if (num !== 0 && i !== num - 1) {
      const x1 = i % width
      const y1 = Math.floor(i / width)
      const targetIndex = num - 1
      const x2 = targetIndex % width
      const y2 = Math.floor(targetIndex / width)
      h += Math.abs(x1 - x2) + Math.abs(y1 - y2)
    }
  })
  return h
}

function heuristic$3(board: Board, cache: number[][]) {
  let h = 0
  board.forEach((num, i) => {
    if (num !== 0 && i !== num - 1) {
      h += cache[i][num - 1]
    }
  })
  return h
}

function linearConflict(board: Board, width: number) {
  let count = 0
  const total = board.length
  for (let i = 0; i < total; i++) {
    const num = board[i]
    if (num !== 0) {
      const row1 = Math.floor(num / width)
      const col1 = num % width
      for (let j = i + 1; j < total; j++) {
        const num2 = board[j]
        if (num2 !== 0 && num > num2) {
          const row2 = Math.floor(num2 / width)
          const col2 = num2 % width
          if (row1 === row2) {
            count++
          }
          if (col1 === col2) {
            count++
          }
        }
      }
    }
  }
  return count
}

function getCachedManhattanDistance(total: number, width: number) {
  const cache: number[][] = Array.from({ length: total }, () =>
    Array(total).fill(0),
  )
  for (let i = 0; i < total; i++) {
    for (let j = 0; j < total; j++) {
      if (i !== j) {
        const x1 = i % width
        const y1 = Math.floor(i / width)
        const x2 = j % width
        const y2 = Math.floor(j / width)
        cache[i][j] = Math.abs(x1 - x2) + Math.abs(y1 - y2)
      }
    }
  }
  return cache
}

function boardHash(board: Board) {
  return board.join(',')
}

function getNextMoveBoard(node: SearchNode, moveMap: Record<number, number[]>) {
  const candidates: Board[] = []
  const blankIndex = node.board.findIndex(value => value === 0)
  moveMap[blankIndex].forEach(nextIndex => {
    let copied = [...node.board]
    copied[nextIndex] = copied[blankIndex]
    copied[blankIndex] = node.board[nextIndex]
    candidates.push(copied)
  })
  return candidates
}

function getMovePathRoad(node: SearchNode) {
  const res: Board[] = []
  while (node) {
    res.push(node.board)
    node = node.parent!
  }
  return res.reverse()
}

export function getMoveGuideMap(
  w: number,
  len: number,
  lockedPositions: number[] = [],
) {
  const map: Record<number, number[]> = {}
  const h = Math.ceil(len / w)
  for (let i = 0; i < len; i++) {
    const arr: number[] = []
    const x = i % w
    const y = Math.floor(i / w)
    if (x > 0) {
      arr.push(i - 1)
    }
    if (x < w - 1) {
      arr.push(i + 1)
    }
    if (y > 0) {
      arr.push(i - w)
    }
    if (y < h - 1) {
      arr.push(i + w)
    }
    map[i] = arr.filter(id => !lockedPositions.includes(id)).sort()
  }
  return map
}

export function solveByAStar(
  from: Board,
  width: number,
  moveMap?: Record<number, number[]>,
) {
  moveMap = moveMap || getMoveGuideMap(width, from.length)
  const distanceCache = getCachedManhattanDistance(from.length, width)
  const target = [
    ...Array.from({ length: from.length - 1 }, (_, i) => i + 1),
    0,
  ]
  const h = (board: Board) =>
    heuristic$3(board, distanceCache) + linearConflict(board, width) * 2

  const beginH = h(from)
  const begin: SearchNode = { board: from, g: 0, f: beginH }
  const targetHash = boardHash(target)
  const open = new PriorityQueue<SearchNode>()
  const closed = new Set<string>()
  open.enqueue(begin)

  while (!open.isEmpty()) {
    const node = open.dequeue()!
    const nodeHash = boardHash(node.board)
    if (nodeHash === targetHash) {
      // console.log('Find Path!!!')
      return getMovePathRoad(node)
    }
    closed.add(nodeHash)
    getNextMoveBoard(node, moveMap).forEach(board => {
      const hash = boardHash(board)
      if (!closed.has(hash)) {
        open.enqueue({
          board,
          parent: node,
          g: node.g,
          f: node.g + 1 + h(board),
        })
      }
    })
  }

  // console.log("Can't find path!!!")
  return
}
