#!/usr/bin/env node

import { createLogger } from '@generates/logger'
import cli from '@generates/cli'
import * as skrt from './index.js'

const logger = createLogger({ level: 'info', namespace: 'skrt.cli' })

const input = cli({
  name: 'skrt',
  description: 'A React static site generator (SSG) with launch control',
  usage: 'skrt [command] [args] [options]',
  commands: {
    build: {
      run: skrt.build
    },
    watch: {
      run: skrt.watch
    },
    serve: {
      run: skrt.serve
    }
  },
  options: {
    layout: {
      aliases: ['l'],
      description: 'The default layout to use',
      default: 'base'
    },
    layouts: {
      description: 'The directory to use for custom layouts',
      default: ''
    },
    stylesheet: {
      description: 'A URL for a stylsheet to be used with a layout',
      // default: 'https://unpkg.com/@generates/skrt@1.0.0/skrt.min.css'
      default: 'https://unpkg.com/@ianwalter/destination@1.0.2/destination.min.css'
    }
  }
})

if (input?.helpText) {
  process.stdout.write('\n')

  const [command] = input.args || []
  if (command) {
    logger.error(`Command "${command}" not found`)
    process.stdout.write('\n')
  }

  logger.info(input.helpText)
  process.stdout.write('\n')

  if (command) process.exit(1)
}

if (input?.catch) {
  input.catch(err => {
    logger.fatal(err)
    process.exit(1)
  })
}
