import { parse } from '@babel/parser'
import generate from '@babel/generator'
import traverse from '@babel/traverse'
import visit from 'unist-util-visit'

const parseOptions = { plugins: ['jsx'], sourceType: 'module' }

export default data => () => tree => {
  // Add any exports to data.
  visit(
    tree,
    'export',
    node => {
      traverse.default(
        parse(node.value, parseOptions),
        {
          VariableDeclarator (path) {
            const { code } = generate.default(path.node.init)
            // eslint-disable-next-line no-eval
            data[path.node.id.name] = eval(code)
          }
        }
      )
    }
  )

  // Add the first H1 as the title.
  const byIsFirstHeading = c => c.type === 'heading' && c.depth === 1
  const firstHeading = tree && tree.children.find(byIsFirstHeading)
  if (firstHeading && firstHeading.children && firstHeading.children.length) {
    data.title = firstHeading.children[0].value
  }
}
