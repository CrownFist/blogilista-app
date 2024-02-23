let _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  //reducella summataan kaikki blogien tykkäykset yhteen ja palautetaan summa
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  //reducea hyödyntäen selvitetään iteroiden millä blogilla eniten tykkäyksiä
  return blogs.reduce((mostLikedBlog, blog) => {
    if (!mostLikedBlog.likes || blog.likes > mostLikedBlog.likes) {
      //siistitty versio blogista
      const trimmedBlog = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
      return trimmedBlog
    }
    //palautetaan eniten peukutettu blogi
    return mostLikedBlog
  }, {})
}

const mostBlogs = (blogs) => {
  //jos saatu blogilista on tyhjä, palautetaa suoraan tyhjä lista
  if (blogs.length === 0) {
    return {}
  }
  //käytetään lodashia ryhmittelemään array subarrayhin authorin mukaan
  const byAuthor = _.groupBy(blogs, 'author')
  //_.maxBy palauttaa vain yhden, joten vaikka listoja olisi kaksi samanmittaista
  // niin palautetaan vain yksi
  const longestArray = _.maxBy(_.values(byAuthor), 'length')
  //console.log('printing longestArray', longestArray)
  //palautetaan author ja blogien määrä
  const mostGrindingAuthor = {
    author: longestArray[0].author,
    blogs: longestArray.length
  }
  return mostGrindingAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  //käytetään lodashia ryhmittelemään array subarrayhin authorin mukaan
  const byAuthor = _.groupBy(blogs, 'author')
  //lodashin mappia, ja sen sisällä sumByta hyödyntäen niputetaan blogien tykkäykset authoreittain
  const totalLikesPerAuthor = _.map(byAuthor, (authorBlogs, authorName) => ({
    author: authorName,
    likes: _.sumBy(authorBlogs, 'likes')
  }))
  //console.log('totalLikesPerAuthor: ', totalLikesPerAuthor)

  //maxByta hyödyntäen etsitään uudesta totalLikesPerAuthor-arraysta
  //se jolla on eniten tykkäyksiä
  const authorWithMostLikes = _.maxBy(totalLikesPerAuthor, 'likes')
  //console.log('authorWithMostLikes: ', authorWithMostLikes)
  return authorWithMostLikes

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}