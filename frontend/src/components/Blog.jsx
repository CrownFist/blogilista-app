import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'


const Blog = ({ blog, user, deleteBlog, blogs, handleBlogLike }) => {

  const [showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const handleView = () => {
    setShowAll(!showAll)
  }
  const showAllButtonText = showAll ? 'hide' : 'show'

  const handleLike = () => {
    handleBlogLike()
  }

  const handleDelete = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      console.log('deleting')
      console.log('user before deletion: ', user.id)
      await blogService.remove(blog.id)
      const blogsAfterDeletion = blogs.filter(b => b.id !== blog.id)
      deleteBlog(blogsAfterDeletion)
    }
  }

  //console.log('userID:', user.id, 'blogId: ', blog.user.id)
  return (
    <>
      <div style={blogStyle} className='blog-row'>
        {blog.title} {blog.author} <button onClick={handleView} id='show-hide-button'>{showAllButtonText}</button>
        {showAll && <><div> <a href={blog.url}>{blog.url}</a></div>
          <div> likes {blog.likes} <button type='button' onClick={handleLike} id='like-button'>like</button></div>
          <div>{blog.user.name}</div>
          {user.id === blog.user.id && <div><button type='button' onClick={handleDelete} id='remove-button'>remove</button></div>}
        </>}
      </div>
    </>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  handleBlogLike: PropTypes.func.isRequired
}

export default Blog

