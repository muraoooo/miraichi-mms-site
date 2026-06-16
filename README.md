# MIRAICHI・MMS website

MIRAICHI・MMSの静的トップページです。生成AIを学び、試し、作り、発信し、仕事に変えるAI実践コミュニティ/法人向けAI導入支援サイトとして作成しています。

## Local preview

```sh
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

## Cloudflare Pages

### Option 1: GitHub integration

1. このフォルダをGitHubリポジトリにpushします。
2. Cloudflare Dashboardで `Workers & Pages` を開きます。
3. `Create application` → `Pages` → `Import an existing Git repository` を選びます。
4. 設定は以下でOKです。

```text
Production branch: main
Build command: exit 0
Build output directory: /
```

### Option 2: Direct Upload

Cloudflare PagesのDirect Uploadで、このフォルダ、またはzipファイルをアップロードします。
Wranglerを使う場合は以下です。

```sh
npx wrangler pages project create
npx wrangler pages deploy . --project-name miraichi-mms
```

## Replace before production

- `mailto:info@example.com` を本番のメールアドレスやフォームURLに変更する
- メンバーの声・成果物は実在の内容に差し替える
- 料金、参加条件、利用ツール環境が決まっていればFAQへ追加する
- 運営者紹介に顔写真や正式プロフィールを追加する
- `commercial-transactions.html` と `privacy.html` を正式な法務情報へ差し替える
- 公開ドメインが決まったら `og:image` を絶対URLへ変更する
- 見出しフォントはGoogle Fontsの `text=` でサブセット化しています。見出し文言を変えたら、未収録文字がフォールバック表示にならないようにフォントURLのサブセットを再生成してください。
