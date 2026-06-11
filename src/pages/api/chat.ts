export const prerender = false;
import type { APIRoute } from 'astro';

const MODEL = "llama-3.1-8b-instant";

export const POST: APIRoute = async ({ request }) => {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    // Google Sheets logging webhook
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby7jiSZPZKOksG1iMy102-H8evKkwpvezMdFwSi_5u1MWBord3PaffWh4ljmSnLqE1SJw/exec";

    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { messages } = body;
    const userMessage = messages?.[messages.length - 1]?.content || '';
    const startTime = Date.now();

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.85
      })
    });

    const data = await groqResponse.json();
    const responseTime = Date.now() - startTime;

    const aiResponse = data.choices?.[0]?.message?.content;

    if (!groqResponse.ok || !aiResponse) {
      return new Response(JSON.stringify({
        error: 'AI error',
        status: groqResponse.status,
        data
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log to Google Sheet. Must be awaited: on Vercel serverless the function
    // freezes as soon as the response returns, so an un-awaited fetch never runs.
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          aiResponse,
          messageLength: userMessage.length,
          responseTime
        })
      });
    } catch (err) {
      console.error("Sheets logging error:", err);
    }

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
