---
date: 2023/2/19
title: TypeScript 类型体操
category: 笔记
tags:
  - typescript
---

本文是作者在阅读文档 [types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) 后整理的笔记。主要包含以下内容：

- 介绍一些类型体操的基础操作
- 分析一些 vue 源码中的体操案例
- 列举一些与类型体操相关的开源项目案例

## 基础操作

### 联合：**|**

这可能是使用频率最高的一种类型体操了，它可以让我们得到一个更宽松的类型。比如：

```ts
type Nullish = null | undefined
type Falsy = false | '' | 0 | Nullish
type Primitive = string | number | bigint | boolean | symbol | Nullish
```

### 交叉：**&**

多用于合并多个类型(或者接口)的属性和方法，比如：

```ts
// Foo 和 Bar 可以看作是"相等"的
type Foo = { a: number } & { b: string }
interface Bar {
  a: number
  b: string
}

// 但是这样得到的交叉类型 Foo 在IDE中的提示中不会很好看，可以采用以下体操来”美化“
type Prettier<T> = {
  [P in keyof T]: T[P]
} & {}

type PrettierFoo = Prettier<Foo>
```

### 索引联合：**keyof**

这个也是我们在第三方代码中经常看到的一种操作， `keyof T` 可以得到对象类型的所有属性名组成的联合类型，比如：

```ts
type P = keyof { x: number; y: number; z?: number } // 'x' | 'y' | 'z'
```

### 索引访问：**T[prop]**

这个操作可以让我们得到对象类型中指定属性名的值类型，比如：

```ts
interface Person {
  age: number
  name: string
  alive: boolean
}
type Age = Person['age'] // number
```

对于数组类型来说：  
我们可以使用下标索引来得到数组中对于下标的元素类型，  
也可以使用 `[number]` 来索引数组类型，得到数组中所有元素的联合类型，  
最后，我们还可以使用 `["length"]` 来得到数组的长度的字面量类型

```ts
type Arr = [1, '2', true]
type A1 = Arr[0] // 1
type A2 = Arr[number] // true | 1 | '2'
type A3 = Arr['length'] // 3
```

### 条件类型：**T extends U ? X : Y**

这个操作可以让我们根据类型 T 是否可以赋值给类型 U 来得到类型 X 或 Y，比如：

```ts
// MyExclude<T, U> // 从 T 中排除可以赋值给 U 的类型
type MyExclude<T, U> = T extends U ? never : T

// 从 T 中排除 null 和 undefined
type NotNullable<T> = T extends null | undefined ? never : T
```

另外，这个操作常用于类型体操中实现条件判断逻辑，因此在第三方代码中会经常看到

### 映射类型：**{ [P in K]: T }**

这个操作可以让我们将已有对象类型的属性映射到一个新的类型，比如：

```ts
// OptionsFlags<Type> 用于 将 Type 中的每个属性映射到 boolean 类型
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean
}
interface Features {
  darkMode: () => void
  newUserProfile: () => void
}

type FeatureOptions = OptionsFlags<Features>
// { darkMode: boolean, newUserProfile: boolean }
```

当然，除了变更属性名对应的值的类型外，我们还可以修改属性名本身，比如：  
使用 `+`、`-` 来增删属性名限定符 `readonly`、`?`，  
使用 `as` 来修改属性名本身

```ts
interface Todo {
  title?: string
  description?: string
}
type MyRequired<T> = {
  [P in keyof T]-?: T[P]
}

type RequiredTodo = MyRequired<Todo>
// { title: string, description: string }
```

## 实例分析

> TODO...

## 更多案例

最后，贴一些我在 GitHub 上发现的与 TypeScript 类型体操相关的项目：

[**type-challenges/type-challenges**](https://github.com/type-challenges/type-challenges)

- 有很多有趣的类型挑战题目
- 练习环境非常方便，可以通过 TypeScript 官网的在线编辑器练习，也可以在 vscode 上安装插件来练习

<GitRepoCard endPoint="type-challenges/type-challenges" />

[**sindresorhus/type-fest**](https://github.com/sindresorhus/type-fest)

- 一个包含了许多实用的 TypeScript 类型的轮子库
- 可以在项目中安装使用（它的 [NPM 周下载量](https://www.npmjs.com/package/type-fest) 很是惊人），也可以作为类型体操工具库参考

<GitRepoCard endPoint="sindresorhus/type-fest" />

[**total-typescript/ts-reset**](https://github.com/total-typescript/ts-reset)

- 你可能听说过 CSS reset 方案，但是 ts reset 又是什么呢？

<GitRepoCard endPoint="total-typescript/ts-reset" />
