import React from 'react'
import PropTypes from 'prop-types'


const Notification = ({ notification, notificationType }) => {

  Notification.propTypes = {
    notification: PropTypes.string.isRequired,
    notificationType: PropTypes.string.isRequired
  }

  if (notification === null) {
    return null
  }

  return <div className={notificationType}>{notification}</div>
}

export default Notification