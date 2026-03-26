import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.idea || !body.name || !body.email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Staybuild Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: `New Project Inquiry — ${body.serviceType || 'General'} from ${body.name}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
        <hr/>
        <p><strong>Idea:</strong> ${body.idea}</p>
        <p><strong>Service needed:</strong> ${body.serviceType}</p>
        <p><strong>Needs login/payments:</strong> ${body.needsAuth}</p>
        <p><strong>Has branding:</strong> ${body.hasBranding}</p>
        <p><strong>Inspiration sites:</strong> ${body.inspiration || 'None'}</p>
        <p><strong>Timeline:</strong> ${body.timeline}</p>
        <p><strong>Budget:</strong> ${body.budget}</p>
      `,
    })

    return NextResponse.json({ success: true, error: null })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 })
  }
}
