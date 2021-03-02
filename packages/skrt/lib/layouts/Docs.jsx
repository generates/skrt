import React from 'react'
import { oneLine } from 'common-tags'
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
      <ul key={index}>
        {node.children && node.children.map(renderTocItem)}
      </ul>
    )
  } else if (node.type === 'paragraph') {
    return (
      <p key={index}>
        {node.children && node.children.map(renderTocItem)}
      </p>
    )
  }
  return node.children && node.children.map(renderTocItem)
}

export default function Docs (props) {
  const head = (
    <>
      {props.head && props.head}
      <link
        rel="stylesheet"
        href="https://unpkg.com/@generates/styles/code.min.css"
      />
    </>
  )
  return (
    <Skrt {...props} head={head}>
      <div className="flex max-w-screen-xl mx-auto">

        <div className="container min-w-0">
          {props.children}
        </div>

        <div className="w-6 md:w-80 pt-8 md:flex-shrink-0">

          <div className="md:hidden w-6 h-6 fixed right-4 bg-white rounded">
            <a href="#tocMenu">
              <MenuIcon />
            </a>
          </div>

          <div
            id="tocMenu"
            className={oneLine`
              hidden md:block target:block fixed w-full md:max-w-xs
              overflow-y-auto bg-white pl-6 md:pl-0 pr-4 pt-8 md:pt-14
              bottom-0 left-0 md:left-auto top-0
            `}
          >

            <div className="flex items-center">

              <h2 className="text-lg m-0 p-0">
                Contents
              </h2>

              <div className="md:hidden w-6 h-6 ml-auto">
                <a href="">
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
