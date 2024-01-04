import sum from 'hash-sum'

type Board = number[]

interface AStarSearchNode {
  board: Board
  parent?: AStarSearchNode
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

function manhattanDistance$1(board: Board, width: number) {
  let distance = 0
  board.forEach((num, i) => {
    if (num !== 0 && num !== i + 1) {
      const x1 = i % width
      const y1 = Math.floor(i / width)
      const x2 = (num - 1) % width
      const y2 = Math.floor((num - 1) / width)
      distance += Math.abs(x1 - x2) + Math.abs(y1 - y2)
    }
  })
  return distance
}

function manhattanDistance$2(board: Board, cache: number[][]) {
  let distance = 0
  board.forEach((num, i) => {
    if (num !== 0 && num !== i + 1) {
      distance += cache[i][num - 1]
    }
  })
  return distance
}

function getManhattanDistanceCache(total: number, width: number) {
  const cache: number[][] = Array.from({ length: total }, () => Array(total).fill(0))
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

function boardHash$1(board: Board) {
  return board.join(',')
}

function boardHash$2(board: Board) {
  return sum(board)
}

export function getMoveGuideMap(w: number, len: number, lockedPositions: number[] = []) {
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

function getNextBoard(node: AStarSearchNode, moveMap: Record<number, number[]>) {
  const candidates: Board[] = []
  const blankIndex = node.board.indexOf(0)
  if (blankIndex !== -1) {
    moveMap[blankIndex].forEach(nextIndex => {
      let copied = [...node.board]
      copied[nextIndex] = copied[blankIndex]
      copied[blankIndex] = node.board[nextIndex]
      candidates.push(copied)
    })
  }
  return candidates
}

function getMovePath(node: AStarSearchNode) {
  const path: Board[] = []
  let current: AStarSearchNode | undefined = node
  while (current) {
    path.push(current.board)
    current = current.parent
  }
  return path.reverse()
}

export function solveByAStar(from: Board, width: number, moveMap?: Record<number, number[]>) {
  moveMap = moveMap || getMoveGuideMap(width, from.length)
  const cache = getManhattanDistanceCache(from.length, width)
  const h = (board: Board) => manhattanDistance$2(board, cache) + linearConflict(board, width) * 2
  const hash = boardHash$2

  const begin: AStarSearchNode = { board: from, g: 0, f: h(from) }
  const targetHash = hash([...Array.from({ length: from.length - 1 }, (_, i) => i + 1), 0])
  const closed = new Set<string>()
  const open = new PriorityQueue<AStarSearchNode>()
  open.enqueue(begin)

  while (!open.isEmpty()) {
    const node = open.dequeue()!
    const nodeHash = hash(node.board)
    if (nodeHash === targetHash) {
      return getMovePath(node)
    }
    closed.add(nodeHash)
    getNextBoard(node, moveMap).forEach(board => {
      const boardHash = hash(board)
      if (!closed.has(boardHash)) {
        const g = node.g + 1
        const f = g + h(board)
        open.enqueue({ board, parent: node, g, f })
      }
    })
  }
}
