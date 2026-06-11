export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
    const CF_API_TOKEN = process.env.CF_API_TOKEN;
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyGqO8MjHBixwFNaba0fMnCMbjOlmwwM77-BKwsVbUH6HZ_bqTkQa0lH48n1Fl86iavuQ/exec";
    const MODEL = "@cf/meta/llama-3.1-8b-instruct";

    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return new Response(JSON.stringify({
        error: 'Missing credentials',
        hasAccountId: !!CF_ACCOUNT_ID,
        hasToken: !!CF_API_TOKEN
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const { messages } = body;
    const userMessage = messages[messages.length - 1]?.content || '';
    const startTime = Date.now();

    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CF_API_TOKEN}`
        },
        body: JSON.stringify({ messages, max_tokens: 500 })
      }
    );

    const data = await cfResponse.json();
    const responseTime = Date.now() - startTime;

    if (!cfResponse.ok || !data.result?.response) {
      return new Response(JSON.stringify({
        error: 'Cloudflare error',
        status: cfResponse.status,
        data: data
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const aiResponse = data.result.response;

    // Log to Google Sheet (fire and forget)
    fetch(WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        userMessage,
        aiResponse,
        messageLength: userMessage.length,
        responseTime
      })
    }).catch(() => {});

    return new Response(JSON.stringify({ reply: aiResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
