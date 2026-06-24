# 倒数日 · Countdown

> 一款日系风格的倒计时 / 正计时应用，用 Expo（React Native）构建。
>
> A Japanese-aesthetic countdown & count-up app built with Expo (React Native).

---

## 截图 · Screenshots

> *(Add screenshots here)*

---

## 功能特性 · Features

### 中文

- **倒数 / 正数双模式** — 既可以倒数到未来某天，也可以记录已过去多少天
- **简洁卡片视图** — 点击事件查看大字号天数卡片，一目了然
- **完整详情页** — 包含多单位换算（年/月/周/时/分/秒）、里程碑提示、备注
- **日系渐变背景** — 36 款精选日系风格渐变，分为桜・和色・四季・侘寂・幽玄・水墨六大系列
- **自定义图标** — 支持 Emoji、颜文字（顔文字）和像素风图标
- **自定义分类** — 创建带颜色的事件分类，方便归档
- **置顶 / 删除** — 长按或滑动操作，置顶事件优先展示
- **分享卡片** — 一键生成精美分享图，支持导出到相册或系统分享
- **重复事件** — 支持不重复 / 每周 / 每月 / 每年重复
- **农历支持** — 可标记农历日期
- **字体大小设置** — 小 / 中 / 大三档可选

### English

- **Countdown & Count-up** — Track days until a future event or days since a past one
- **Simple card view** — Tap any event to see a clean, large-number card
- **Full detail screen** — Multi-unit breakdown (years / months / weeks / hours / minutes / seconds), milestone alerts, and notes
- **Japanese gradient themes** — 36 curated gradients in 6 series: Sakura, Wa-iro, Shiki, Wabi, Yugen, Sumi
- **Custom icons** — Emoji, kaomoji (Japanese text faces), and pixel-art icons
- **Custom categories** — Color-coded categories for organizing events
- **Pin & delete** — Pin important events to the top; swipe or long-press to delete
- **Share card** — Export a beautiful shareable image to your photo album or via system share
- **Repeating events** — None / weekly / monthly / yearly recurrence
- **Lunar calendar** — Mark events with the Chinese lunar calendar
- **Font size settings** — Small / medium / large

---

## 技术栈 · Tech Stack

| 层 Layer | 技术 Technology |
|---|---|
| 框架 Framework | [Expo](https://expo.dev) SDK 56 + React Native |
| 路由 Routing | [expo-router](https://expo.github.io/router) v4 (file-based) |
| 状态管理 State | [Zustand](https://zustand-demo.pmnd.rs) |
| 渐变 Gradients | [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) |
| 截图 Screenshot | [react-native-view-shot](https://github.com/gre/react-native-view-shot) |
| 相册 Media Library | [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/) |
| 分享 Sharing | [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) |
| 图标 Icons | [@expo/vector-icons](https://icons.expo.fyi) (Ionicons) |
| 语言 Language | TypeScript |

---

## 项目结构 · Project Structure

```
countdown/
├── app/                        # expo-router 页面
│   ├── index.tsx               # 首页（事件列表）Home screen
│   ├── settings.tsx            # 设置页 Settings
│   └── event/
│       ├── new.tsx             # 新建事件 Create event
│       └── [id]/
│           ├── index.tsx       # 简洁卡片视图 Simple card view
│           ├── detail.tsx      # 完整详情页 Full detail screen
│           └── edit.tsx        # 编辑事件 Edit event
├── src/
│   ├── components/             # 复用组件 Reusable components
│   │   ├── EventCard.tsx       # 首页列表行 Home list row
│   │   ├── EventForm.tsx       # 创建/编辑表单 Create/edit form
│   │   ├── ShareCard.tsx       # 分享卡片 Share card
│   │   ├── BackgroundPicker.tsx# 背景选择器 Background picker
│   │   ├── IconPicker.tsx      # 图标选择器 Icon picker
│   │   ├── ColorPicker.tsx     # 颜色选择器 Color picker
│   │   └── EmptyState.tsx      # 空状态 Empty state
│   ├── store/                  # Zustand 状态管理
│   │   ├── eventStore.ts       # 事件数据 Event data
│   │   ├── categoryStore.ts    # 分类数据 Category data
│   │   └── settingsStore.ts    # 应用设置 App settings
│   ├── utils/
│   │   ├── dateUtils.ts        # 日期计算 Date calculations
│   │   ├── milestoneUtils.ts   # 里程碑 Milestones
│   │   └── backgroundUtils.ts  # 背景解析 Background parsing
│   └── types/
│       └── index.ts            # 类型定义 + 渐变预设
└── assets/                     # 图标 / 启动图 Icons & splash
```

---

## 快速开始 · Getting Started

### 前置条件 Prerequisites

- Node.js ≥ 18
- [Expo Go](https://expo.dev/go) app on your phone, or an Android/iOS simulator

### 安装 Install

```bash
git clone https://github.com/YOUR_USERNAME/countdown.git
cd countdown
npm install
```

### 启动 Start

```bash
npx expo start
```

扫描二维码用 Expo Go 打开，或按 `a` 启动 Android 模拟器，`i` 启动 iOS 模拟器。

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

---

## 日系渐变系列 · Japanese Gradient Series

| 系列 Series | 风格 Style | 代表色 Colors |
|---|---|---|
| 桜 Sakura | 花系粉嫩 Blossom pinks | 染井吉野・乙女・花吹雪 |
| 和 Wa-iro | 传统和色 Traditional Japanese | 瑠璃・藤色・浅葱 |
| 四季 Shiki | 自然四季 Four seasons | 芽吹き・紅葉・夜桜 |
| 侘寂 Wabi | 侘寂大地 Earth tones | 枯れ野・苔・錆 |
| 幽玄 Yugen | 幽深暗夜 Dark & mysterious | 夜の帳・宵闇・深山 |
| 水墨 Sumi | 水墨丹青 Ink wash | 薄墨・墨汁・銀霧 |

---

## License

MIT © 2025
