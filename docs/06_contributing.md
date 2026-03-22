# 06. 貢献・共有方法

この拡張機能はオープンソースで公開しています。定常的な運用・保守を行っているプロジェクトではありませんが、翻訳の改善案や不具合の共有は歓迎します。いただいたフィードバックは今後の改善の参考にします（個別の対応を保証するものではありません）。

---

## リポジトリの構造

```
justin-hieher/hightouch-ja（オリジナル版）
    ↓ フォーク
YourOrg/hightouch-ja（独自カスタム版）
    ↓ 良い改善は Pull Request でオリジナルへ還元（任意）
justin-hieher/hightouch-ja（改善が反映）
```

- **オリジナル版**: Yuki Kobayashi が個人で管理している原版
- **フォーク**: 各組織が自社用にカスタマイズした独自版
- **Pull Request**: 良い翻訳をオリジナルに提案・共有する手段（任意）

---

## 貢献方法 A: Issue で提案・報告（GitHubアカウントのみ必要）

翻訳の改善案や不具合は [GitHub Issues](https://github.com/justin-hieher/hightouch-ja/issues) から共有できます。コードを触らなくてもOKです。

> **注意**: 定常的な運用は行っていないため、すべての Issue への対応を保証するものではありません。共有いただいた内容は今後の改善の参考にします。

記載例：

```
## 提案内容
- 英語: Failed
- 現在の翻訳: 失敗
- 提案する翻訳: エラー
- 理由: ユーザーに「失敗した」という印象を与えるより「エラー発生」の方が中立的なため
```

---

## 貢献方法 B: Pull Request で直接改善

実際にファイルを編集してオリジナルリポジトリに貢献する方法です。翻訳を直接修正・追加したい場合はこちらをご利用ください。

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

> Pull Request はありがたく確認しますが、マージ・対応の時期・可否は保証できません。良い改善は積極的に取り込む予定です。

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

### オリジナルの更新を取り込む（upstream sync）

オリジナルリポジトリが更新された場合、その変更をフォーク版に取り込めます：

1. GitHub のフォーク先リポジトリを開く
2. 「**Sync fork**」ボタンをクリック → 「**Update branch**」を選択

---

## バージョンのリリース方法（フォーク版の配布）

自社内に配布する場合は、GitHub Releases を使うと管理しやすくなります。

1. フォーク先リポジトリの「**Releases**」→「**Draft a new release**」
2. バージョンタグ（例: `v1.0.0-companyA`）を設定
3. 拡張機能フォルダを zip 圧縮して添付

```bash
zip -r hightouch-ja-v1.0.0.zip . \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude "docs/*" \
  --exclude "*.md" \
  --exclude ".DS_Store"
```

---

## 翻訳を追加・変更する際のお願い

- 翻訳の変更は `glossary.md` の定義に沿う
- 固有名詞（製品名）は翻訳しない
- 改善提案には変更理由を記載する
