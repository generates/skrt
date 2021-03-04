import React from 'react'

export default function Base (props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {props.head
          ? props.head
          : (
              <>
                {props.title && <title>{props.title}</title>}
                {props.description && (
                  <meta name="description" content={props.description} />
                )}
              </>
            )
        }
      </head>
      <body>
        {props.children}
      </body>
    </html>
  )
}
