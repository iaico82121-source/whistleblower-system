/**
 * Google Apps Script プロキシAPI
 * 
 * このスクリプトは、Gemini APIキーをサーバー側で保持し、
 * フロントエンドからのリクエストをプロキシします。
 * 
 * セットアップ手順:
 * 1. Google Apps Script (https://script.google.com/) にアクセス
 * 2. 新しいプロジェクトを作成
 * 3. このコードをコピー＆ペースト
 * 4. GEMINI_API_KEY に実際のAPIキーを設定
 * 5. 「デプロイ」→「新しいデプロイ」→「種類を選択」→「ウェブアプリ」
 * 6. 「次のユーザーとして実行」を「自分」に設定
 * 7. 「アクセスできるユーザー」を「全員」に設定
 * 8. 「デプロイ」をクリック
 * 9. 表示されたウェブアプリのURLをコピーして、index.htmlのGAS_API_URLに設定
 */

// ============================================
// 🔐 重要: ここにGemini APIキーを設定してください
// ============================================
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // ここに実際のAPIキーを設定

/**
 * doPost: POSTリクエストを処理
 * フロントエンドからのチャットリクエストを受け取り、Gemini APIを呼び出します
 */
function doPost(e) {
  try {
    // リクエストボディをパース
    const requestData = JSON.parse(e.postData.contents);
    
    // リクエストタイプに応じて処理を分岐
    if (requestData.action === 'chat') {
      return handleChatRequest(requestData);
    } else if (requestData.action === 'newReport') {
      return handleReportSubmission(requestData);
    } else {
      return createErrorResponse('無効なアクションです', 400);
    }
  } catch (error) {
    Logger.log('エラー: ' + error.toString());
    return createErrorResponse('リクエストの処理中にエラーが発生しました: ' + error.toString(), 500);
  }
}

/**
 * handleChatRequest: チャットリクエストを処理
 */
function handleChatRequest(requestData) {
  try {
    // Gemini APIを呼び出し
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=' + GEMINI_API_KEY;
    
    const payload = {
      contents: requestData.contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200) {
      return ContentService
        .createTextOutput(responseText)
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      Logger.log('Gemini API エラー: ' + responseCode + ' - ' + responseText);
      return createErrorResponse('AI APIの呼び出しに失敗しました: ' + responseText, responseCode);
    }
  } catch (error) {
    Logger.log('チャット処理エラー: ' + error.toString());
    return createErrorResponse('チャット処理中にエラーが発生しました: ' + error.toString(), 500);
  }
}

/**
 * handleReportSubmission: 通報内容の送信を処理
 * （既存のGAS機能と統合する場合は、ここに既存のコードを統合してください）
 */
function handleReportSubmission(requestData) {
  try {
    // ここに既存のGoogle Sheetsへの書き込み処理を統合してください
    // 例: SpreadsheetApp.openById('SPREADSHEET_ID').getActiveSheet().appendRow([...]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '通報を受け付けました',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('通報送信エラー: ' + error.toString());
    return createErrorResponse('通報の送信中にエラーが発生しました: ' + error.toString(), 500);
  }
}

/**
 * createErrorResponse: エラーレスポンスを作成
 */
function createErrorResponse(message, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify({
      error: true,
      message: message,
      statusCode: statusCode
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * doGet: GETリクエストを処理（ヘルスチェック用）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
