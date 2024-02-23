import { useState, useImperativeHandle, forwardRef } from 'react'

import PropTypes from 'prop-types'


const Togglable = forwardRef((props, ref) => {

  Togglable.displayName = 'Togglable'

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  Togglable.propTypes = {
    buttonLabelShow: PropTypes.string.isRequired,
    buttonLabelHide: PropTypes.string.isRequired

  }


  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <span>
      <span style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabelShow}</button>
      </span>
      <span style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{props.buttonLabelHide}</button>

      </span>
    </span>
  )

})

export default Togglable