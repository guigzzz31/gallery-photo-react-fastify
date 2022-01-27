const fp = require('fastify-plugin')
const mongoose = require('mongoose')
const Gallery = require('./models/gallery')
const models = { Gallery }

const ConnectDB = async (fastify, options) => {
  try {
    mongoose.connection.on('connected', () => {
      fastify.log.info({ actor: 'MongoDB' }, 'connected')
    })
    mongoose.connection.on('disconnected', () => {
      fastify.log.error({ actor: 'MongoDB' }, 'disconnected')
    })
    const db = await mongoose.connect(options.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
    })

    // decorates fastify with our model
    fastify.decorate('db', { models })
  } catch (error) {
    console.error(error)
  }
}
module.exports = fp(ConnectDB)
