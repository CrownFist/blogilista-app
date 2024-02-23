import React, { useState } from 'react'

const BlogForm = ( { createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')




  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
      title:
          <input
            type='text'
            value={title}
            name='Title'
            onChange={event => setTitle(event.target.value)}
            placeholder='write blog title here'
            id='blog-title'
          />
        </div>
        <div>
      author
          <input
            type='text'
            value={author}
            name='Author'
            onChange={event => setAuthor(event.target.value)}
            placeholder='write blog author here'
            id='blog-author'
          />
        </div>
        <div>
      url
          <input
            type='text'
            value={url}
            name='Url'
            onChange={event => setUrl(event.target.value)}
            placeholder='write blog url here'
            id='blog-url'
          />
        </div>
        <button type='submit' id='blog-submit-button' placeholder='submit blog here'>create</button>
      </form>
    </>
  )
}

export default BlogForm