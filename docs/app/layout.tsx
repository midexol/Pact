import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'PACT Documentation',
  description: 'Persistent Agent Commitment Tracking Documentation',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={
            <Navbar
              logo={<span style={{ fontWeight: 700, fontSize: '1.1rem' }}>PACT Documentation</span>}
              projectLink="https://github.com/midexol/Pact"
            />
          }
          footer={
            <Footer>
              <span>PACT — Persistent Agent Commitment Tracking for Autonomous Agents</span>
            </Footer>
          }
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
