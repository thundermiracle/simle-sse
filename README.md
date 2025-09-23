# Simple SSE - リアルタイム株価モニタープロジェクト

Turborepo をベースにした SSE (Server-Sent Events) による株価モニタリング用モノレポです。Vite + React のフロントエンドと Hono 製バックエンドが連携し、リアルタイムで価格を配信します。

## プロジェクト構造
```
simple-sse/
├── apps/
│   ├── frontend/       # Vite + React + TypeScript + Tailwind CSS UI
│   └── backend-hono/   # Hono + TypeScript の SSE API サーバー
├── package.json        # モノレポ共通スクリプト
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json          # Turborepo 設定
```

## セットアップ
1. Node.js 18+ と pnpm を用意します。
2. 依存関係をインストール:
   ```bash
   pnpm install
   ```

## 開発ワークフロー
- 全サービス同時起動:
  ```bash
  pnpm dev
  ```
- 個別起動:
  ```bash
  pnpm dev --filter frontend       # http://localhost:3000
  pnpm dev --filter backend-hono   # http://localhost:4000
  ```
- 型チェック / Lint / フォーマット:
  ```bash
  pnpm type-check
  pnpm lint
  pnpm format
  ```
- 本番ビルド & バックエンド実行:
  ```bash
  pnpm build
  pnpm --filter backend-hono run start
  ```

## アーキテクチャと SSE 更新フロー
- バックエンドはプロセス起動直後から 1〜3 秒間隔で価格を更新し、最新値をメモリに保持します。
- 更新のたびに `stock-update` イベントを購読中のクライアントへ push。接続直後にも最新スナップショットを送信します。
- フロントエンドは `EventSource("http://localhost:4000/api/stocks/stream")` でイベントを受信し、ダッシュボードを更新します。
- 接続を切断するとバックエンドは購読リストからクライアントを除外し、再接続時も最後に計算された価格がそのまま反映されます。

## API エンドポイント
- `GET /api/stocks` — 利用可能銘柄と最新価格スナップショットを返却。
- `GET /api/stocks/stream` — `stock-update` SSE ストリーム。payload は以下形式:
  ```json
  {
    "timestamp": "2024-05-01T12:00:00.000Z",
    "stocks": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "basePrice": 150,
        "currentPrice": 156.42,
        "changePercent": 4.28,
        "lastUpdate": "2024-05-01T11:59:59.500Z"
      }
    ]
  }
  ```

## テストと検証
- 自動テストは未整備のため、変更時は `pnpm dev` でフロントとバックエンドを立ち上げ、SSE の継続配信とエラーログの有無を目視確認してください。
- 将来的に Vitest や API 用スクリプトを導入する際は実行コマンドを `README` に追記してください。

## 今後のアイデア
- SSE ストリームの認証/レート制限対応
- 本物のマーケットデータフェッチャーの接続
- UI テストやバックエンド用統合テストの追加
- Docker 化や CI/CD パイプライン整備
