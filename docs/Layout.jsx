import React from 'react'
import Docs from '../packages/skrt/lib/layouts/Docs.jsx'

export default function Layout (props) {
  const head = (
    <script
      async
      defer
      data-domain="skrt.generates.io"
      src="https://plausible.io/js/plausible.js"
    />
  )
  return <Docs {...props} head={head} />
}
