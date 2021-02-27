import React from 'react'

function renderTocItem (node, index = 0) {
  if (node.type === 'text') {
    return node.value
  } else if (node.type === 'link') {
    return (
      <a key={index} href={node.url}>
        {node.children && node.children.map(renderTocItem)}
      </a>
    )
  } else if (node.type === 'listItem') {
    return (
      <li key={index} className="-ml-1 pl-5">
        {node.children && node.children.map(renderTocItem)}
      </li>
    )
  } else if (node.type === 'list') {
    return (
      <ul key={index}>
        {node.children && node.children.map(renderTocItem)}
      </ul>
    )
  }
  return node.children && node.children.map(renderTocItem)
}

export default function Docs ({ children, input, title, toc }) {
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
        <div className="flex max-w-screen-xl mx-auto">

          <div>
            <div className="container">
              {children}
            </div>
          </div>

          <div className="w-80">

            <h2 className="text-lg mt-12">
              Contents
            </h2>

            <div className="text-base">
              {renderTocItem(toc)}
            </div>

          </div>

        </div>
      </body>
    </html>
  )
}
