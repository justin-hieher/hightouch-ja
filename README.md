# Hightouch 日本語化 — Chrome / Edge 拡張機能

Hightouch のUIを日本語に翻訳するブラウザ拡張機能です。Chrome と Microsoft Edge に対応しています。

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

## 自由に使ってください

MIT ライセンスで公開しているため、フォーク・改変・再配布は自由です。

- 自社の用語に合わせてカスタマイズして使う
- カスタマイズした版を社内や社外に公開・共有する
- 改善した内容を Pull Request で共有してくれると助かります（任意）

詳細は [docs/06_contributing.md](docs/06_contributing.md) を参照してください。

---

## ライセンス

MIT License — 自由に利用・改変・再配布できます。

---

*開発: Yuki Kobayashi | yukigobell@gmail.com*
