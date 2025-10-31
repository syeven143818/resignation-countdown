// api/notify.js - Line Messaging API 版本

export default async function handler(request, response) {
    // 1. 只接受 POST 請求
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Method Not Allowed' });
    }
  
    // 2. 從 Vercel 環境變數讀取 "金鑰" 和 "您的 User ID"
    const token = process.env.LINE_CHANNEL_TOKEN;
    const adminUserId = process.env.LINE_ADMIN_USER_ID;
  
    if (!token || !adminUserId) {
      return response.status(500).json({ error: 'Line Messaging API is not configured.' });
    }
  
    try {
      // 3. 從前端請求的 body 中讀取 "message"
      const { message } = request.body;
  
      if (!message) {
        return response.status(400).json({ error: 'Message is required.' });
      }
  
      // 4. 準備要發送給 Line Messaging API 的資料 (JSON 格式)
      const lineBody = {
        to: adminUserId, // 指定要發送給誰 (您自己)
        messages: [
          {
            type: 'text',
            text: message, // "text" 是 Line 接收訊息的關鍵字
          },
        ],
      };
  
      // 5. 向 Line Messaging API (Push Endpoint) 發送請求
      const lineResponse = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 使用 Bearer 權杖
        },
        body: JSON.stringify(lineBody), // 必須將 body 轉為 JSON 字串
      });
  
      const lineData = await lineResponse.json();
  
      if (!lineResponse.ok) {
        // 如果 Line 回報錯誤
        console.error('Line API Error:', lineData); // 印出詳細錯誤
        throw new Error(`Line Messaging API error: ${lineData.message}`);
      }
  
      // 6. 向前端回報成功
      response.status(200).json({ success: true, lineResponse: lineData });
  
    } catch (error) {
      console.error('Handler Error:', error);
      response.status(500).json({ error: 'Failed to send notification.' });
    }
  }