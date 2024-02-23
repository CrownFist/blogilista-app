import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
//import jwt_decode from 'jwt-decode'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')
  //const [userId, setUserId] = useState('')

  // tällä saadaan togglablen-komponentin toiminto käyttöön addBlogissa
  const blogFormRef = useRef()

  //haetaan kaikki blogit ja asetetaan tilaan
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  //jos käyttäjätiedot löytyy localstoragesta, asetaatn
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      console.log(loggedUserJSON)
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      //yksinkertaisempi lisätä backendissa id suoraan userista palautettaviin tietoihin
      //const decodedUser = jwt_decode(user.token)
      //setUserId(decodedUser.id)
    }
  }, [])

  //blogilistan muodostaminen Blog-komponenttien avulla
  const blogList = () =>
    blogs
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          deleteBlog={deleteBlog}
          blogs={blogs}
          handleBlogLike={() => handleBlogLike(blog.id)}
        />
      ))

  //Blog-komponentissa poiston jälkeen kutsutaan tätä päivittämään tila blogilistalla, josta karsittu poistettu
  const deleteBlog = (blogsAfterDelete) => {
    setBlogs(blogsAfterDelete)
  }

  //Hanskataan tykkäys. ...blogToLike syntaksi = "muuten sama" mutta päivitä tykkäykset + 1
  const handleBlogLike = async (blogId) => {
    const blogToLike = blogs.find((blog) => blog.id === blogId)
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
    }
    await blogService.update(blogId, updatedBlog)
    // jos blogilistan blogin id täsmää tykättyyn, korvataan blogi uuden tykkäysmäärän omaavalla blogilla
    const updatedBlogs = blogs.map((b) => (b.id === blogId ? updatedBlog : b))
    setBlogs(updatedBlogs)
  }

  // kirjautuminen
  const handleLogin = async (event) => {
    //lomakkeen oletustoimenpiteen esto
    event.preventDefault()
    //console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username,
        password,
      })
      //token, käyttäjän nimi ja käyttäjänimi localstorageen
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      //
      //const decodedUser = await jwt_decode(user.token)
      //setUserId(decodedUser.id)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotification('')
        setNotificationType('')
      }, 5000)
    }
  }
  const handleLogout = (event) => {
    //nollaa näkymän
    setUser(null)
    //poistetaan token localstoragesta
    window.localStorage.removeItem('loggedBlogAppUser')
    // toimisi myös window.localStorage.clear()
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      console.log('creation succesfull: ', newBlog)
      setNotificationType('success')
      setNotification(
        'a new blog ' + newBlog.title + ' by ' + newBlog.author + ' added'
      )
      setTimeout(() => {
        setNotification('')
        setNotificationType('')
      }, 5000)
    } catch (exception) {
      setNotification('error occured when creating new blog')
      setNotificationType('error')
      setTimeout(() => {
        setNotification('')
        setNotificationType('')
      }, 5000)
    }
  }

  return (
    <>
      {!user && (
        <div>
          <h1>Bloglist app</h1>
          <h2>log in to application</h2>
          <Notification
            notification={notification}
            notificationType={notificationType}
          />
          <LoginForm
            handleLogin={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </div>
      )}

      {user && (
        <div>
          <h2>blogs</h2>
          <Notification
            notification={notification}
            notificationType={notificationType}
          />
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogout} type='logout' id='logout-button'>
              logout
            </button>
          </p>
          <Togglable
            buttonLabelShow='create new blog'
            buttonLabelHide='cancel'
            ref={blogFormRef}
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogList()}
        </div>
      )}
    </>
  )
}

export default App
