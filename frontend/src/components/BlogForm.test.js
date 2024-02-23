import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {

  const createBlog = jest.fn()

  beforeEach(() => {
    render(<BlogForm createBlog={createBlog} />)
  }
  )

  test('Form calls callback function with expected value',  async () => {

    //etsitään syöttökentät
    const titleInput = screen.getByPlaceholderText('write blog title here')
    const authorInput = screen.getByPlaceholderText('write blog author here')
    const urlInput = screen.getByPlaceholderText('write blog url here')
    const createButton = screen.getByText('create')

    const user = userEvent.setup()

    //syötetään title, author ja url
    await user.type(titleInput, 'this is title')
    await user.type(authorInput, 'this is author')
    await user.type(urlInput, 'this is url')
    //lähetetään blogi mock-handlerille
    await user.click(createButton)
    // oletetaan että mock-handleria kutsuttu kerran
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('this is title')
    expect(createBlog.mock.calls[0][0].author).toBe('this is author')
    expect(createBlog.mock.calls[0][0].url).toBe('this is url')


  })

})