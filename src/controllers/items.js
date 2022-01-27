const { v4: uuidv4 } = require('uuid')

let items = require('../items')

const getItems = (req, reply) => {
  reply.send(items)
}

const getItem = (req, reply) => {
  const { id } = req.params
  const item = items.find((i) => i.id === id)
  reply.send(item)
}

const addItem = (req, reply) => {
  const { name } = req.body

  const item = {
    id: uuidv4(),
    name: name,
  }

  items = [...items, item]

  reply.code(201).send(item)
}

const deleteItem = (req, reply) => {
  const { id } = req.params

  items = items.filter((i) => i.id !== id)

  reply.send({ message: `Item ${id} has been removed` })
}

const updateItem = (req, reply) => {
  const { id } = req.params
  const { name } = req.body

  items = items.map((i) => (i.id === id ? { id, name } : i))

  item = items.find((i) => i.id === id)

  reply.send(item)
}

module.exports = {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
}