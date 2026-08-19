# Hong Kong Gift Booth

Hong Kong Gift Booth 是一个面向朋友聚会与节日分享场景的轻量级盲盒网页。页面以 6 个独立展位为核心，访客进入后可以从中选择一个礼物盲盒，完成一次带有仪式感的开启体验。整个项目采用纯前端实现，适合直接部署到 GitHub Pages、Vercel 或任何静态托管平台。

## Project Overview

网站采用单页结构，强调轻松、明快、适合分享的浏览体验。首屏展示活动名称与抽取入口，主体区域以展位形式呈现全部盲盒，点击后触发开盒状态并弹出礼物详情。当前礼物内容以占位文案呈现，后续只需替换配置即可更新为真实礼物信息。

## Features

- 6 个盲盒展位布局，适合朋友间的小型礼物抽取活动
- 开盒动画与结果弹窗，强化互动感和惊喜感
- 已开启展位自动锁定，避免同一页面内重复抽取
- 移动端与桌面端自适应，适合通过链接直接分享
- 使用浏览器本地存储记录当前设备上的抽取状态

## Use Cases

- 朋友聚会中的礼物抽签
- 节日交换礼物前的在线抽选
- 旅行纪念品或限定小礼物分配
- 线上活动中的轻量互动页面

## Tech Stack

- HTML
- CSS
- JavaScript

项目不依赖构建工具与后端服务，克隆后即可直接运行。

## Local Preview

在本地预览时，直接打开 [index.html](D:\XJTLU\playful\index.html) 即可。

如果使用 VS Code，也可以配合 Live Server 等静态服务工具进行查看。

## Deployment

该项目适合部署到 GitHub Pages：

1. 创建一个公开仓库
2. 上传 [index.html](D:\XJTLU\playful\index.html)、[styles.css](D:\XJTLU\playful\styles.css)、[script.js](D:\XJTLU\playful\script.js)
3. 在仓库 `Settings` 中启用 `Pages`
4. 选择 `main` 分支和根目录作为发布来源
5. 等待 GitHub 生成公开访问链接

## Content Management

礼物内容集中定义在 [script.js](D:\XJTLU\playful\script.js) 顶部的 `gifts` 数组中。每个展位都包含以下字段：

- `boothLabel`：展位编号
- `title`：礼物名称
- `teaser`：未开启前显示的简短提示
- `reveal`：开启后展示的详细说明
- `icon`：展位配图或表情符号

更新礼物时无需调整页面结构，只需替换对应字段内容即可。

## State Persistence

当前版本通过浏览器 `localStorage` 保存开启状态。这意味着：

- 同一台设备刷新页面后，已开启记录会保留
- 不同设备或不同访客之间不会共享抽取状态

如果未来需要实现多人访问同一链接并共享同一批抽取结果，可以在现有前端基础上接入 Supabase 或 Firebase 作为轻量数据层。
