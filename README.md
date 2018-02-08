# fold-render-props
Fold multiple render prop components into a single component.


[![npm version](https://badge.fury.io/js/fold-render-props.svg)](https://badge.fury.io/js/fold-render-props)
[![Build Status](https://travis-ci.org/tkh44/fold-render-props.svg?branch=master)](https://travis-ci.org/tkh44/fold-render-props)
[![codecov](https://codecov.io/gh/tkh44/fold-render-props/branch/master/graph/badge.svg)](https://codecov.io/gh/tkh44/fold-render-props)


## Install

```bash
npm i fold-render-props -S
```

## Basic Example

```javascript
const ComponentA = props => {
  return props.children({
    name: props.name.toUpperCase()
  })
}

const ComponentB = props =>
  props.children({
    name: props.name.big()
  })


const ComponentC = props => {
  return props.children({
    name: props.name.repeat(3)
  })
}

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

// Usage
const MyComponent = (props) => (
  <div>
    <Folder name="thing">{r => <pre>{JSON.stringify(r)}</pre>}</Folder>
  </div>
)
```

*This renders*

```
<div>
  <pre>
    { "name": "⒜<BIG>⒝⒞THING⒞⒞THING⒞⒞THING⒞⒝</BIG>⒜" }
  </pre>
</div>
```
