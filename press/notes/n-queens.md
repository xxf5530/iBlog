---
date: 2023/2/26
title: 八皇后问题
category: 问答
tags:
  - 算法
---

🤔 如何能够在 8×8 的国际象棋棋盘上放置八个皇后，使得任何一个皇后都无法直接攻击其他的皇后？
即要求任两个皇后都不能处于同一条横行、纵行或对角线上。

## 问题说明

这个问题可以扩展成以下三个问题：

1. 找到总共有多少种摆法
2. 找到其中一种具体摆法
3. 找到所有具体摆法

经过我在网上一顿搜索，其中：

- 问题 1 有个更通用的名词描述 —— "禁位排列"，可以通过通项公式直接求解
- 问题 2 也有相应数学公式，使用"构造法"可在 O(1) 的时间复杂度内得到解

不过问题 1、2 涉及到大量数学推导，一时半会挺难搞懂，我这里主要目的是尝试用计算机来“暴力”求解问题 3。

简单来说，就是先使用回溯算法求得八皇后问题的所有具体摆法，然后设计一个前端组件，用于动态展示对应的摆放方案。这个组件也可以演示 N 皇后的摆放，不过由于算法，硬件等限制，目前只计算到 "十五皇后"（在我的笔记本上，算出答案需要 9 秒左右）。

## 摆法展示

> N 表示皇后数量（1 ≤ N ≤ 15）

## 代码示例

<details class="note">
  <summary>使用回溯算法的一种解法示例</summary>

```ts
function nQueens(n = 8) {
  const results: number[][] = []
  // 记录行中皇后的位置 rows[0] = 1 表示第 1 行的皇后在第 2 列
  const rows: number[] = Array(n)
  // 记录列中是否有皇后 cols[0] = true 表示第 1 列有皇后
  const cols: boolean[] = Array(n)
  // 记录主对角线是否有皇后（与水平轴夹角为 45°）
  const deg1: boolean[] = Array(n)
  // 记录副对角线是否有皇后（与水平轴夹角为 135°）
  const deg2: boolean[] = Array(n)

  // 回溯 默认从第 1 行开始
  backtrack()
  return results

  function backtrack(row = 0) {
    if (row === n) {
      // 找到一种解法，记录之
      results.push(rows.slice())
      return
    }
    for (let col = 0; col < n; col++) {
      const d1 = row + col
      const d2 = row - col + n
      // 剪枝 不允许该格子所在 (列 或 主对角线 或 副对角线) 包含皇后
      if (cols[col] || deg1[d1] || deg2[d2]) {
        continue
      }
      rows[row] = col // 该格子[row, col]可以放置皇后
      cols[col] = deg1[d1] = deg2[d2] = true // 标记状态
      backtrack(row + 1) // 尝试放置下一行的皇后
      cols[col] = deg1[d1] = deg2[d2] = false // 回溯 撤销标记
    }
  }
}
```

</details>

## 参考链接

- [Eight_queens_puzzle | wiki](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
- [51. N 皇后 | 力扣](https://leetcode.cn/problems/n-queens/solution/)
- [N 皇后问题 – 构造法原理与证明](https://exp-blog.com/algorithm/n-huang-hou-wen-ti/)
