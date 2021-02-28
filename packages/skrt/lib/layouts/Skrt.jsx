import React from 'react'
import Base from './Base.jsx'

export default function Skrt (props) {
  const head = (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@generates/styles/skrt.min.css"
      />
      {props.head && props.head}
    </>
  )
  return <Base {...props} head={head} />
}
