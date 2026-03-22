# 06. 貢献・共有方法

この拡張機能はオープンソースで公開されており、ユーザー同士で改善を共有できる仕組みを持っています。ここでは、GitHubを使った貢献・カスタマイズの方法を説明します。

---

## リポジトリの構造

```
justin-hieher/hightouch-ja（メインリポジトリ）
    ↓ クライアントがフォーク
ClientA/hightouch-ja（A社カスタム版）
ClientB/hightouch-ja（B社カスタム版）
    ↓ 良い改善は Pull Request でメインへ還元
justin-hieher/hightouch-ja（改善が反映）
```

- **メインリポジトリ**: DearOneが管理する公式版
- **フォーク**: 各クライアントが自社用にカスタマイズした独自版
- **Pull Request**: 良い翻訳をメインリポジトリに提案・共有する手段

---

## 貢献方法 A: Issue で提案（GitHubアカウントのみ必要）

翻訳の改善案や不具合報告はIssueで受け付けています。コードを触らなくてもOKです。

1. [GitHub Issues](https://github.com/justin-hieher/hightouch-ja/issues) を開く
2. 「New Issue」をクリック
3. 以下のテンプレートで記載して送信

```
## 提案内容
- 英語: Failed
- 現在の翻訳: 失敗
- 提案する翻訳: エラー
- 理由: ユーザーに「失敗した」という印象を与えるより「エラー発生」の方が中立的なため
```

---

## 貢献方法 B: Pull Request で直接改善（推奨）

実際にファイルを編集してメインリポジトリに貢献する方法です。

### Step 1: リポジトリをフォークする

1. [justin-hieher/hightouch-ja](https://github.com/justin-hieher/hightouch-ja) を開く
2. 右上の「**Fork**」ボタンをクリック
3. 自分のGitHubアカウントにフォーク（コピー）が作成される

### Step 2: ファイルを編集する

フォーク先のリポジトリで `translations/ja.json` または `translations/glossary.md` を直接編集します（GitHub上で編集ボタンをクリックするだけで可能です）。

### Step 3: Pull Request を作成する

1. 編集後、「**Commit changes**」でコミット
2. フォーク先のリポジトリトップに戻る
3. 「**Contribute**」→「**Open pull request**」をクリック
4. 変更内容と理由を記載して送信

DearOneチームがレビューし、問題なければメインリポジトリに取り込まれます。取り込まれた翻訳は次のリリース時に全ユーザーへ配布されます。

---

## 自社専用バージョンを管理する（フォーク活用）

業界固有の用語や社内ルールに合わせた独自の翻訳版を管理したい場合は、フォークを活用してください。

### フォーク後の管理方法

```bash
# フォークしたリポジトリをローカルにクローン
git clone https://github.com/YourOrg/hightouch-ja.git
cd hightouch-ja

# 自社用の翻訳を追加・編集
vim translations/ja.json

# コミット＆プッシュ
git add translations/ja.json
git commit -m "add: 自社固有用語を追加"
git push origin main
```

### メインリポジトリの更新を取り込む（upstream sync）

DearOneがメインリポジトリを更新した場合、その変更をフォーク版に取り込めます：

1. GitHub のフォーク先リポジトリを開く
2. 「**Sync fork**」ボタンをクリック → 「**Update branch**」を選択

---

## バージョンのリリース方法（フォーク版の配布）

自社クライアントに配布する場合は、GitHub Releases を使うと管理しやすくなります。

1. フォーク先リポジトリの「**Releases**」→「**Draft a new release**」
2. バージョンタグ（例: `v1.0.0-companyA`）を設定
3. 拡張機能フォルダを zip 圧縮して添付

```bash
# zip パッケージの作成（iconsフォルダ等を含む）
zip -r hightouch-ja-v1.0.0.zip . \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude "docs/*" \
  --exclude "*.md" \
  --exclude ".DS_Store"
```

---

## 行動規範

- 翻訳の変更は必ず `glossary.md` の定義に沿う
- 固有名詞（製品名）は翻訳しない
- 改善提案には変更理由を記載する
- 他のコントリビューターを尊重する
