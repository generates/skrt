import util from 'util'
import path from 'path'
import { promises as fs } from 'fs'
import { createLogger } from '@generates/logger'
import glob from 'glob'
import buildFile from '../buildFile.js'
import watch from './watch.js'

const ignore = 'node_modules/**'
const globOptions = { nosort: true, nodir: true, ignore, absolute: true }
const globAsync = util.promisify(glob)
const logger = createLogger({ level: 'info', namespace: 'skrt.build' })

export default async function build (input, isCommand = true) {
  if (input.watch && isCommand) return watch(input)

  const [src, out] = input.args
  logger.debug('Build args', { src, out })

  let srcDir
  let srcFiles
  try {
    //
    srcDir = path.resolve(src)

    //
    srcFiles = await globAsync(`${srcDir}/**/*.mdx`, globOptions)
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Source directory '${srcDir}' not found.`)
    }
    throw err
  }

  // Make sure the destination directory was specified.
  let outDir
  try {
    outDir = path.resolve(out)
  } catch (err) {
    throw new Error('You must specify a valid destination directory.')
  }

  logger.debug('Source files', srcFiles)

  // Clear the destination directory.
  if (srcFiles.length) {
    const allFiles = await globAsync(`${outDir}/**/*.html`, globOptions)
    const [files, dirs] = allFiles.reduce(
      (acc, file) => {
        const dir = path.dirname(file)
        if (dir === outDir) {
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

  const outFiles = await Promise.all(srcFiles.map(async file => {
    try {
      return buildFile(input, srcDir, outDir, file)
    } catch (err) {
      logger.error(err)
    }
  }))

  process.stdout.write('\n')
  logger.success(`Built files from ${src} to ${out}!`)
  process.stdout.write('\n')

  return { srcDir, outDir, outFiles }
}
