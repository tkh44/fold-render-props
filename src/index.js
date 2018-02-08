// Basic idea is to compose several components that use a
// children/render fn prop.

/*
 type renderFn = (result: Any<T>, renderFn) => React.Element<*>

 ([
   renderFn: renderFn
 ])
*/
export default function foldRenderProps(
    list,
  { renderPropName = 'children' } = {}
) {
  /*
    // Defined
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

    // Render the following
    <Folder name="bob">{r => <pre>{JSON.stringify(r)}</pre>}</Folder3>

    props:
    - name = "bob"
    - children = result => <pre>{JSON.stringify(result)}</pre>

    <Folder3 name="bob" children={children} />
      <Folder2 {{ ...props, children: (x) => render1}/>
        <Folder1 {{ ...props, children: (x) => render2}/>
          <Folder0 {{ ...props, children: (x) => render3}/>

    // In order to correctly order render fn's we need to reverse the list of renders
    // The basic idea is to reverse and turn the structure "inside out".

    // Reverse
    [
      (result, render) => (
        <ComponentA name={'⒜' + result.name + '⒜'} children={render} />
      ),
      (result, render) => (
        <ComponentB name={'⒝' + result.name + '⒝'} children={render} />
      ),
      (result, render) => (
        <ComponentC name={'⒞' + result.name + '⒞'} children={render} />
      )
    ]

    =>

    [
      (result, render) => (
        <ComponentC name={'⒞' + result.name + '⒞'} children={render} />
      ),
      (result, render) => (
        <ComponentB name={'⒝' + result.name + '⒝'} children={render} />
      ),
      (result, render) => (
        <ComponentA name={'⒜' + result.name + '⒜'} children={render} />
      )
    ]

    // Turn inside out
    // Render the previous return value of the reducer as a child

    // Reducer Default Value (value of `Child` on first iteration)
    Folder0 = ({ children, ...rest }) => children(rest)

    // First item in reversed list
    Child = Folder0
    renderer = (result, render) => (
      <ComponentC name={'⒞' + result.name + '⒞'} children={render} />
    )
    Folder1 = (props) =>
      <Child {{ ...props, children: (x) => renderer(x, props.children)} />

    // Second item in reversed list
    Child = Folder1
    renderer = (result, render) => (
      <ComponentB name={'⒝' + result.name + '⒝'} children={render} />
    )
    Folder2 = (props) =>
      <Child {{ ...props, children: (x) => renderer(x, props.children)} />

    // Third item in reversed list
    Child = Folder2
    renderer = (result, render) => (
      <ComponentA name={'⒜' + result.name + '⒜'} children={render} />
    )
    Folder3 = (props) =>
      <Child {{ ...props, children: (x) => renderer(x, props.children)} />

    // End of list reached and Folder3 is returned

    Because we know that Child is always going to be a pure function we are able to remove the
    intermediary components by calling the SFCs as a standard js functions.

    return Child(prop)

    vs

    return <Child {...props} />

    All together our Folder looks like the following

    props => {
      return (
        <ComponentA name={'⒜' + result.name + '⒜'}>
          {resultA => (
            <ComponentB name={'⒝' + resultA.name + '⒝'}>
              {resultB => (
                <ComponentC name={'⒞' + resultB.name + '⒞'}>
                  {resultC => (
                    props.children(resultC)
                  )}
                </ComponentC>
              )}
            </ComponentB>
          )}
        </ComponentA>
      )
    }
  */

  const UnwrapChildren = props => {
    const { children, render, ...rest } = props
    return (props[renderPropName] || render || children)(rest)
  }

  const reducer = (Child, renderer) => {
    const Folder = props => {
      return Child({
        ...props,
        [renderPropName]: x => {
          return renderer(x, props[renderPropName])
        }
      })
    }
    return Folder
  }

  return list.reverse().reduce(reducer, UnwrapChildren)
}
