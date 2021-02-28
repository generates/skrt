import path from 'path'
import { createRequire } from 'module'
import { promises as fs, mkdirSync } from 'fs'
import { createLogger } from '@generates/logger'
import { addHook } from 'pirates'
import mdx from '@mdx-js/mdx'
import babel from '@babel/core'
import remarkPrism from 'remark-prism'
import remarkSlug from 'remark-slug'
import remarkAbbr from 'remark-abbr'
import React from 'react'
import ReactDOMServer from 'react-dom/server.node.js'
import extractDataPlugin from './extractDataPlugin.js'
import extractTocPlugin from './extractTocPlugin.js'

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ],
    '@babel/preset-react'
  ]
}
const logger = createLogger({ level: 'info', namespace: 'skrt.build' })
const require = createRequire(import.meta.url)
const mdxImport = "import { mdx } from '@mdx-js/react'\n"
const data = {}

// Create a matcher function that allows the require hook to be enabled for any
// project (e.g. non-npm/node_modules) file or the layouts in the
// @generates/skrt module.
function matcher (file) {
  return !file.includes('node_modules') || file.includes('@generates/skrt')
}

// Add a require hook using pirates to allow jsx/mdx files to be transpiled
// using MDX and Babel before it gets executed by Node.js.
addHook(
  (content, file) => {
    logger.debug('Require hook', file)
    if (path.extname(file) === '.mdx') {
      // Create a data object for the file so that metadata can be extracted
      // from .mdx files and used later.
      data[file] = {}

      // Configure MDX/Remark.
      const opts = {
        remarkPlugins: [
          remarkPrism,
          remarkSlug,
          remarkAbbr,
          extractDataPlugin(data[file]),
          extractTocPlugin(data[file])
        ]
      }

      // Build the content using MDX.
      content = mdxImport + mdx.sync(content, opts)
    }
    const { code } = babel.transformSync(content, babelOptions)
    return code
  },
  { exts: ['.js', '.jsx', '.mdx'], ignoreNodeModules: false, matcher }
)

export default async function buildFile (input, srcDir, outDir, file) {
  try {
    logger.debug('Build file', file)

    // Require/transpile the source file into the page component's content.
    const { default: content } = require(file)

    // Combine the configuration input and the extracted page metadata into
    // props that will be passed to the page component.
    const props = { input, ...data[file] }
    logger.debug('Props', props)

    // Determine if the page needs a layout and which layout to use.
    const layout = { name: props.layout || input.layout }
    if (layout.name) {
      layout.file = ['base', 'skrt', 'docs'].includes(layout.name)
        ? require.resolve(`./layouts/${layout.name}.jsx`)
        : path.resolve(input.layouts, layout.name)
      layout.content = require(layout.file).default
    }

    // Delete the file and layout file from the require cache so that it can be
    // updated during development.
    delete require.cache[file]
    delete require.cache[layout.file]

    // Create the React page component with the layout, props, and content.
    const page = layout.content
      ? React.createElement(layout.content, props, React.createElement(content))
      : React.createElement(content, props)

    // Render the React page component into static HTML.
    const html = ReactDOMServer.renderToStaticMarkup(page)

    // Make sure the output directory exists by creating it if necessary.
    const dir = path.join(outDir, path.relative(srcDir, path.dirname(file)))
    mkdirSync(dir, { recursive: true })

    // Write the HTML file to the filesystem.
    const filename = path.join(dir, path.basename(file, '.mdx') + '.html')
    await fs.writeFile(filename, `<!doctype html>${html}`)

    // Return the HTML file path.
    return filename
  } catch (err) {
    logger.error(err)
  }
}
