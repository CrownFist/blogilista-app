const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  //console.log('salasanan pituus: :',  password.length)
  if(password.length < 3){
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/:id/blogs', async (request, response) => {

  const blogs = await Blog.find({ user: request.params.id })
  if (blogs) {
    response.json(blogs)
  } else {
    response.status(404).json('no blogs exists on this user: ' + request.params.id)
  }
})

module.exports = usersRouter