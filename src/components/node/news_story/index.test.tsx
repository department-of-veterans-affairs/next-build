import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import * as data from './mock.json'
import { NewsStory } from './'

describe('NewsStory component renders with valid data', () => {
  test('<NewsStory> renders', () => {
    //eslint-disable-next-line
    render(<NewsStory node={data as any} viewMode="full" />)
    expect(screen.getByText(/We honor outstanding doctors/)).toBeInTheDocument()
  })
})

describe('NewsStory component does not render with invalid data', () => {
  test('<NewsStory> does not render', () => {
    render(<NewsStory node={null} viewMode={null} />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
