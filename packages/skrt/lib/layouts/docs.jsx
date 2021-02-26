import React from 'react'

export default function Docs ({ children, input, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href={input?.stylesheet} />
        <link rel="stylesheet" href="https://unpkg.com/@generates/styles/code.min.css" />
        {title && <title>{title}</title>}
      </head>
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  )
}
