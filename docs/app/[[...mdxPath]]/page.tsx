import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../mdx-components'
import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const params = await props.params
  try {
    const { metadata } = await importPage(params.mdxPath)
    return metadata
  } catch {
    return { title: '404: Page Not Found' }
  }
}

const Wrapper = useMDXComponents().wrapper

export default async function Page(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const params = await props.params
  const pageMap = await getPageMap()
  let result
  try {
    result = await importPage(params.mdxPath)
  } catch {
    return (
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
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>404 — Page Not Found</h2>
          <p>The requested page could not be found.</p>
        </div>
      </Layout>
    )
  }
  const { default: MDXContent, toc, metadata } = result
  return (
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
      <Wrapper toc={toc} metadata={metadata}>
        <MDXContent params={params} />
      </Wrapper>
    </Layout>
  )
}
