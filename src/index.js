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

    <Folder name="bob" children={children} />
      <A {{ ...props, children: (x) => render1}/>
        <B {{ ...props, children: (x) => render2}/>
          <C {{ ...props, children: (x) => render3}/>

    // In order to correctly order render fn's we need to reverse the list of renders
    // The basic idea is to reverse and turn the structure "inside out".

    // List
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

    // Turn inside out
    // Render the previous return value of the reducer as a child

    // Reducer Default Value (value of `Child` on first iteration)
    Folder0 = ({ children, ...rest }) => children(rest)

    // First item in list
    Child = Folder0
    renderer = (result, render) => (
      <ComponentA name={'⒜' + result.name + '⒜'} children={render} />
    )
    Folder1 = (props) =>
      <Child {{ ...props, children: (x) => renderer(x, props.children)} />

    // Second item in list
    Child = Folder1
    renderer = (result, render) => (
      <ComponentB name={'⒝' + result.name + '⒝'} children={render} />
    )
    Folder2 = (props) =>
      <Child {{ ...props, children: (x) => renderer(x, props.children)} />

    // Third item in list
    Child = Folder2
    renderer = (result, render) => (
      <ComponentC name={'⒞' + result.name + '⒞'} children={render} />
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

  const without = (obj, keys) => Object.keys(obj)
      .reduce((out, key) => {
        if (keys.indexOf(key) > -1) {
          out[key] = obj[key]
        }
        return out
      }, {})

  const UnwrapChildren = props => {
    return (props[renderPropName] || props.render || props.children)(
      without(props, [renderPropName, 'render', 'children'])
    )
  }

  const reducer = (Child, renderer) => {
    const Folder = props => {
      return Child(
        Object.assign({}, props, {
          [renderPropName]: x => {
            return renderer(x, props[renderPropName])
          }
        })
      )
    }
    return Folder
  }

  return list.reduce(reducer, UnwrapChildren)
}
