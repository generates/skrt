import path from 'path'
import { createRequire } from 'module'
import { createLogger } from '@generates/logger'
import { addHook } from 'pirates'
import mdx from '@mdx-js/mdx'
import babel from '@babel/core'
import React from 'react'
import ReactDOMServer from 'react-dom/server.node.js'
import { promises as fs, mkdirSync } from 'fs'

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

//
addHook(
  (content, file) => {
    const jsx = path.extname(file) === '.mdx'
      ? "import { mdx } from '@mdx-js/react'\n" + mdx.sync(content)
      : content
    const { code } = babel.transformSync(jsx, babelOptions)
    return code
  },
  { exts: ['.jsx', '.mdx'] }
)

export default async function buildFile (srcDir, destDir, file) {
  logger.debug('Build file', file)

  //
  const { default: content } = require(file)

  //
  delete require.cache[file]

  //
  const { default: layout } = require('./layouts/base.jsx')

  //
  const element = React.createElement(layout, {}, React.createElement(content))

  //
  const html = ReactDOMServer.renderToStaticMarkup(element)

  //
  const dir = path.join(destDir, path.relative(srcDir, path.dirname(file)))
  mkdirSync(dir, { recursive: true })

  //
  const filename = path.join(dir, path.basename(file, '.mdx') + '.html')
  await fs.writeFile(filename, `<!doctype html>${html}`)

  return filename
}
