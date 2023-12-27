---
date: 2023/4/6
title: Git 撤销操作
category: 笔记
tags:
  - git
---

记得自己刚接触 git 的时候，有看到过这么一种说法：git 很强，强大到只要文件被追踪，就不用担心出现丢失问题。在平时使用中，我也确实感受到了 git 的强大，不过有时会面临一些使用困境。

究其原因，一方面是相关的命令太多，自己想不起来怎么用，另一方面还是担心一顿操作后把自己，甚至他人的提交给弄没了。

本文尝试归纳一些常见的撤销命令，同时列举了一些应用情景，用作备忘。

## reset 和 revert

> 选项参考：[git reset](https://git-scm.com/docs/git-reset) | [git revert](https://git-scm.com/docs/git-revert)

### 使用 git reset

一般来说，reset 用于将 HEAD 重置到指定的某次提交。常见有以下三种选项：  
`--mixed`、`--soft`、`--hard`。

关于它们的区别，这里我动手实践了一下：  
用以下 4 个文件来分别代表 git 仓库中文件可能的状态，然后执行 `git reset HEAD`，记录附带不同选项后时的执行结果。

::: code-group

```bash [每次操作前的状态]
$ git status -u
 M README.md     # 有修改但未暂存的文件
A  new.md        # 新添加到暂存区的文件
M  package.json  # 有修改并且暂存的文件
?? untracked.md  # 新添加的还没有被追踪的文件
```

```bash [执行 git reset --mixed]
$ git reset HEAD
Unstaged changes after reset:
M       README.md
M       package.json

$ git status -s
 M README.md
 M package.json
?? new.md
?? untracked.md
```

```bash [执行 git reset --soft]
$ git reset --soft HEAD

$ git status -s
 M README.md
A  new.md
M  package.json
?? untracked.md
```

```bash [执行 git reset --hard]
$ git reset --hard HEAD
HEAD is now at 995624923 fix(components): <commit message...>
$ git status -s
?? untracked.md
```

:::

将结果整理成表格如下：

| 文件名       | 操作前状态   | mixed           | soft   | hard          |
| ------------ | ------------ | --------------- | ------ | ------------- |
| README.md    | 修改后未暂存 | 无变化          | 无变化 | ✂️ 修改会被删 |
| package.json | 修改后已暂存 | 🧹 修改后未暂存 | 无变化 | ✂️ 修改会被删 |
| new.md       | 新添加已暂存 | 🧹 新添加未暂存 | 无变化 | ✂️ 修改会被删 |
| untracked.md | 新添加未暂存 | 无变化          | 无变化 | 无变化        |

由此可知：

- 这三者都只会操作已经被 git 追踪的文件，不会影响未被追踪的文件
- mixed 和 soft 选项并不会造成改动丢失，而 hard 会有丢失改动的风险
- mixed 会把暂存区域打扫干净

::: info 📌 关于 HEAD 指针

- 个人觉得这是 git 中很重要的一个概念，也是后续理解 git 分支的基础
- HEAD 是当前分支引用的指针，指向该分支上一次的 commit-id，每进行一次成功提交，HEAD 指针都会向前移动一次
- 使用 `git reset HEAD~` (等效于 `git reset HEAD~1`)， 意味者将当前分支重置到最近的一次提交前，HEAD 指针会**向后退一步**，而使用 `git reset HEAD`， 意味着重置暂存区，此时 HEAD 指针并**不会移动**

:::

### 回撤 git reset

如果 `git reset` 后需要撤销，可以考虑命令 `git reset <commit-id>` (用具体的 commit-id 来代替 HEAD)。  
另外，可通过使用 `git reflog` 来查找曾经提交（仅限本地和 90 天内）的 commit-id。

### 使用 git revert

一种向前的撤销操作，它不会影响已有的提交历史记录。而是在反转指定的更改后，创建一个新的提交记录。相当于撤销成功后 HEAD 指针继续向前移动。

默认情况下使用 revert 后会自动创建一个新的提交来反转指定的更改。我们可以添加 `-no-commit` 选项（或者缩写 `-n`）来禁止自动提交。

另外，revert 后若自动提交失败则表示有文件冲突，需要我们手动合并。

```bash
# 撤销最近的提交
git revert
# 撤销倒数第二次的提交
git revert HEAD~1
# 根据提交记录sha值撤销指定的某次提交
git revert < commit-id >
# 按范围撤销
# 比如撤销master分支上倒数第五次到倒数第二次（包含）之间的所有提交
# 也可以用对应sha值代替master~5，注意不要写错起始顺序
git revert -n master~5..master~2
```

### 回撤 git revert

- 再次使用 git revert （像是“撤销上次的撤销”）
- 使用 git reset

### 使用哪个 ❓

诚然，明面上看，使用 reset 回滚代码可以让主分支提交记录看起来更整洁，因为它舍弃了中间的可能是错误的提交记录，但是也给日后的回溯带来了一定的困难。  
在都能达到回滚目的的前提下，使用哪个就看 **更倾向于**：

- 尽可能留下完整的提交记录，使用 `git revert`（哪怕它是一次错误的提交，但是留着错误提交记录，吃一堑长一智）
- 尽可能留下干净的提交记录，使用 `git reset`（删掉出错的提交，给他人呈现一个干净的提交记录）

## clean 和 rm

> 选项参考 [git clean](https://git-scm.com/docs/git-clean) | [git rm](https://git-scm.com/docs/git-rm)

### 使用 git clean

用于删除工作目录下**未被 git 追踪**的文件。

- `git clean -n`： 提前告知用户哪些文件会被删除，并不会真的删除
- `git clean -f`： 请谨慎使用任何一个 `-f` 选项 误删了后文件真的找不回来了
- `git clean -df`： `-d` 表示目录 删除未被追踪的空目录
- `git clean -dfx`：删除所有没有被跟踪的文件和目录 包括那些被忽略的文件

### 使用 git rm

用于删除**已被 git 追踪**的文件。

- `git rm <file>`： 将文件从工作区和暂存区中删除
- `git rm -f <file>`： 强制将文件从工作区和暂存区中删除，即使文件有修改
- `git rm --cached <file>`： 将文件从暂存区中删除，但保留在工作区中
- `git rm -r <dir>`： 递归地将目录及其子目录下的所有文件从工作区和暂存区中删除

## checkout 和 restore

TODO...

## 小结

**撤回 git add 的备选方案：**

- `git restore --staged <file>`： 将指定文件从暂存区恢复到工作目录
- `git restore --staged .`： 将所有文件从暂存区恢复到工作目录
- `git reset <file>`： 将指定文件从暂存区移除
- `git reset .`： 将所有文件从暂存区移除
- `git rm --cached <file>`： 将文件从暂存区中移除

**撤回 git commit 的备选方案：**

- `git revert <commit>`： 创建一个新的提交，用于撤销指定提交的修改
- `git reset --soft <commit>`： 将当前分支重置到指定提交，并将修改放到暂存区
- `git reset --mixed <commit>`： 将当前分支重置到指定提交，并将修改放到工作目录
- `git reset --hard <commit>`： 将当前分支重置到指定提交，并丢弃所有修改

**撤回 git push 的备选方案：**

- `git revert <commit>`： 创建一个新的提交，用于撤销指定的提交，并将其推送到远程分支
- `git reset --hard <commit>`：
  1. 将本地分支重置到指定的提交
  2. 然后使用 `-f` 选项将其推送到远程分支
  3. 这会丢失本地和远程的修改，不建议在有多人协作的仓库上使用
- `git rebase -i <commit>`：
  1. 使用交互式模式重写本地分支的历史，用于删除或修改不需要的提交
  2. 然后使用 `-f` 选项将其推送到远程分支
  3. 这也会改变本地和远程的历史，同理不建议在有多人协作的仓库上使用

## 情景模拟

### 情景一

> 假设我接到了一个任务，在修改了位于 src 目录下的某几个文件后，准备下班回家。但是因为还没有完全搞定，我就先使用 `git add .` 暂存起来，打算等明天全部搞完了再提交。  
> 结果第二天过来后不小心（"故意搞事"）执行了 `git rm -rf src/*`，那么我昨天的暂存记录还能找回来吗？😢

这里使用 git reset 只能恢复被误删的文件，但是暂存记录还是丢失了。不过可以使用 git fsck 命令来查找丢失的文件。  
具体的操作步骤如下：  
运行 `git fsck --lost-found` 命令，这会显示你的仓库中所有的丢失对象，比如：

```bash
dangling blob adb42b2f0dd6c5bb52be6049bd63fb3e14eef86f
dangling blob 7e491fa4f8a4f4879b87a29e911ed2b50f7b83a8
dangling blob a906cb2a4a904a152e80877d4088654daad0c859
```

运行 `git cat-file -p adb42b2f0dd6c5bb52be6049bd63fb3e14eef86f` 命令，这会显示对象的内容，比如：

```bash
This is a private picture
```

如果你确认这是你想要恢复的文件，你可以运行 `git cat-file -p adb42b2f0dd6c5bb52be6049bd63fb3e14eef86f > src/private.jpg` 命令，  
这会将对象的内容写入到一个新的文件中。

:::tip 💡 事后总结

平时还是尽量多使用 **git commit** 来保存记录，另外不用担心本地分支在推送前有过多的提交记录，有需要可以在正式推送前可以使用 git reset 方法 "打平" 一下

:::

### 情景二

> 假设某次在提交文件时，我把一张私密图片当资源图给提交了，并且还顺带推送到了远端。当我意识到问题后，该如何撤销回来，而且不留痕迹？

撤回可参考上文撤回 git push 的备选方案。

但若想要不留痕迹，得考虑使用 `-f` 选项，但是在多人协作的仓库中，`-f` 会给其他人带来麻烦，而且可能会要求账户有对应的权限。所以，可能的情况下还是和其他成员提前打个招呼（先不要拉取或者推送代码到该远程分支），然后再操作。

:::tip 💡 事后总结

在向重要的公共仓库 push 代码时，相比于为可能出现的错误的提交买单，多检查一下要提交的文件总是值得的。

:::

另外关于 `-f` 选项，这里插一句，时不时在网上看到有人在错误的目录下执行了 `rm -rf` 命令而酿成"惨案"。谨慎一点的做法是提前在系统上重命名 `rm -rf` ，改为移动到某个指定的临时目录，这样只需要定期清理一下该目录，避免 `rm -rf` 的隐患。

## 后记

我发现在日常使用中，将问题丢给 `ChatGPT` 或者 `new bing`，也能获得一些不错的解决方案，尤其是当自己毫无头绪的时候 🤔。

最近发现的这个搜索引擎也不错：[devv.ai](https://devv.ai/zh)，不用魔法，免费使用。
