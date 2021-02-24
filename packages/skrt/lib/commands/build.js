import util from 'util'
import path from 'path'
import { promises as fs, mkdirSync } from 'fs'
import { createLogger } from '@generates/logger'
import glob from 'glob'
import render from '../render.js'

const ignore = 'node_modules/**'
const globOptions = { nosort: true, nodir: true, ignore, absolute: true }
const globAsync = util.promisify(glob)
const logger = createLogger({ level: 'info', namespace: 'skrt.build' })

export default async function build (input) {
  let [srcDir, destDir] = input.args
  logger.debug('Build args', { srcDir, destDir })

  let srcFiles
  try {
    //
    srcDir = path.resolve(srcDir)

    //
    srcFiles = await globAsync(`${srcDir}/**/*.mdx`, globOptions)
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

  logger.debug('Source files', srcFiles)

  // Clear the destination directory.
  if (srcFiles.length) {
    const allFiles = await globAsync(`${destDir}/**/*.html`, globOptions)
    const [files, dirs] = allFiles.reduce(
      (acc, file) => {
        const dir = path.dirname(file)
        if (dir === destDir) {
          acc[0].push(file) // Root file.
        } else {
          acc[1].add(dir) // Nested directory.
        }
        return acc
      },
      [[], new Set([])]
    )
    await Promise.all([
      ...files.map(file => fs.rm(file)),
      ...Array.from(dirs).map(dir => fs.rmdir(dir, { recursive: true }))
    ])
  }

  await Promise.all(srcFiles.map(async file => {
    try {
      //
      const html = render(file)

      //
      const dir = path.join(destDir, path.relative(srcDir, path.dirname(file)))
      mkdirSync(dir, { recursive: true })

      //
      const filename = path.basename(file, '.mdx') + '.html'
      await fs.writeFile(path.join(dir, filename), html)
    } catch (err) {
      logger.error(err)
    }
  }))
}
