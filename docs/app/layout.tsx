import { Head } from 'nextra/components'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'PACT Documentation',
  description: 'Persistent Agent Commitment Tracking Documentation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>{children}</body>
    </html>
  )
}
