import React from 'react'
import Skrt from './Skrt.jsx'
import MenuIcon from '../components/icons/Menu.jsx'
import CloseIcon from '../components/icons/Close.jsx'

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
      <ul key={index} className="last:mb-0">
        {node.children && node.children.map(renderTocItem)}
      </ul>
    )
  }
  return node.children && node.children.map(renderTocItem)
}

export default function Docs (props) {
  const head = (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@generates/styles/code.min.css"
      />
      {props.head && props.head}
    </>
  )
  return (
    <Skrt {...props} head={head}>
      <div className="flex max-w-screen-xl mx-auto">

        <div>
          <div className="container">
            {props.children}
          </div>
        </div>

        <div className="w-40 sm:w-80 pt-8">

          <div className="sm:hidden w-6 h-6 fixed right-5">
            <a href="#tocMenu">
              <MenuIcon />
            </a>
          </div>

          <div
            id="tocMenu"
            className={`
              hidden sm:block target:block fixed w-full overflow-y-auto
              bg-white pl-5 pt-8 sm:pt-14
              bottom-0 left-0 sm:left-auto top-0
            `}
          >

            <div className="flex items-center">

              <h2 className="text-lg m-0 p-0">
                Contents
              </h2>

              <div className="sm:hidden w-6 h-6 ml-auto mr-5">
                <a href="#">
                  <CloseIcon />
                </a>
              </div>

            </div>

            <div className="text-base mt-4">
              {renderTocItem(props.toc)}
            </div>

          </div>
        </div>

      </div>
    </Skrt>
  )
}
