import React from 'react'

export default function Skrt ({ children, input, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href={input?.stylesheet} />
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
