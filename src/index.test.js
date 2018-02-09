import React from 'react'
import renderer from 'react-test-renderer'
import folder from './index'

const TEST_RENDER_PROP = 'testRenderProp'

const ComponentA = props => {
  console.log('A', typeof props[TEST_RENDER_PROP], props)
  return (props.children || props.render || props[TEST_RENDER_PROP])({
    name: props.name.toUpperCase()
  })
}

ComponentA.displayName = 'A'

const ComponentB = props => {
  console.log(typeof props[TEST_RENDER_PROP])
  return (props.children || props.render || props[TEST_RENDER_PROP])({
    name: props.name.big()
  })
}

ComponentB.displayName = 'B'

const ComponentC = props => {
  console.log(props, typeof props[TEST_RENDER_PROP])
  return (props.children || props.render || props[TEST_RENDER_PROP])({
    name: props.name.repeat(3)
  })
}
ComponentC.displayName = 'C'

describe('fold-render-props', () => {
  const propNames = [TEST_RENDER_PROP]
  propNames.forEach(renderProp => {
    const Folder = folder(
      [
        (result, render) =>
          React.createElement(ComponentA, {
            name: '⒜' + result.name + '⒜',
            [renderProp]: render
          }),
        (result, render) =>
          React.createElement(ComponentB, {
            name: '⒝' + result.name + '⒝',
            [renderProp]: render
          }),
        (result, render) =>
          React.createElement(ComponentC, {
            name: '⒞' + result.name + '⒞',
            [renderProp]: render
          })
      ],
      {
        renderPropName: renderProp
      }
    )

    test('basic ' + renderProp, () => {
      const tree = renderer
        .create(
          React.createElement(Folder, {
            name: renderProp,
            [renderProp]: result => {
              return <pre>{JSON.stringify(result, null, 2)}</pre>
            }
          })
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
