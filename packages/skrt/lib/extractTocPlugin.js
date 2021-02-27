import toc from 'mdast-util-toc'

export default data => () => tree => {
  // Add a Table of Contents list to the page props so that it can be used by a
  // TOC component (e.g. in the docs layout).
  data.toc = toc(tree)?.map
}
