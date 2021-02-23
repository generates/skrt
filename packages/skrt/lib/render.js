import { createRequire } from 'module'
import { createLogger } from '@generates/logger'
import { addHook } from 'pirates'
import mdx from '@mdx-js/mdx'
import babel from '@babel/core'
import React from 'react'
import ReactDOMServer from 'react-dom/server.node.js'

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ],
    '@babel/preset-react'
  ]
}
const require = createRequire(import.meta.url)
const logger = createLogger({ level: 'info', namespace: 'skrt.render' })

//
addHook(
  content => {
    const jsx = "import { mdx } from '@mdx-js/react'\n" + mdx.sync(content)
    const { code } = babel.transformSync(jsx, babelOptions)
    return code
  },
  { exts: ['.mdx'], ignoreNodeModules: true }
)

export default function render (file) {
  logger.debug('Render file', file)

  //
  const { default: page } = require(file)

  //
  const element = React.createElement(page)

  //
  return ReactDOMServer.renderToStaticMarkup(element)
}
