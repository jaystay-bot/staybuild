import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// In-memory rate limiting: "ip:yyyy-mm-dd" → count
// Best-effort on serverless — resets on cold start, backed by client-side localStorage
const rateLimitStore = new Map<string, number>()
const DAILY_LIMIT = 20

const SYSTEM_PROMPT = `You are the Staybuild assistant. Only answer questions about Staybuild services. Keep responses short and friendly. Always end with a nudge toward the intake form.

Staybuild pricing: Landing page $600, Web app $800, PWA add-on $500, Auth/Clerk +$250, Payments/Stripe +$300, Database/Supabase +$250, External API +$200, Admin dashboard +$400, Maintenance $75/month. Process: form → quote → 50% deposit → build → deliver → final 50%. Timeline 3-7 days. If asked anything unrelated redirect to the intake form.`

export async function POST(req: NextRequest) {
  try {
    // ── Guard: API key must be present ─────────────────────────
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured')
      return NextResponse.json(
        { success: false, error: 'Service unavailable' },
        { status: 503 }
      )
    }

    // ── Rate limiting ──────────────────────────────────────────
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const today = new Date().toISOString().slice(0, 10)
    const key = `${ip}:${today}`
    const count = rateLimitStore.get(key) ?? 0

    if (count >= DAILY_LIMIT) {
      return NextResponse.json(
        { success: false, error: 'rate_limited' },
        { status: 429 }
      )
    }

    rateLimitStore.set(key, count + 1)

    // Prune stale entries to prevent memory growth
    if (rateLimitStore.size > 5000) {
      for (const k of rateLimitStore.keys()) {
        if (!k.endsWith(today)) rateLimitStore.delete(k)
      }
    }

    // ── Validate body ──────────────────────────────────────────
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid messages' },
        { status: 400 }
      )
    }

    // ── Build API messages ─────────────────────────────────────
    // Anthropic requires the conversation to start with a user message.
    // The widget prepends an assistant greeting which must be stripped.
    const trimmed = messages
      .slice(-10)
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content),
      }))

    // Drop any leading assistant messages — API rejects them
    const firstUserIdx = trimmed.findIndex(m => m.role === 'user')
    if (firstUserIdx === -1) {
      return NextResponse.json(
        { success: false, error: 'No user message found' },
        { status: 400 }
      )
    }
    const apiMessages = trimmed.slice(firstUserIdx)

    // ── Claude call ────────────────────────────────────────────
    // Instantiate inside handler so the env var is always resolved at runtime
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    })

    const reply =
      response.content[0]?.type === 'text' ? response.content[0].text : ''

    if (!reply) {
      return NextResponse.json(
        { success: false, error: 'Empty response from model' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, reply, error: null })
  } catch (err: unknown) {
    // Log structured error details without exposing them to the client
    if (err && typeof err === 'object' && 'status' in err) {
      const apiErr = err as { status: number; message?: string }
      console.error(`Anthropic API error ${apiErr.status}:`, apiErr.message)
    } else {
      console.error('Chat route error:', err)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
