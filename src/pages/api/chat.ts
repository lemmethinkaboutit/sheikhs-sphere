export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const CF_ACCOUNT_ID = import.meta.env.CF_ACCOUNT_ID;
    const CF_API_TOKEN = import.meta.env.CF_API_TOKEN;
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

    if (!cfResponse.ok || !data.result?.response) {
      return new Response(JSON.stringify({ 
        error: 'Cloudflare error',
        status: cfResponse.status,
        data: data
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ reply: data.result.response }), {
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