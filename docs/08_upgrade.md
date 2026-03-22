# 08. バージョンアップ手順

新しいバージョンがリリースされた際の更新手順を説明します。

---

## 新バージョンの確認方法

以下のいずれかで新バージョンを確認できます：

1. **GitHub リリースページ**: [justin-hieher/hightouch-ja/releases](https://github.com/justin-hieher/hightouch-ja/releases) をブックマークして定期的に確認
2. **GitHub の Watch 機能**: リポジトリの「Watch」→「Releases only」を設定するとメールで通知される
3. **GitHub Actions アラート**: 翻訳カバレッジが低下した際に自動でIssueが作成される（管理者向け）

---

## バージョンアップ手順

### Step 1: 新バージョンをダウンロードする

1. [リリースページ](https://github.com/justin-hieher/hightouch-ja/releases) を開く
2. 最新バージョンの `hightouch-ja-vX.X.X.zip` をダウンロード
3. 展開（解凍）して新しい `hightouch-ja/` フォルダを取得

### Step 2: 古いフォルダを置き換える

現在インストールされている `hightouch-ja/` フォルダを新しいものに置き換えます。

> ⚠️ **カスタマイズしている場合の注意**
> `translations/ja.json` を独自に編集している場合は、新バージョンのファイルで上書きすると変更が失われます。事前にカスタマイズ内容をメモ・バックアップしてください。

**カスタマイズ内容を新バージョンに引き継ぐ方法：**

1. 旧バージョンの `translations/ja.json` を開いてカスタム追加した行をコピー
2. 新バージョンの `translations/ja.json` を開いて同じ行を追加
3. ファイルを保存

### Step 3: 拡張機能をリロードする

1. `chrome://extensions`（または `edge://extensions`）を開く
2. 「Hightouch 日本語化」の更新アイコン（🔄）をクリック
3. Hightouch のタブをリロード（`Ctrl+R` または `⌘+R`）

### Step 4: 動作確認

`app.hightouch.com` を開き、UIが正しく日本語化されていることを確認します。

---

## バージョン履歴の確認

各バージョンの変更内容は [リリースノート](https://github.com/justin-hieher/hightouch-ja/releases) で確認できます。

---

## フォーク版を使っている場合

自社フォーク版を使っている場合は、メインリポジトリの更新を取り込んでから自社配布ファイルを更新します。

1. GitHubのフォーク先リポジトリを開く
2. 「**Sync fork**」→「**Update branch**」をクリック（メインリポジトリの変更を取り込む）
3. 自社のカスタマイズ（`ja.json` の追記など）が上書きされていないか確認
4. 新しいzipファイルを作成してクライアントへ配布

---

## 自動更新について

現在のバージョン（v1.0.0）は手動更新が必要です。Chrome Web Store に公開した場合は自動更新が利用できます（[課金・将来オプション](../README.md#将来オプション) 参照）。
