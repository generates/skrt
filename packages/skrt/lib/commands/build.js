import path from 'path'
import { promises as fs } from 'fs'
import { createRequire } from 'module'
import { createLogger } from '@generates/logger'
import { addHook } from 'pirates'
import mdx from '@mdx-js/mdx'
import babel from '@babel/core'
import React from 'react'
import ReactDOMServer from 'react-dom/server.node.js'

const logger = createLogger({ level: 'info', namespace: 'skrt.build' })
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

addHook(
  content => {
    const jsx = "import { mdx } from '@mdx-js/react'\n" + mdx.sync(content)
    const { code } = babel.transformSync(jsx, babelOptions)
    return code
  },
  { exts: ['.mdx'], ignoreNodeModules: true }
)

export default async function build (input) {
  let [srcDir, destDir] = input.args
  logger.debug('Build args', { srcDir, destDir })

  let srcFiles
  try {
    srcDir = path.resolve(srcDir)
    srcFiles = await fs.readdir(srcDir)
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Source directory '${srcDir}' not found.`)
    }
    throw err
  }

  // Make sure the destination directory was specified.
  try {
    destDir = path.resolve(destDir)
  } catch (err) {
    throw new Error('You must specify a valid destination directory.')
  }

  // Create the destination directory if it doesn't exist.

  //
  await Promise.all(srcFiles.map(async file => {
    const srcFile = path.join(srcDir, file)
    logger.debug('Source file', srcFile)
    const { default: page } = require(srcFile)
    const element = React.createElement(page)
    const html = ReactDOMServer.renderToStaticMarkup(element)
    const filename = path.basename(file, '.mdx') + '.html'
    await fs.writeFile(path.join(destDir, filename), html)
  }))
}
