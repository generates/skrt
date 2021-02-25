import path from 'path'
import { createLogger } from '@generates/logger'
import browserSync from 'browser-sync'
import build from './build.js'
import buildFile from '../buildFile.js'

const logger = createLogger({ level: 'info', namespace: 'skrt.watch' })

export default async function watch (input) {
  const { srcDir, outDir } = await build(input)

  const bs = browserSync.create()

  const watchedFiles = [
    `${srcDir}/**/*.(mdx|jsx)`,
    `${outDir}/**/*.(css|js)`,
    input.layouts
  ]
  bs.watch(watchedFiles, async (event, file) => {
    logger.debug('Watch event', { event, file })
    if (event === 'change') {
      if (path.extname(file) === '.mdx') {
        bs.reload(await buildFile(input, srcDir, outDir, file))
      } else {
        const { outFiles } = await build(input)
        bs.reload(outFiles)
      }
    }
  })

  bs.init({
    server: {
      baseDir: outDir,
      // Enable pretty urls.
      serveStaticOptions: { extensions: ['html'] }
    },
    notify: false,
    open: false
  })
}
