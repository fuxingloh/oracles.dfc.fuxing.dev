const withMDX = require('@next/mdx')({
  extension: /\.page\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.mdx', 'api.ts'],
})
