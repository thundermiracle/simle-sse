# Simple SSE - リアルタイム株価モニタープロジェクト

TurborepoベースのSSEリアルタイム株価モニタリングシステムです。

## プロジェクト構造

```
simple-sse/
├── apps/
│   ├── frontend/          # Vite + React + TypeScript + Tailwind CSS + shadcn-ui
│   └── backend-hono/      # Hono API サーバー
├── packages/
│   ├── ui/               # 共有UIコンポーネント (shadcn-ui)
│   ├── eslint-config/    # 共有ESLint設定
│   └── typescript-config/ # 共有TypeScript設定
├── package.json          # ルートpackage.json
├── turbo.json           # Turborepo設定
└── pnpm-workspace.yaml  # pnpmワークスペース設定
```

## 開発環境セットアップ

### 必要な環境
- Node.js 18+
- pnpm

### インストール
```bash
pnpm install
```

### 開発サーバー起動

#### 全アプリケーションを同時に起動
```bash
pnpm dev
```

#### 個別に起動
```bash
# フロントエンド (http://localhost:3000)
pnpm dev --filter frontend

# バックエンド (http://localhost:3001)
pnpm dev --filter backend-hono
```

### ビルド
```bash
pnpm build
```

### 型チェック
```bash
pnpm type-check
```

### リント
```bash
pnpm lint
```

## エンドポイント

### バックエンド API (http://localhost:3001)
- `GET /` - ヘルスチェック
- `GET /api` - API情報
- `GET /api/stocks` - 株価データ (将来SSE実装予定)

### フロントエンド (http://localhost:3000)
- React + TypeScript
- Tailwind CSS + shadcn-ui
- Vite開発サーバー

## 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Tailwind CSS v4** - ユーティリティファーストCSS (設定ファイル不要)
- **@tailwindcss/vite** - Tailwind v4 Viteプラグイン
- **shadcn-ui** - 美しいUIコンポーネント
- **Lucide React** - アイコンライブラリ

### バックエンド
- **Hono** - 高速軽量Webフレームワーク
- **@hono/node-server** - Node.js統合
- **TypeScript** - 型安全性
- **tsx** - TypeScript実行環境

### 開発ツール
- **Turborepo** - モノレポビルドシステム
- **pnpm** - 高速パッケージマネージャー
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマット

## Tailwind CSS v4 の変更点

- ✅ **設定ファイル不要**: `tailwind.config.js`と`postcss.config.js`を削除
- ✅ **@tailwindcss/viteプラグイン**: Vite設定でTailwind v4を統合
- ✅ **シンプルなCSS**: `@import "tailwindcss"`のみでOK
- ✅ **自動コンテンツ検出**: 全テンプレートファイルを自動発見
- ✅ **高速ビルド**: v3比較で最大5倍高速、インクリメンタルビルドは100倍以上高速

## 次のステップ

このボイラープレートはSSE (Server-Sent Events) の実装準備が整っています：

1. **バックエンド**: `/api/stocks` エンドポイントでSSEストリーミングを実装
2. **フロントエンド**: EventSource APIを使用してリアルタイムデータを受信
3. **UI**: 株価データの表示とリアルタイム更新機能を追加

## 開発状況

✅ Turborepoプロジェクト構造
✅ フロントエンド (Vite + React + TS)
✅ Tailwind CSS v4 + shadcn-ui設定 (設定ファイル不要)
✅ バックエンド (Hono)
✅ 共有パッケージ (ui, eslint-config, typescript-config)
✅ 基本動作確認

🟡 SSE実装 (今後の課題)
🟡 株価データモック
🟡 リアルタイムUI更新