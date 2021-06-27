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
      usage: 'skrt build [source] [output] [options]'
      run: skrt.build,
      options: {
        watch: {
          aliases: ['w'],
          description: ''
        }
      }
    },
    watch: {
      usage: 'skrt watch [source] [output] [options]'
      run: skrt.watch
    },
    serve: {
      usage: 'skrt serve [output] [options]',
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
      default: 'https://unpkg.com/@generates/styles/skrt.min.css'
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
