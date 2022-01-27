require('dotenv').config()
const fastify = require('fastify')({ logger: true })

const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('fastify-multer')
const db = require('./config/index')
const Port = process.env.PORT
const uri = process.env.MONGODB_URI

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
})

// create cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fastify-gallery',
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
})

// create multer image parser
const parser = multer({ storage })

// Register plugins below:
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'fastify-api',
    },
  },
})
fastify.register(db, { uri })
fastify.register(multer.contentParser)
fastify.register(require('./routes/status'))
fastify.register(require('./routes/gallery'))

//Decorate fastify with our parser
fastify.decorate('multer', { parser })

// create server
const start = async () => {
  try {
    await fastify.listen(Port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
