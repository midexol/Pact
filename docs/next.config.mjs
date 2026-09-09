import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  search: true
})

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true
})
