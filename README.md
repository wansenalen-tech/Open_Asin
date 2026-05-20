# 打开Asin

这是一个 uTools 插件项目，用于识别 Amazon ASIN 或 Amazon 商品链接，并使用指定浏览器打开对应商品页面。

## 目录结构

```text
.
├── v1.0
│   ├── plugin.json
│   ├── preload.js
│   └── logo.png
├── v1.1
│   ├── plugin.json
│   ├── preload.js
│   └── logo.png
├── v2.0
│   ├── plugin.json
│   ├── preload.js
│   ├── index.html
│   └── logo.png
├── logo.afdesign
├── overview.html
└── overview.png
```

## 版本说明

### v1.0

- 固定通过 Chrome 打开 Amazon 商品页。
- 支持 `amazon.com` 链接和特定 ASIN 文本触发。
- 无设置界面，触发后直接执行。

### v1.1

- 默认改为通过 Microsoft Edge 打开。
- 支持完整 Amazon 链接。
- ASIN 匹配规则相较 v1.0 更宽。

### v2.0

- 新增设置界面 `index.html`。
- 支持选择 Chrome、Edge、Firefox、Safari 或系统默认浏览器。
- 支持自动检测已安装浏览器。
- 支持将误输入的 `BO` 前缀修正为 `B0`。
- 打开失败时回退到系统默认浏览器。

## 使用方式

在 uTools 开发者工具中选择对应版本目录，例如 `v2.0`，作为插件目录加载即可。

## 概览图

![打开Asin 插件结构概览](overview.png)
