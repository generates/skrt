import path from 'path'
import { createRequire } from 'module'
import { promises as fs, mkdirSync } from 'fs'
import { createLogger } from '@generates/logger'
import { addHook } from 'pirates'
import mdx from '@mdx-js/mdx'
import babel from '@babel/core'
import React from 'react'
import remarkPrism from 'remark-prism'
import ReactDOMServer from 'react-dom/server.node.js'
import extractDataPlugin from './extractDataPlugin.js'

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

//
addHook(
  (content, file) => {
    if (path.extname(file) === '.mdx') {
      //
      data[file] = {}

      //
      const opts = {
        remarkPlugins: [extractDataPlugin(data[file]), remarkPrism]
      }

      //
      content = mdxImport + mdx.sync(content, opts)
    }
    const { code } = babel.transformSync(content, babelOptions)
    return code
  },
  { exts: ['.jsx', '.mdx'] }
)

export default async function buildFile (input, srcDir, outDir, file) {
  logger.debug('Build file', file)

  //
  const { default: content } = require(file)

  //
  const props = { input, ...data[file] }
  logger.debug('Props', props)

  //
  const layoutName = props.layout || input.layout
  const layoutFile = ['base', 'skrt', 'docs'].includes(layoutName)
    ? require.resolve(`./layouts/${layoutName}.jsx`)
    : path.resolve(input.layouts, layoutName)
  const layout = require(layoutFile).default

  //
  delete require.cache[file]
  delete require.cache[layoutFile]

  //
  const page = React.createElement(layout, props, React.createElement(content))

  //
  const html = ReactDOMServer.renderToStaticMarkup(page)

  //
  const dir = path.join(outDir, path.relative(srcDir, path.dirname(file)))
  mkdirSync(dir, { recursive: true })

  //
  const filename = path.join(dir, path.basename(file, '.mdx') + '.html')
  await fs.writeFile(filename, `<!doctype html>${html}`)

  return filename
}
