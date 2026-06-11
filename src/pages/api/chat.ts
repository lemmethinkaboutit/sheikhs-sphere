export const prerender = false;
import type { APIRoute } from 'astro';

// Hardcoded Llama model variable to avoid missing reference breaks
const MODEL = "@cf/meta/llama-3.1-8b-instruct"; 

export const POST: APIRoute = async ({ request }) => {
  try {
    const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
    const CF_API_TOKEN = process.env.CF_API_TOKEN;

    // Direct Google Webhook Link
  const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby7jiSZPZKOksG1iMy102-H8evKkwpvezMdFwSi_5u1MWBord3PaffWh4ljmSnLqE1SJw/exec";
    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return new Response(JSON.stringify({
        error: 'Missing credentials',
        hasAccountId: !!CF_ACCOUNT_ID,
        hasToken: !!CF_API_TOKEN
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { messages } = body;
    const userMessage = messages?.[messages.length - 1]?.content || '';
    const startTime = Date.now();

    // 1. Send the data payload directly to Cloudflare AI
    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CF_API_TOKEN}`
        },
        body: JSON.stringify({
          messages,
          max_tokens: 500
        })
      }
    );

    const data = await cfResponse.json();
    const responseTime = Date.now() - startTime;

    if (!cfResponse.ok || !data.result?.response) {
      return new Response(JSON.stringify({
        error: 'Cloudflare error',
        status: cfResponse.status,
        data
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const aiResponse = data.result.response;

    // 2. Safely log everything onto your Google sheet from the server side
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userMessage,
          aiResponse,
          messageLength: userMessage.length,
          responseTime
        })
      });
    } catch (err) {
      console.error("Google Sheets Logging Webhook error:", err);
    }

    // 3. Return response payload smoothly back to front-end UI
    return new Response(JSON.stringify({ reply: aiResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
