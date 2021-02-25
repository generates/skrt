import React from 'react'

export default ({ children, input }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href={input?.stylesheet} />
        <link rel="stylesheet" href="https://unpkg.com/prism-theme-night-owl@1.4.0/build/no-italics.css"></link>
      </head>
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  )
}
