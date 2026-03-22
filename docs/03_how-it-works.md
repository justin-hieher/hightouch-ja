# 03. 仕組みの説明

IT担当者や技術的な詳細を知りたい方向けに、この拡張機能の動作原理を説明します。

---

## 全体アーキテクチャ

```
ブラウザ
└── app.hightouch.com を開く
      │
      ▼
manifest.json が content.js を自動注入
      │
      ▼
content.js が起動
  ├── chrome.storage から ON/OFF 状態を読み込む
  ├── ja.json（翻訳辞書）を読み込む
  ├── ページ全体のテキストを翻訳
  └── MutationObserver でDOM変更を監視・継続翻訳
```

---

## 主要コンポーネント

### manifest.json — 拡張機能の設定ファイル

Chrome/Edge 拡張機能の設定を記述するファイルです。

```json
{
  "manifest_version": 3,
  "host_permissions": ["https://app.hightouch.com/*"],
  "content_scripts": [{
    "matches": ["https://app.hightouch.com/*"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }]
}
```

- `host_permissions`: この拡張機能が動作するURLを限定します（Hightouch以外のサイトには影響しません）
- `content_scripts`: `app.hightouch.com` を開いたときに自動的に `content.js` を実行します
- `run_at: document_idle`: ページの基本的な読み込みが完了してから実行します

### content.js — 翻訳エンジン

ページに注入されるメインスクリプトです。以下の処理を行います。

#### 1. 翻訳辞書の読み込み

```javascript
const url = chrome.runtime.getURL("translations/ja.json");
const response = await fetch(url);
const data = await response.json();
```

拡張機能フォルダ内の `translations/ja.json` を読み込みます。

#### 2. 翻訳の適用（テキストノード走査）

HTMLの構造上、ページのテキストは「テキストノード」という単位で管理されています。このスクリプトはページ全体のテキストノードを探索し、辞書に一致する文字列を日本語に置換します。

**誤置換を防ぐ工夫**: 辞書のキーは長い文字列から順に適用されます。例えば `"Create new sync"` が `"Create"` より先に処理されることで、文の一部だけが誤って置換されることを防ぎます。

#### 3. 元テキストの保存

```html
<!-- 翻訳前 -->
<span>Syncs</span>

<!-- 翻訳後（元テキストを属性に保存） -->
<span data-ht-original="Syncs">同期</span>
```

`data-ht-original` 属性に元の英語テキストを保存します。ON/OFFのトグル時に英語UIへ完全に戻すために使用します。

#### 4. MutationObserver — 動的変更への対応

Hightouch は React で構築された SPA（シングルページアプリケーション）です。ページ遷移時にURLは変わりますが、実際にはHTMLの一部だけが動的に書き換わります。

```javascript
const observer = new MutationObserver(debounce((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => translateNode(node));
  });
}, 150));

observer.observe(document.body, { childList: true, subtree: true });
```

`MutationObserver` はDOM（ページの構造）の変更を監視し、新しい要素が追加されるたびに自動的に翻訳を適用します。debounce（150ms）により、短時間に大量の変更が発生しても処理が重くなることを防いでいます。

### translations/ja.json — 翻訳辞書

英語→日本語の対訳を管理するJSONファイルです。

```json
{
  "Syncs": "同期",
  "Models": "モデル",
  "Running": "実行中",
  "Create sync": "同期を作成"
}
```

このファイルを編集するだけで翻訳を追加・変更できます（詳細は [04. カスタマイズ](./04_customization.md) を参照）。

### popup/ — ON/OFFポップアップ

拡張機能アイコンをクリックすると表示されるUIです。

- `popup.html`: トグルスイッチのUI
- `popup.js`: ON/OFF状態を `chrome.storage.sync` に保存し、`content.js` へメッセージを送信して動作を切り替えます

---

## ユーザーデータを翻訳しない仕組み

カラム名・セル値・SQLコードなどのユーザーデータが誤って翻訳されないよう、以下の2つの仕組みで保護しています。

**① 除外セレクタ**: 特定のHTML要素を翻訳対象から除外

```javascript
const EXCLUDE_SELECTORS = [
  "input", "textarea",            // 入力欄
  "code", "pre", ".cm-content",  // SQLエディタ・コード
  "table td", "table th",         // データテーブルのセル・カラム名
  "[role='gridcell']",            // グリッドセル
  // ...
];
```

**② 文字数上限**: 500文字を超えるテキストは翻訳しない

```javascript
const MAX_TRANSLATE_LENGTH = 500;
```

UIのラベルやボタンは通常500文字未満です。それを超える長いテキストはユーザーが入力・作成したデータである可能性が高いため、除外セレクタをすり抜けた場合でも翻訳・保存の対象にしません。

---

## セキュリティについて

- この拡張機能は `app.hightouch.com` のみで動作します（他のサイトには一切影響しません）
- 外部サーバーへのデータ送信は一切行いません（オフライン動作）
- APIキーや認証情報には触れません
- すべてのコードはGitHubで公開されており、誰でも確認できます
