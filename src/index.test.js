/* env jest */

import React from 'react'
import renderer from 'react-test-renderer'
import folder from './index'

const ComponentA = props => {
  return props.children({
    name: props.name.toUpperCase()
  })
}

ComponentA.displayName = 'A'

const ComponentB = props =>
  props.children({
    name: props.name.big()
  })

ComponentB.displayName = 'B'

const ComponentC = props => {
  return props.children({
    name: props.name.repeat(3)
  })
}
ComponentC.displayName = 'C'

const Folder = folder([
  (result, render) => (
    <ComponentA name={'⒜' + result.name + '⒜'} children={render} />
  ),
  (result, render) => (
    <ComponentB name={'⒝' + result.name + '⒝'} children={render} />
  ),
  (result, render) => (
    <ComponentC name={'⒞' + result.name + '⒞'} children={render} />
  )
])

describe('fold-render-props', () => {
  test('basic', () => {
    const tree = renderer
      .create(
        <Folder name="abc">
          {result => {
            return <pre>{JSON.stringify(result, null, 2)}</pre>
          }}
        </Folder>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
