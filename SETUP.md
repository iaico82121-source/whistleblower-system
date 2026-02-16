# API KEY セキュリティ設定ガイド

このアプリケーションでは、API KEYをフロントエンドに公開せず、Google Apps Script (GAS) を使用してサーバー側で安全に保持します。

## セットアップ手順

### 1. Google Apps Script プロジェクトの作成

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を設定（例: "Whistleblower API Proxy"）

### 2. GASスクリプトの設定

1. `gas-proxy-api.gs` ファイルの内容をコピー
2. GASエディタにペースト
3. **重要**: `GEMINI_API_KEY` の値を実際のGemini APIキーに置き換え
   ```javascript
   const GEMINI_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

### 3. GAS Web App のデプロイ

1. GASエディタで「デプロイ」→「新しいデプロイ」をクリック
2. 「種類を選択」で「ウェブアプリ」を選択
3. 以下の設定を行います:
   - **説明**: 「API Proxy for Whistleblower System」（任意）
   - **次のユーザーとして実行**: 「自分」
   - **アクセスできるユーザー**: 「全員」（または「全員（匿名ユーザーを含む）」）
4. 「デプロイ」をクリック
5. **重要**: 表示された「ウェブアプリのURL」をコピーしてください

### 4. HTMLファイルの設定

1. `index.html` を開く
2. `GAS_API_URL` に、ステップ3でコピーしたURLを設定:
   ```javascript
   const GAS_API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```

### 5. 動作確認

1. `index.html` をブラウザで開く
2. チャット機能が正常に動作することを確認
3. ブラウザの開発者ツール（F12）でネットワークタブを確認し、APIキーが送信されていないことを確認

## セキュリティの確認

### ✅ 正しい実装の確認ポイント

- [ ] `index.html` にAPIキーが含まれていない
- [ ] フロントエンドからは `GAS_API_URL` のみを呼び出している
- [ ] GASスクリプトでAPIキーが正しく設定されている
- [ ] GAS Web Appのアクセス権限が適切に設定されている

### 🔍 確認方法

ブラウザの開発者ツール（F12）で以下を確認:

1. **ソースコード**: `index.html` のソースを表示し、APIキーが含まれていないことを確認
2. **ネットワークタブ**: 
   - リクエストが `GAS_API_URL` に送信されていることを確認
   - リクエストヘッダーやボディにAPIキーが含まれていないことを確認

## トラブルシューティング

### エラー: "API呼び出しエラー"

- GASスクリプトの `GEMINI_API_KEY` が正しく設定されているか確認
- GAS Web Appのアクセス権限が「全員」に設定されているか確認
- GASスクリプトのエラーログを確認（GASエディタの「実行」→「実行ログを表示」）

### エラー: "CORS エラー"

- GAS Web Appのアクセス権限を「全員（匿名ユーザーを含む）」に設定
- `doPost` 関数が正しく実装されているか確認

### エラー: "無効なアクションです"

- `index.html` のリクエストボディに `action: 'chat'` が含まれているか確認

## 既存のGAS Web Appとの統合

既に通報送信用のGAS Web Appがある場合:

1. `gas-proxy-api.gs` の `handleReportSubmission` 関数に既存のコードを統合
2. または、`GAS_WEB_APP_URL` を既存のURLのまま使用（通報送信のみ）

## 注意事項

- **APIキーは絶対にフロントエンドに含めないでください**
- GASスクリプトのURLは公開されますが、APIキー自体はサーバー側で保持されるため安全です
- 定期的にAPIキーの使用状況を確認し、不正使用がないか監視してください
