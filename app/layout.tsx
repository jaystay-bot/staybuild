import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CursorGlow from '@/components/CursorGlow'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Staybuild — Real Products. Fast Builds.',
  description: 'Web apps and landing pages built for small businesses and entrepreneurs. Starting at $600.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CursorGlow />
        {children}
      </body>
    </html>
  )
}
