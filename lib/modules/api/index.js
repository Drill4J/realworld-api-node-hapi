const register = (server, options, next) => {
  const preResponse = (request, reply) => {
    let response = request.response
    if (response.isBoom) {
      const reformated = { errors: {} }
      reformated.errors[response.output.statusCode] = [response.output.payload.message]
      return reply(reformated).code(response.output.statusCode)
    }
    return reply.continue()
  }

  server.register(require('./articles'))
  server.register(require('./users'))
  server.register(require('./profiles'))
  server.register(require('./tags'))

  server.ext('onPreResponse', preResponse)

  server.route({
    method: 'GET',
    path: '/status',
    config: {
      description: 'Status endpoint',
      notes: 'Return the current status of the API',
      tags: ['api', 'status']
    },
    handler: (request, reply) => {
      return reply({status: 'UP'})
    }
  })
  server.route({
    method: 'DELETE',
    path: '/wipe',
    config: {
      description: 'Wipe DB',
      notes: 'Call to wipe DB contents',
      tags: ['api', 'wipe']
    },
    handler: async (request, reply) => {
      try {
        await server.methods.services.articles.wipe()
        await server.methods.services.comments.wipe()
        await server.methods.services.users.wipe()
        return reply({ wipe: true })
      } catch (e) {
        return reply({ wipe: false, error: e && e.message }).code(500)
      }
    }
  })
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register
