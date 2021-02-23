import path from 'path'
import { createLogger } from '@generates/logger'
import sirv from 'sirv'
import polka from 'polka'

const logger = createLogger({ level: 'info', namespace: 'skrt.serve' })

export default function serve (input) {
  let [dir] = input.args

  //
  try {
    dir = path.resolve(dir)
  } catch (err) {
    throw new Error(`Directory '${dir}' not found.`)
  }

  logger.debug('Serve directory', dir)

  polka()
    .use(sirv(
      path.resolve(dir),
      {
        maxAge: 31536000, // 1 year
        immutable: true
      }
    ))
    .listen(3000, err => {
      if (err) throw err
      logger.info('Skrrrrrrt! http://localhost:3000')
    })
}
