import { fastify, type FastifyInstance } from 'fastify'

import { fastifyOptions, server as serverOptions } from '~/config'
import { initServer, type PluginOpts } from '~/infrastructure/server'

function gracefullShutdown(server: FastifyInstance) {
  const closeServer = async () => {
    try {
      await server.close()
      console.log('Server closed successfully')
      process.exit(0)
    } catch (error) {
      console.error('Error closing server:', error)
      process.exit(1)
    }
  }

  const onError = (event: string) => {
    return (err: Error) => {
      console.log(`Received ${event} error. Exiting...`)
      console.error(err)
      process.exit(1)
    }
  }
  const onSignal = (signal: NodeJS.Signals) => {
    console.log(`Received ${signal}. Closing server...`)
    closeServer()
  }

  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)
  process.on('unhandledRejection', onError('unhandledRejection'))
  process.on('uncaughtException', onError('uncaughtException'))
}

async function start() {
  const server = fastify({
    ...fastifyOptions,
    maxParamLength: 5000,
  })

  server.post('/test', async (_req: any, reply: { send: (arg0: { message: string }) => any }) => {
    return reply.send({
      message:  'OK'
    })
  })
  gracefullShutdown(server)

  await server.listen(serverOptions)
}

start()

// export for front-end
// eslint-disable-next-line import/no-unused-modules
export type { AppRouter } from './infrastructure/http'
