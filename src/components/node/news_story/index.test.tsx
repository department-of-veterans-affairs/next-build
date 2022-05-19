/* eslint-disable */
import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import * as data from './mock.json'
import { NewsStory } from './'

describe('NewsStory component renders', () => {
  test('<NewsStory> renders with valid data', () => {
    render(<NewsStory node={data as any} viewMode="full" />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
  })
  test('NewsStory component does not render with invalid data', () => {
    render(<NewsStory node={null} viewMode="full" />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
describe('NewsStory component does not render with invalid viewMode', () => {
  test('<NewsStory> does not render when viewmode does not have full as a prop', () => {
    render(<NewsStory node={data as any} viewMode='large' />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
