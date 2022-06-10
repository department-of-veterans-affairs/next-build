import React from 'react'

function Greeting(props) {
  // When we request this component to be rendered:
  //  <Greeting name="Steve" />
  // we'll _actually_ render the following HTML.
  return <h1>Hello, {props.name}!</h1>
}

export default Greeting
