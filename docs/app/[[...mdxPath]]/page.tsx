import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../mdx-components'

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
  if (params.mdxPath && params.mdxPath[0]?.startsWith('_')) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>404 — Page Not Found</h2>
        <p>The requested page could not be found.</p>
      </div>
    )
  }
  let result
  try {
    result = await importPage(params.mdxPath)
  } catch {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>404 — Page Not Found</h2>
        <p>The requested page could not be found.</p>
      </div>
    )
  }
  const { default: MDXContent, toc, metadata } = result
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
