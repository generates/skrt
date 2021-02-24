import { createLogger } from '@generates/logger'
import browserSync from 'browser-sync'
import build from './build.js'
import buildFile from '../buildFile.js'

const logger = createLogger({ level: 'info', namespace: 'skrt.watch' })

export default async function watch (input) {
  const { srcDir, destDir } = await build(input)

  const bs = browserSync.create()

  bs.watch(`${srcDir}/**/*.mdx`, async function (event, file) {
    logger.debug('Watch event', { event, file })
    if (event === 'change') bs.reload(await buildFile(srcDir, destDir, file))
  })

  bs.init({
    server: {
      baseDir: destDir,
      // Enable pretty urls.
      serveStaticOptions: { extensions: ['html'] }
    },
    notify: false,
    open: false
  })
}
