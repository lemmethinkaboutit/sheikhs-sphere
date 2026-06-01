export const prerender = false;

import type { APIRoute } from 'astro';

const CF_ACCOUNT_ID = import.meta.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = import.meta.env.CF_API_TOKEN;
const MODEL = "@cf/meta/llama-3.1-8b-instruct";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { messages } = body;

    const response = await fetch(
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

    const data = await response.json();

    if (!data.result || !data.result.response) {
      return new Response(JSON.stringify({ error: 'No response', data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
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
