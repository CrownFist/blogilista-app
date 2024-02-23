//siirrä tänne routesetit
const blogsRouter = require('express').Router()
//const { request } = require('http')
const Blog = require('../models/blog')
//const { response } = require('../app')
const User = require('../models/user')
//const jwt = require('jsonwebtoken')

//userExtractoria varten deleten ja postin yhteydessä
const { userExtractor } = require('../utils/middleware')

/* const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
} */

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  /*   //console.log('token is :', request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  } */

  //linkitys käyttäjän ja lisättävän blogin välille
  const user = await User.findById(request.user.id)

  //console.log(' user id and name from token: ', user.id, ' : ' , user.name)

  //uuden blogin voi lisätä ilman tykkäyksia ja authoria
  const blog = new Blog({
    title: body.title,
    author: body.author || '',
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response
      .status(404)
      .json('no blog exists with this id: ' + request.params.id)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogToBeDeleted = await Blog.findById(request.params.id)

  //console.log('vertailu = ', blogToBeDeleted.user.toString() ,' = ', decodedToken.id)

  if (blogToBeDeleted.user.toString() === request.user.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'token invalid for deletion' })
  }
})

//mahdollisuus päivittää title, author, url ja likes arvoja
blogsRouter.put('/:id', async (request, response) => {
  const updateValue = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  }
  //palautetaan juuri päivitetty blogi
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updateValue,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter
