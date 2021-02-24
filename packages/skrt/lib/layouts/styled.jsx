import React from 'react'

export default ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/@ianwalter/destination@1.0.2/destination.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
