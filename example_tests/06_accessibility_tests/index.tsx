import { faCropSimple } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

function Component1(_props) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img src="https://example.org/example.jpg" />
}

function Component2(_props) {
  /* eslint-disable */
  return (
    <div
      role="button"
      id="target"
      aria-label="Thing 1"
      aria-mccheddarton="Unsupported thing 2"
    ></div>
  )
  /* eslint-enable */
}

/**
 * Select a color, display the name, and set the background to that color.
 *
 * Obviously, some values result in a non-accessible page.
 *
 * However, we can't catch issues like this in JSDOM.
 *
 * The structure of `props` should follow this:
 * {
 *   colors: {
 *     'ffffff': 'White',
 *     ....
 *   }
 * }
 *
 * @param {Object} props contains colors
 * @returns {Component} A component.
 */
function Component3({ colors }): JSX.Element {
  const hexColors = Object.keys(colors)
  const defaultColor = hexColors[0]
  const [color, setColor] = React.useState(defaultColor)
  return (
    <div
      style={{
        backgroundColor: `#${color}`,
        color: '#330000',
      }}
    >
      <h1>{colors[color]}</h1>
      <label htmlFor="color">Color</label>
      <select
        onChange={(event) => setColor(event.target.value)}
        id="color"
        name="color"
      >
        {hexColors.map((hexColor) => (
          <option key={hexColor} value={hexColor}>
            {colors[hexColor]}
          </option>
        ))}
      </select>
      <div>This text needs to be visible.</div>
    </div>
  )
}

export { Component1, Component2, Component3 }
