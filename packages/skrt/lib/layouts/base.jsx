import React from 'react'

export default function Base ({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title && <title>{title}</title>}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
