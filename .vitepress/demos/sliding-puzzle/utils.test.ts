import { describe, beforeEach, it, expect } from 'vitest'
import { PriorityQueue, getMoveGuideMap } from './utils'

describe('PriorityQueue', () => {
  let priorityQueue: PriorityQueue<{ f: number }>

  beforeEach(() => {
    priorityQueue = new PriorityQueue()
  })

  it('should enqueue nodes in ascending order of f value', () => {
    const node1 = { f: 3 }
    const node2 = { f: 1 }
    const node3 = { f: 2 }

    priorityQueue.enqueue(node1)
    priorityQueue.enqueue(node2)
    priorityQueue.enqueue(node3)

    expect(priorityQueue.dequeue()).toBe(node2)
    expect(priorityQueue.dequeue()).toBe(node3)
    expect(priorityQueue.dequeue()).toBe(node1)
  })

  it('should dequeue nodes in the order they were enqueued', () => {
    const node1 = { f: 1 }
    const node2 = { f: 2 }
    const node3 = { f: 3 }

    priorityQueue.enqueue(node1)
    priorityQueue.enqueue(node2)
    priorityQueue.enqueue(node3)

    expect(priorityQueue.dequeue()).toBe(node1)
    expect(priorityQueue.dequeue()).toBe(node2)
    expect(priorityQueue.dequeue()).toBe(node3)
  })

  it('should return true if the queue is empty', () => {
    expect(priorityQueue.isEmpty()).toBe(true)
  })

  it('should return false if the queue is not empty', () => {
    priorityQueue.enqueue({ f: 1 })
    expect(priorityQueue.isEmpty()).toBe(false)
  })
})

describe('getMoveGuideMap', () => {
  it('should return the corrent move guide map when no locked positions', () => {
    const w = 3
    const len = 9
    const result = getMoveGuideMap(w, len)
    expect(result).toMatchInlineSnapshot(`
      {
        "0": [
          1,
          3,
        ],
        "1": [
          0,
          2,
          4,
        ],
        "2": [
          1,
          5,
        ],
        "3": [
          0,
          4,
          6,
        ],
        "4": [
          1,
          3,
          5,
          7,
        ],
        "5": [
          2,
          4,
          8,
        ],
        "6": [
          3,
          7,
        ],
        "7": [
          4,
          6,
          8,
        ],
        "8": [
          5,
          7,
        ],
      }
    `)
  })

  it('should return the correct move guide map with locked positions', () => {
    const w = 3
    const len = 9
    const lockedPositions = [1, 3, 5, 7]
    const expectedMap = {
      0: [1],
      1: [],
      2: [1],
      3: [],
      4: [3],
      5: [],
      6: [7],
      7: [],
      8: [7],
    }

    const result = getMoveGuideMap(w, len, lockedPositions)
    expect(result).toMatchInlineSnapshot(`
      {
        "0": [],
        "1": [
          0,
          2,
          4,
        ],
        "2": [],
        "3": [
          0,
          4,
          6,
        ],
        "4": [],
        "5": [
          2,
          4,
          8,
        ],
        "6": [],
        "7": [
          4,
          6,
          8,
        ],
        "8": [],
      }
    `)
  })
})
