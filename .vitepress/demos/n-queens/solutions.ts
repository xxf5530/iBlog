/**
 * solutions for n-queens problem
 */

export function nQueens$1(n = 8) {
  const results: number[][] = []
  const rows: number[] = Array(n)
  const columns: boolean[] = Array(n)
  const diag1: boolean[] = Array(n)
  const diag2: boolean[] = Array(n)
  backtrack()
  return JSON.stringify(results)

  function backtrack(y = 0) {
    if (y === n) {
      results.push([...rows])
      return
    }
    for (let x = 0; x < n; x++) {
      const d1 = y + x
      const d2 = y - x + n
      if (columns[x] || diag1[d1] || diag2[d2]) {
        continue
      }
      rows[y] = x
      columns[x] = diag1[d1] = diag2[d2] = true
      backtrack(y + 1)
      columns[x] = diag1[d1] = diag2[d2] = false
    }
  }
}

export function nQueens$2(n = 8) {
  const results: number[][] = []
  const rows: number[] = Array(n)
  const columns: boolean[] = Array(n)
  const diag1: boolean[] = Array(n)
  const diag2: boolean[] = Array(n)
  const middle = n % 2 === 0 ? n / 2 : (n + 1) / 2
  backtrack()
  return JSON.stringify(results.concat(cloneOtherHalf()))

  function backtrack(y = 0) {
    if (y === n) {
      results.push([...rows])
      return
    }
    for (let x = 0; x < n; x++) {
      if (y === 0 && x >= middle) {
        return
      }
      const d1 = y + x
      const d2 = y - x + n
      if (columns[x] || diag1[d1] || diag2[d2]) {
        continue
      }
      rows[y] = x
      columns[x] = diag1[d1] = diag2[d2] = true
      backtrack(y + 1)
      columns[x] = diag1[d1] = diag2[d2] = false
    }
  }

  function cloneOtherHalf() {
    let source = results
    const _n = n - 1
    if (n % 2 !== 0) {
      const limit = _n / 2
      source = results.filter(item => item[0]! < limit)
    }
    return source.map(item => item.map(i => _n - i)).reverse()
  }
}

/**
 * provide by github copilot
 */
export function nQueens$3(n = 8) {
  const results: number[][] = []
  const rows: number[] = Array(n)
  let columns: number = 0
  let diag1: number = 0
  let diag2: number = 0
  const middle = n % 2 === 0 ? n / 2 : (n + 1) / 2
  backtrack()
  return JSON.stringify(results.concat(cloneOtherHalf()))

  function backtrack(y = 0) {
    if (y === n) {
      results.push([...rows])
      return
    }
    for (let x = 0; x < n; x++) {
      if (y === 0 && x >= middle) {
        return
      }
      const d1 = y + x
      const d2 = y - x + n
      if (columns & (1 << x) || diag1 & (1 << d1) || diag2 & (1 << d2)) {
        continue
      }
      rows[y] = x
      columns |= 1 << x
      diag1 |= 1 << d1
      diag2 |= 1 << d2
      backtrack(y + 1)
      columns &= ~(1 << x)
      diag1 &= ~(1 << d1)
      diag2 &= ~(1 << d2)
    }
  }

  function cloneOtherHalf() {
    let source = results
    const _n = n - 1
    if (n % 2 !== 0) {
      const limit = _n / 2
      source = results.filter(item => item[0]! < limit)
    }
    return source.map(item => item.map(i => _n - i)).reverse()
  }
}
