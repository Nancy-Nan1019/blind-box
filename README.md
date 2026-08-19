# Blind Box Gift Booth

这是一个适合部署到 GitHub Pages 的轻量前端页面：

- 6 个盲盒展位
- 礼物内容先用占位文案
- 点击后开盒并锁定
- 使用 `localStorage` 保存本机状态

## 现在怎么用

直接打开 [index.html](D:\XJTLU\playful\index.html) 预览，或者把整个目录推到 GitHub 仓库后开启 GitHub Pages。

## 以后怎么改礼物

编辑 [script.js](D:\XJTLU\playful\script.js) 顶部的 `gifts` 数组：

- `title`：礼物标题
- `teaser`：未打开前显示的占位提示
- `reveal`：打开后弹窗显示的内容
- `icon`：每个展位的表情或小图标

## 同步说明

当前版本是纯前端静态页，只能保存“当前浏览器”的抽取状态。

如果你要实现下面这种效果，就需要加一个轻量后端：

- 不同朋友打开同一个链接，看到同一组已经被抽走的盒子
- 某个人抽走后，其他人页面也同步显示不可再抽

推荐：

1. Supabase
2. Firebase

这两种都适合和 GitHub Pages 搭配，而且不需要你自己维护服务器。
