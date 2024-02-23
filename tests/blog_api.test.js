const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
//const bcrypt = require('bcrypt')
const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await helper.savaInitialRootUser()
  await helper.saveInitialBlogsWithRootUser()
  //await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the field id is defined in all blogs, default _id is not', async () => {
    const response = await api.get('/api/blogs')
    //tarkastetaan että jokaisella blogilla on kenttä id
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
    //tarkastetaan että jokaisella blogilla on ei ole kenttää _id
    response.body.forEach(blog => {
      expect(blog._id).not.toBeDefined()
    })

  })

  test('the first one is LTT', async () => {
    const response = await api.get('/api/blogs')

    const authors = response.body.map(r => r.author)
    expect(authors).toContain(
      'Linus Sebastian'
    )
  })
})

describe('addition of a new blog', () => {

  test('a valid blog can be added, succeeds with status 201 (Created) ', async () => {
    const token = await helper.rootToken()
    const newBlog = {
      title: 'HardwareCanucks',
      author: 'Dmitri',
      url: 'https://hardwarecanucks.com',
      likes: 44,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map(b => b.author)
    expect(authors).toContain(
      'Dmitri'
    )
  })


  test('a valid blog can be added without likes, likes is set to zero ', async () => {
    const token = await helper.rootToken()
    //Blogin lisäys ilman tykkäyksiä
    const newBlog = {
      title: 'HardwareCanucks',
      author: 'Dmitri',
      url: 'https://hardwarecanucks.com'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    //tarkistetaan että viimeisimmän lisäyksen tykkäysmäärä on 0
    expect(blogsAtEnd[blogsAtEnd.length -1].likes).toBe(0)
  })

  test('a valid blog can be added without author, author is set to empty string', async () => {
    const token = await helper.rootToken()
    //Blogin lisäys ilman tykkäyksiä
    const newBlog = {
      title: 'HardwareCanucks',
      url: 'https://hardwarecanucks.com',
      likes: 55
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    //tarkistetaan että viimeisimmän lisäyksen tykkäysmäärä on 0
    expect(blogsAtEnd[blogsAtEnd.length -1].author).toEqual('')
  })

})

describe('attempted addition of new blog with missing values', () => {

  test('a blog without title is not added, fails with status 400 (Bad Request)', async () => {
    const token = await helper.rootToken()
    const newBlog = {
      author: 'Dimitri',
      url: 'https://hardwarecanucks.com',
      likes: 44,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog without url is not added, fails with status 400 (Bad Request)', async () => {
    const token = await helper.rootToken()
    const newBlog = {
      title: 'Hardware Canucks',
      author: 'Dimitri',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog is not added when user token is invalid, status 401', async () => {
    const token = ('eyJkbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY1MDcyM2NiZmYxNTMzYWY2YzNmMjJlZiIsImlhdCI6MTY5NDk2NjczMiwiZXhwIjoxNjk0OTcwMzMyfQ.8g08-aq0CyUjay_WjhEWg-5kW4DgjqppIMllV45djI4')
    const newBlog = {
      title: 'Hardware Canucks',
      author: 'Dimitri',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })

  test('a blog is not added when user token is not present, status 401', async () => {
    const newBlog = {
      title: 'Hardware Canucks',
      author: 'Dimitri',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })
})



describe('viewing a specific blog', () => {

  test('a specific blog can be viewed', async () => {

    const blogsAtStart = await helper.blogsInDb()
    //console.log('blogs index 0', blogsAtStart[0])

    const resultBlog = await api
      .get(`/api/blogs/${blogsAtStart[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.author).toEqual(blogsAtStart[0].author)
  })
})

describe('deletion of blog', () => {

  test('a blog can be deleted if user who is deleting also created it', async () => {
    const token = await helper.rootToken()
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const authors = blogsAtEnd.map(b => b.author)

    expect(authors).not.toContain(blogToDelete.author)
  //console.log('Author not wished: ', blogToDelete.author)
  })

  test('a blog can not be deleted if user who is deleting did not create it', async () => {

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const newUserLogin = {
      username: 'mluukkai',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const loginResponse = await api
      .post('/api/login')
      .send(newUserLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    //uuden käyttäjän token, yritetään käyttää rootin tekemän blogin poistossa
    const wrongUserToken = loginResponse.body.token
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${wrongUserToken}`)
      .expect(401)


    //katsotaan löytyykö token kirjautumisen vastauksesta
    // console.log(loginResponse.body.token)
    expect(loginResponse.body.token).toBeDefined()
  })
  test('a blog can not be deleted if header does not include bearer token', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })
})





describe('update of blog', () => {

  test('a blog can be updated with new like count', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog =  {
      likes: 150
    }


    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].likes).toBe(150)

  })

  test('a blog can be updated with new title, author and url', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog =  {
      title: 'Looney Tunes',
      author: 'Repe Sorsa',
      url: 'https://looneytunes.com'
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].title).toEqual(updatedBlog.title)
    expect(blogsAtEnd[0].author).toEqual(updatedBlog.author)
    expect(blogsAtEnd[0].url).toEqual(updatedBlog.url)

  })

})

afterAll(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})


