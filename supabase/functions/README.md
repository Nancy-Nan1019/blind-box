# Supabase Functions

本目录包含 `Hong Kong Gift Booth` 使用的 Supabase Edge Function。

## reset-boxes

`reset-boxes` 用于通过管理员密码重置全部盲盒状态。

### 1. 安装 Supabase CLI

参考官方文档安装并登录：

- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 2. 关联项目

在项目根目录执行：

```bash
supabase link --project-ref vdlqidhoprpuxznmapks
```

### 3. 设置管理员密码

执行：

```bash
supabase secrets set ADMIN_RESET_PASSWORD=你自己设置的密码
```

这个密码不会出现在前端代码里，只保存在 Supabase Function 的服务端环境变量中。

### 4. 部署函数

执行：

```bash
supabase functions deploy reset-boxes
```

部署完成后，前端会通过下面的地址调用它：

```text
https://vdlqidhoprpuxznmapks.supabase.co/functions/v1/reset-boxes
```

### 5. 使用方式

网页右上角点击“管理员重置”，输入你设置的密码后即可把所有盒子恢复为未开启状态。
