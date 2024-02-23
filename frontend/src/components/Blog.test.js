import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {

  const mockDeleteHandler = jest.fn()

  const mockLikeHandler = jest.fn()

  beforeEach(() => {

    const user = {
      id: 'd1wa54d16aw5d4ada',
      name: 'Pekka',
      username: 'Testisetä'
    }
    const blog = {
      title: 'DevOps in 15 minutes',
      author: 'Gene Kim',
      url: 'https://fullstackopen.com/',
      user: user,
      likes: 36
    }

    const blogs = [{ blog }]

    render(<Blog blog={blog} user={user} deleteBlog={mockDeleteHandler} blogs={blogs} handleBlogLike={mockLikeHandler} />)
  }
  )

  test('Only blog title and author is visible before show is clicked',  async () => {

    screen.getByText(/DevOps in 15 minutes/i)
    screen.getByText(/Gene Kim/i)
    const urlBeforeShow = screen.queryByText(/fullstackopen.com/i)
    const likesBeforeShow = screen.queryByText(/Likes/i)
    expect(urlBeforeShow).toBeNull()
    expect(likesBeforeShow).toBeNull()
  })

  test('Blog details (url, likes, user) can be seen by clicking show',  async () => {
    const showButtonText = screen.getByText(/show/i)
    const testUser = userEvent.setup()
    await testUser.click(showButtonText)
    screen.debug()
    screen.getByText(/Pekka/i)
    screen.getByText(/fullstackopen.com/i)
    //tykkäyksien otsake+lukumäärä
    screen.getByText(/likes 36/i)

    const hideButton = screen.getByText('hide', { selector: 'button' })
    await testUser.click(hideButton)

    const urlAfterHide = screen.queryByText(/fullstackopen.com/i)
    expect(urlAfterHide).toBeNull()
  })

  test('Blog can be liked twice and the mock handler gets called twice',  async () => {
    const showButtonText = screen.getByText(/show/i)
    const testUser = userEvent.setup()
    await testUser.click(showButtonText)
    const likeButtonText = screen.getByText('like', { selector: 'button' })
    await testUser.click(likeButtonText)
    await testUser.click(likeButtonText)
    expect(mockLikeHandler.mock.calls).toHaveLength(2)

  // turha expect, testi kaatuu getBy osioihin jos on kaatuakseen
  //expect(element).toBeDefined()
  })

})