// api/notify.js - Line Messaging API 版本 (升級版：包含 Email)

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
    // 3. 【已修改】從 body 中同時讀取 "message" 和 "email"
    const { message, email } = request.body;

    if (!message) {
      return response.status(400).json({ error: 'Message is required.' });
    }

    // 4. 【已修改】組合出包含 Email 的最終訊息
    const finalMessage = `
[離職倒數器通知]
👤 使用者: ${email || 'N/A'}
\n
${message}
    `;

    // 5. 準備要發送給 Line Messaging API 的資料
    const lineBody = {
      to: adminUserId, 
      messages: [
        {
          type: 'text',
          text: finalMessage, // 使用我們剛組合好的 finalMessage
        },
      ],
    };

    // 6. 向 Line Messaging API (Push Endpoint) 發送請求
    const lineResponse = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(lineBody),
    });

    const lineData = await lineResponse.json();

    if (!lineResponse.ok) {
      console.error('Line API Error:', lineData);
      throw new Error(`Line Messaging API error: ${lineData.message}`);
    }

    // 7. 向前端回報成功
    response.status(200).json({ success: true, lineResponse: lineData });

  } catch (error) {
    console.error('Handler Error:', error);
    response.status(500).json({ error: 'Failed to send notification.' });
  }
}