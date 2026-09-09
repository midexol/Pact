import nextra from 'nextra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextra = nextra({
  defaultShowCopyCode: true,
  search: true
})

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  outputFileTracingRoot: path.resolve(__dirname, '..')
})
