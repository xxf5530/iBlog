---
date: 2023/2/25
title: TypeScript 类型挑战
category: 笔记
tags:
  - typescript
outline: 3
---

整理一些个人解题笔记。所有题目均来源于该开源项目 [type-challenges](https://github.com/type-challenges/type-challenges) 🙏。

::: details 📋 题目列表

[[TOC]]

:::

## Built in

### Pick

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md) | [Playground](https://tsch.js.org/4/play)

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
// should be { title: string, completed: string }
```

<T>

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

</T>

### Exclude

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md) | [Playground](https://tsch.js.org/43/play)

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

<T>

```ts
type MyExclude<T, U> = T extends U ? never : T
```

</T>

### Parameters

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/03312-easy-parameters/README.md) | [Playground](https://tsch.js.org/3312/play)

```ts
function foo(arg1: string, arg2: number): void {}
type FunctionParamsType = MyParameters<typeof foo>
// [arg1: string, arg2: number]
```

<T>

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never
```

</T>

### Get Return type

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00002-medium-return-type/README.md) | [Playground](https://tsch.js.org/2/play)

```ts
function fn(v: boolean) {
  if (v) return 1
  else return 2
}
type a = MyReturnType<typeof fn> // should be "1 | 2"
```

<T>

```ts
type MyReturnType<T extends (...args: any) => unknown> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

</T>

### Omit

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md) | [Playground](https://tsch.js.org/3/play)

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>
// { completed: boolean }
```

<T>

```ts
// resolve$1
type MyOmit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P]
}

// resolve$2
type MyOmit$2<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

</T>

### Awaited

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00189-easy-awaited/README.md) | [Playground](https://tsch.js.org/189/play)

```ts
type ExampleType = Promise<string>
type Result = MyAwaited<ExampleType> // string
```

<T>

```ts
type MyAwaited<T> = T extends PromiseLike<infer F> ? MyAwaited<F> : T

type Awaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
  ? F extends (value: infer V, ...args: infer _) => any
    ? Awaited<V>
    : never
  : T
```

</T>

> [官方实现](https://github.com/microsoft/TypeScript/blob/7d1cc88a8cbdf8aa847a7f2a7d4bfeb89c8dde15/lib/lib.es5.d.ts#L1553)

### Promise.all

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00020-medium-promise-all/README.md) | [Playground](https://tsch.js.org/20/play)

```ts
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo')
})

const p = PromiseAll([promise1, promise2, promise3] as const)
// Promise<[number, 42, string]>
```

<T>

```ts
declare function PromiseAll<T extends unknown[]>(
  values: readonly [...T]
): Promise<{
  [key in keyof T]: Awaited<T[key]>
}>
```

</T>

## Array

### First of Array

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.md) | [Playground](https://tsch.js.org/14/play)

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]
type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

<T>

```ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
```

</T>

### Concat

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00533-easy-concat/README.md) | [Playground](https://tsch.js.org/533/play)

```ts
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

<T>

```ts
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
```

</T>

### Includes

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00898-easy-includes/README.md) | [Playground](https://tsch.js.org/898/play)

```ts
// expected to be `false`
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>
```

> [isEqual](https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650)

<T>

```ts
type isEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false

type Includes<T extends readonly any[], U> = T extends [infer F, ...infer R]
  ? isEqual<F, U> extends true
    ? true
    : Includes<R, U>
  : false
```

</T>

### Push

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/03057-easy-push/README.md) | [Playground](https://tsch.js.org/3057/play)

```ts
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

<T>

```ts
type Push<T, U> = T extends unknown[] ? [...T, U] : never
```

</T>

### AnyOf

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00949-medium-anyof/README.md) | [Playground](https://tsch.js.org/949/play)

类型接收一个数组，如果数组中任一个元素为真，则返回 `true`，否则返回 `false`  
如果数组为空，返回 `false`

```ts
type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
```

<T>

```ts
type False = null | undefined | 0 | '' | false | [] | Record<PropertyKey, never>
type AnyOf<T extends readonly any[]> = T[number] extends False ? false : true
```

</T>

### IndexOf

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/05153-medium-indexof/README.md) | [Playground](https://tsch.js.org/5153/play)

```ts
type Res = IndexOf<[1, 2, 3], 2> // expected to be 1
type Res1 = IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3> // expected to be 2
type Res2 = IndexOf<[0, 0, 0], 2> // expected to be -1
```

<T>

```ts
type IndexOf<T extends any[], U, LEN extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? isEqual<F, U> extends true
    ? LEN['length']
    : IndexOf<R, U, [1, ...H]>
  : -1
```

</T>

### LastIndexOf

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/05317-medium-lastindexof/README.md) | [Playground](https://tsch.js.org/5317/play)

```ts
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
```

<T>

```ts
type LastIndexOf<
  T extends any[],
  U,
  RES extends number = -1,
  LEN extends any[] = []
> = T extends [infer F, ...infer R]
  ? isEqual<F, U> extends true
    ? LastIndexOf<R, U, LEN['length'], [...LEN, 1]>
    : LastIndexOf<R, U, RES, [...LEN, 1]>
  : RES
```

</T>

### Without

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/05117-medium-without/README.md) | [Playground](https://tsch.js.org/5117/play)

```ts
type Res = Without<[1, 2], 1> // expected to be [2]
type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]> // expected to be [4, 5]
type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]> // expected to be []
```

<T>

```ts
// resolve$1
type ToUnion<T> = T extends any[] ? T[number] : T

type Without<T extends any[], U, RES extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? F extends ToUnion<U>
    ? Without<R, U, RES>
    : Without<R, U, [...RES, F]>
  : RES

// resolve$2
type Arrayable<T> = T extends any[] ? T : [T]

type Without$1<T extends any[], U, RES extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? Includes<Arrayable<U>, F> extends true
    ? Without$1<R, U, RES>
    : Without$1<R, U, [...RES, F]>
  : RES
```

</T>

### Flatten

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00459-medium-flatten/README.md) | [Playground](https://tsch.js.org/459/play)

```ts
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

<T>

```ts
type Flatten<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : T
```

</T>

### FlattenDepth

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/03243-medium-flattendepth/README.md) | [Playground](https://tsch.js.org/3243/play)

```ts
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>
// [1, 2, 3, 4, [5]]. flatten 2 times

type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]>
// [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```

<T>

```ts
type FlattenDepth<
  T extends any[],
  K = 1,
  LEN extends any[] = []
> = K extends LEN['length']
  ? T
  : T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...FlattenDepth<F, K, [...LEN, 1]>, ...FlattenDepth<R, K, LEN>]
    : [F, ...FlattenDepth<R, K, LEN>]
  : T
```

</T>

### Greater Than

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/04425-medium-greater-than/README.md) | [Playground](https://tsch.js.org/4425/play)

```ts
GreaterThan<2, 1> // true
GreaterThan<1, 1> // false
GreaterThan<10, 100> // false
GreaterThan<111, 11> // true
```

<T>

```ts
type GreaterThan<
  T extends number,
  U extends number,
  LEN extends any[] = []
> = T extends LEN['length']
  ? false
  : U extends LEN['length']
  ? true
  : GreaterThan<T, U, [...LEN, 1]>
```

</T>

### Unique

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/05360-medium-unique/README.md) | [Playground](https://tsch.js.org/5360/play)

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>
// expected to be [1, 2, 3]

type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>
// expected to be [1, 2, 3, 4, 5, 6, 7]

type Res2 = Unique<[1, 'a', 2, 'b', 2, 'a']>
// expected to be [1, "a", 2, "b"]

type Res3 = Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>
// expected to be [string, number, 1, "a", 2, "b"]

type Res4 = Unique<[unknown, unknown, any, any, never, never]>
// expected to be [unknown, any, never]
```

<T>

```ts
// see ##Includes
type Unique<T extends any[], RES extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? Includes<RES, F> extends true
    ? Unique<R, RES>
    : Unique<R, [...RES, F]>
  : RES
```

</T>

### Join

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/05310-medium-join/README.md) | [Playground](https://tsch.js.org/5310/play)

```ts
type Res = Join<['a', 'p', 'p', 'l', 'e'], '-'> // expected to be 'a-p-p-l-e'
type Res1 = Join<['Hello', 'World'], ' '> // expected to be 'Hello World'
type Res2 = Join<['2', '2', '2'], 1> // expected to be '21212'
type Res3 = Join<['o'], 'u'> // expected to be 'o'
type Res4 = Join<[], 'u'> // expected to be ''
```

<T>

```ts
type Join<T extends unknown[], U extends string | number> = T extends [
  infer F,
  ...infer R
]
  ? R['length'] extends 0
    ? `${F & string}`
    : `${F & string}${U}${Join<R, U>}`
  : ''
```

</T>

## Object

### Merge

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00599-medium-merge/README.md) | [Playground](https://tsch.js.org/599/play)

```ts
interface foo {
  name: string
  age: string
}
interface coo {
  age: number
  sex: string
}

type Result = Merge<foo, coo>
// expected to be { name: string, age: number, sex: string }
```

<T>

```ts
type Merge<F, S> = {
  [P in keyof F | keyof S]: P extends keyof S
    ? S[P]
    : P extends keyof F
    ? F[P]
    : never
}
```

</T>

### Diff

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00645-medium-diff/README.md) | [Playground](https://tsch.js.org/645/play)

```ts
interface Foo {
  name: string
  age: string
}
interface Bar {
  name: string
  age: string
  gender: number
}

type Result = Diff<Foo, Bar>
// expected to be { gender: number }
```

<T>

```ts
type RemoveNever<O> = {
  [P in keyof O as O[P] extends never ? never : P]: O[P]
}

type Diff<O, O1> = RemoveNever<{
  [P in keyof O | keyof O1]: P extends keyof O
    ? P extends keyof O1
      ? never
      : P extends keyof O
      ? O[P]
      : never
    : P extends keyof O1
    ? O1[P]
    : never
}>
```

</T>

### PickByType

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/02595-medium-pickbytype/README.md) | [Playground](https://tsch.js.org/2595/play)

```ts
type OnlyBoolean = PickByType<
  {
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
  },
  boolean
> // { isReadonly: boolean, isEnable: boolean }
```

<T>

```ts
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P]
}
```

</T>

### PartialByKeys

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/02757-medium-partialbykeys/README.md) | [Playground](https://tsch.js.org/2757/play)

```ts
interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'>
// { name?:string; age:number; address:string }
```

<T>

```ts
type Join<T> = {
  [P in keyof T]: T[P]
}

type PartialByKeys<T, K> = Join<
  {
    [P in keyof T as P extends K ? P : never]?: T[P]
  } & {
    [P in keyof T as P extends K ? never : P]: T[P]
  }
>
```

</T>

### OmitByType

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/02852-medium-omitbytype/README.md) | [Playground](https://tsch.js.org/2852/play)

```ts
type OmitBoolean = OmitByType<
  {
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
  },
  boolean
> // { name: string; count: number }
```

<T>

```ts
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P]
}
```

</T>

### RequiredByKeys

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/02759-medium-requiredbykeys/README.md) | [Playground](https://tsch.js.org/2759/play)

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'>
// { name: string; age?: number; address?: string }
```

<T>

```ts
type Join<T> = {
  [P in keyof T]: T[P]
}
type RequiredByKeys<T, K = keyof T> = Join<
  {
    [P in keyof T as P extends K ? P : never]-?: T[P]
  } & {
    [P in keyof T as P extends K ? never : P]?: T[P]
  }
>

// resolve2
type Copy<T> = Pick<T, keyof T>

type RequiredByKeys$1<T, K = keyof T> = Copy<
  Omit<T, K & keyof T> & Required<Pick<T, K & keyof T>>
>
```

</T>

### ObjectEntries

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/02946-medium-objectentries/README.md) | [Playground](https://tsch.js.org/2946/play)

```ts
interface Model {
  name: string
  age: number
  locations: string[] | null
}

type modelEntries = ObjectEntries<Model>
// ['name', string] | ['age', number] | ['locations', string[] | null]
```

<T>

```ts
//
```

</T>

### Tuple to Nested Object

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/03188-medium-tuple-to-nested-object/README.md) | [Playground](https://tsch.js.org/3188/play)

```ts
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean>
// boolean. if the tuple is empty, just return the U type
```

<T>

```ts
//
```

</T>

### Flip

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/04179-medium-flip/README.md) | [Playground](https://tsch.js.org/4179/play)

```ts
Flip<{ a: 'x'; b: 'y'; c: 'z' }> // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1; b: 2; c: 3 }> // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false; b: true }> // {false: 'a', true: 'b'}
```

<T>

```ts
type Flip<T extends Record<PropertyKey, any>> = {
  [P in keyof T as T[P] extends PropertyKey ? T[P] : `${T[P]}`]: P
}
```

</T>

### InorderTraversal

> [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/03376-medium-inordertraversal/README.md) | [Playground](https://tsch.js.org/3376/play)

```ts
const tree1 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null,
    },
    right: null,
  },
} as const

type A = InorderTraversal<typeof tree1> // [1, 3, 2]
```

<T>

```ts
//
```

</T>
