# Hightouch 日本語化 — Chrome / Edge 拡張機能

Hightouch のUIを日本語に翻訳するブラウザ拡張機能です。Chrome と Microsoft Edge に対応しています。

DearOne（Hightouch 日本国内独占販売代理店）が提供・管理しています。

---

## インストール

1. [Releases](../../releases) から最新版の `hightouch-ja-vX.X.X.zip` をダウンロード
2. zip を展開する
3. `chrome://extensions`（Edge は `edge://extensions`）を開く
4. **デベロッパーモード**（Edge は「開発者モード」）を ON にする
5. **「パッケージ化されていない拡張機能を読み込む」**（Edge は「展開して読み込む」）をクリック
6. 展開した `hightouch-ja/` フォルダを選択

詳細は [docs/02_installation.md](docs/02_installation.md) を参照してください。

---

## 使い方

インストール後、`https://app.hightouch.com` を開くと自動的に日本語UIで表示されます。

- ブラウザ右上の拡張機能アイコンをクリックするとON/OFFを切り替えられます
- ON の状態がデフォルトです（インストール後は何もしなくて OK）

---

## ファイル構成

```
hightouch-ja/
├── manifest.json              # 拡張機能の設定（Manifest V3）
├── content.js                 # 翻訳エンジン
├── translations/
│   ├── ja.json                # 英語→日本語 対訳辞書
│   └── glossary.md            # 用語カタログ（翻訳の定義・根拠）
├── popup/
│   ├── popup.html             # ON/OFFトグルUI
│   └── popup.js
├── .github/
│   └── workflows/
│       └── check-translations.yml  # 翻訳カバレッジ週次チェック
├── docs/
│   ├── 01_overview.md
│   ├── 02_installation.md
│   ├── 03_how-it-works.md
│   ├── 04_customization.md
│   ├── 05_glossary-guide.md
│   ├── 06_contributing.md
│   ├── 07_troubleshooting.md
│   └── 08_upgrade.md
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## ドキュメント

| ドキュメント | 対象 |
|------------|------|
| [01. 概要](docs/01_overview.md) | 全員 |
| [02. インストール手順](docs/02_installation.md) | エンドユーザー・IT担当者 |
| [03. 仕組みの説明](docs/03_how-it-works.md) | IT担当者 |
| [04. カスタマイズ方法](docs/04_customization.md) | 翻訳を追加・変更したい方 |
| [05. 用語カタログの使い方](docs/05_glossary-guide.md) | 翻訳の一貫性を管理したい方 |
| [06. 貢献・共有方法](docs/06_contributing.md) | GitHubで改善に参加したい方 |
| [07. トラブルシューティング](docs/07_troubleshooting.md) | 問題が発生した場合 |
| [08. バージョンアップ手順](docs/08_upgrade.md) | 最新版に更新したい方 |
| [09. セキュリティ仕様書](docs/09_security.md) | IT担当者・情報セキュリティ部門 |

---

## 翻訳のカスタマイズ

`translations/ja.json` を編集するだけで翻訳を追加・変更できます：

```json
{
  "Syncs": "同期",
  "Models": "モデル",
  "Overview": "概要"    ← 追加例
}
```

詳細は [docs/04_customization.md](docs/04_customization.md) を参照してください。

---

## 貢献・フォーク

このリポジトリは OSS として公開しています：

- **Issue**: 翻訳の改善案・不具合報告
- **Pull Request**: 翻訳の追加・修正
- **Fork**: 自社専用バージョンの管理

フォークして自社カスタマイズを行い、良い翻訳は Pull Request でメインリポジトリに還元してください。
詳細は [docs/06_contributing.md](docs/06_contributing.md) を参照してください。

---

## 将来オプション

初期はゼロコストで運用できますが、以下を追加することでより高品質になります：

| 課題 | 有料オプション |
|------|--------------|
| 翻訳漏れの自動検出精度向上 | BrowserStack 等で本格的な E2E テスト（~$30/月） |
| 未翻訳文字列の自動補完 | Claude API 連携（従量課金） |
| 自動更新の仕組み | Chrome Web Store への公開（$5 一回のみ） |
| 翻訳品質の向上 | 専門翻訳者による用語カタログレビュー |

---

## ライセンス

MIT License — 自由に利用・改変・再配布できます。

---

*開発: Yuki Kobayashi | yukigobell@gmail.com*
