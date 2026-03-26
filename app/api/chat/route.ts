import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// In-memory rate limiting: "ip:yyyy-mm-dd" → count
// Best-effort on serverless — resets on cold start, backed by client-side localStorage
const rateLimitStore = new Map<string, number>()
const DAILY_LIMIT = 20

const SYSTEM_PROMPT = `You are the Staybuild assistant. Only answer questions about Staybuild services. Keep responses short and friendly. Always end with a nudge toward the intake form.

Staybuild pricing: Landing page $600, Web app $800, PWA add-on $500, Auth/Clerk +$250, Payments/Stripe +$300, Database/Supabase +$250, External API +$200, Admin dashboard +$400, Maintenance $75/month. Process: form → quote → 50% deposit → build → deliver → final 50%. Timeline 3-7 days. If asked anything unrelated redirect to the intake form.`

export async function POST(req: NextRequest) {
  console.log('[chat] POST handler started')

  try {
    // ── Guard: API key ──────────────────────────────────────────
    const apiKey = process.env.ANTHROPIC_API_KEY
    console.log('[chat] ANTHROPIC_API_KEY present:', !!apiKey, '| length:', apiKey?.length ?? 0)

    if (!apiKey) {
      console.error('[chat] FATAL: ANTHROPIC_API_KEY is not set in environment')
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
    console.log('[chat] rate limit check — ip:', ip, '| count:', count)

    if (count >= DAILY_LIMIT) {
      console.log('[chat] rate limited:', ip)
      return NextResponse.json(
        { success: false, error: 'rate_limited' },
        { status: 429 }
      )
    }

    rateLimitStore.set(key, count + 1)

    // Prune stale entries
    if (rateLimitStore.size > 5000) {
      for (const k of rateLimitStore.keys()) {
        if (!k.endsWith(today)) rateLimitStore.delete(k)
      }
    }

    // ── Validate body ──────────────────────────────────────────
    let body: { messages?: unknown }
    try {
      body = await req.json()
    } catch (parseErr) {
      console.error('[chat] Failed to parse request body:', parseErr)
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { messages } = body
    console.log('[chat] messages received:', Array.isArray(messages) ? messages.length : 'not an array')

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('[chat] Invalid messages array:', messages)
      return NextResponse.json(
        { success: false, error: 'Invalid messages' },
        { status: 400 }
      )
    }

    // ── Build API messages ─────────────────────────────────────
    // Anthropic requires the conversation to start with a user message.
    // The widget prepends an assistant greeting which must be stripped.
    const trimmed = (messages as { role: string; content: string }[])
      .slice(-10)
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content),
      }))

    const firstUserIdx = trimmed.findIndex(m => m.role === 'user')
    console.log('[chat] firstUserIdx:', firstUserIdx, '| trimmed length:', trimmed.length)

    if (firstUserIdx === -1) {
      console.error('[chat] No user message in array — full messages:', JSON.stringify(trimmed))
      return NextResponse.json(
        { success: false, error: 'No user message found' },
        { status: 400 }
      )
    }

    const apiMessages = trimmed.slice(firstUserIdx)
    console.log('[chat] apiMessages to send:', JSON.stringify(apiMessages))

    // ── Claude call ────────────────────────────────────────────
    console.log('[chat] Creating Anthropic client...')
    const client = new Anthropic({ apiKey })

    console.log('[chat] Calling claude-haiku-4-5-20251001...')
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    })

    console.log('[chat] Response received — stop_reason:', response.stop_reason, '| content blocks:', response.content.length)

    const reply =
      response.content[0]?.type === 'text' ? response.content[0].text : ''

    if (!reply) {
      console.error('[chat] Empty reply — full response:', JSON.stringify(response))
      return NextResponse.json(
        { success: false, error: 'Empty response from model' },
        { status: 500 }
      )
    }

    console.log('[chat] Success — reply length:', reply.length)
    return NextResponse.json({ success: true, reply, error: null })

  } catch (err: unknown) {
    // Log every available property so Vercel logs show the exact failure
    console.error('[chat] CAUGHT ERROR ─────────────────────────────')
    console.error('[chat] typeof err:', typeof err)
    console.error('[chat] err constructor:', err instanceof Error ? err.constructor.name : 'unknown')

    if (err instanceof Error) {
      console.error('[chat] err.message:', err.message)
      console.error('[chat] err.stack:', err.stack)
    }

    if (err && typeof err === 'object') {
      // Anthropic SDK errors expose .status, .error, .headers
      const e = err as Record<string, unknown>
      if ('status'  in e) console.error('[chat] err.status:', e.status)
      if ('error'   in e) console.error('[chat] err.error:', JSON.stringify(e.error))
      if ('headers' in e) console.error('[chat] err.headers:', JSON.stringify(e.headers))
      if ('code'    in e) console.error('[chat] err.code:', e.code)

      try {
        console.error('[chat] full err JSON:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      } catch {
        console.error('[chat] (could not JSON.stringify err)')
      }
    }

    console.error('[chat] ─────────────────────────────────────────')

    return NextResponse.json(
      { success: false, error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
