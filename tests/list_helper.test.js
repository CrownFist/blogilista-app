const listHelper = require('../utils/list_helper')

const emptyBlogs = []
const oneBlogs = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
}]
const ManyBlogs = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
},
{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
},
{
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0
},
{
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0
},
{
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0
},
{
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0
}  ]


describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(oneBlogs)
    expect(result).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(ManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog (by most likes)', () => {

  test('of empty blog list the answer is {}', () => {
    const result = listHelper.favouriteBlog(emptyBlogs)
    expect(result).toEqual({})
  })

  test('when list has only one blog, should return that one', () => {
    const result = listHelper.favouriteBlog(oneBlogs)
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('of a bigger list the retured should be the blog  with most likes', () => {
    const result = listHelper.favouriteBlog(ManyBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})

describe('most active author', () => {

  test('of empty blog list the answer is {}', () => {
    const result = listHelper.mostBlogs(emptyBlogs)
    //   console.log('result of empty: ', result)
    expect(result).toEqual({})
  })

  test('when list has only one blog, should return that one', () => {
    const result = listHelper.mostBlogs(oneBlogs)
    //  console.log('result for one blog', result)
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('of a bigger list the retured should be the blog  with most likes', () => {
    const result = listHelper.mostBlogs(ManyBlogs)
    //  console.log('result for many blog', result)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})


describe('most liked author', () => {

  test('of empty blog list the answer is {}', () => {
    const result = listHelper.mostLikes(emptyBlogs)
    //  console.log('result of empty: ', result)
    expect(result).toEqual({})
  })

  test('when list has only one blog, should return that one', () => {
    const result = listHelper.mostLikes(oneBlogs)
    // console.log('result for one blog', result)
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('of a bigger list the retured should be the blog  with most likes', () => {
    const result = listHelper.mostLikes(ManyBlogs)
    // console.log('result for many blog', result)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 }  )
  })

})


