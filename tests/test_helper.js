const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'LTT',
    author: 'Linus Sebastian',
    url: 'https://ltt.com',
    likes: 551,
  },
  {
    title: 'SmartHomeTest',
    author: 'Wolfgang',
    url: 'https://duck.party.com',
    likes: 24,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'MKBHD',
    author: 'Marques Brownlee',
    url: 'https://mkbhd.com',
    likes: 100001,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const rootToken = async () => {
  const rootUser = {
    username: 'root',
    password: 'sekret'
  }

  const response =  await api
    .post('/api/login')
    .send(rootUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  //console.log('Token was: ', response._body.token)
  return response._body.token
}

const saveInitialBlogsWithRootUser = async () => {
  const token = await rootToken()
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[0])
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[1])
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

const savaInitialRootUser = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'mr.root', passwordHash })
  await user.save()
}
module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  rootToken,
  savaInitialRootUser,
  saveInitialBlogsWithRootUser
}