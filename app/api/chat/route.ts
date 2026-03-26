import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// In-memory rate limiting: "ip:yyyy-mm-dd" → count
// Best-effort on serverless — resets on cold start, backed by client-side localStorage
const rateLimitStore = new Map<string, number>()

const DAILY_LIMIT = 20

const SYSTEM_PROMPT = `You are the Staybuild assistant. Only answer questions about Staybuild services. Keep responses short and friendly. Always end with a nudge toward the intake form.

Staybuild pricing: Landing page $600, Web app $800, PWA add-on $500, Auth/Clerk +$250, Payments/Stripe +$300, Database/Supabase +$250, External API +$200, Admin dashboard +$400, Maintenance $75/month. Process: form → quote → 50% deposit → build → deliver → final 50%. Timeline 3-7 days. If asked anything unrelated redirect to the intake form.`

export async function POST(req: NextRequest) {
  try {
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

    // Only pass last 10 messages for context window efficiency
    const trimmed = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content),
    }))

    // ── Claude call ────────────────────────────────────────────
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: trimmed,
    })

    const reply =
      response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ success: true, reply, error: null })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
