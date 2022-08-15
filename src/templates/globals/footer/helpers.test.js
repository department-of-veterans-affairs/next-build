import { faker, render, screen } from 'test-utils'
import { createLinkGroups, generateLinkItems, renderColumns } from './helpers'

const getLinks = (count = 5) =>
  Array(count)
    .fill()
    .map(() => ({
      title: faker.lorem.sentence(3),
      href: faker.internet.url(),
    }))

const getColumns = (count = 5, numLinks = 5) =>
  Array(count)
    .fill()
    .map((_, index) => ({
      columns: index,
      links: getLinks(numLinks),
    }))

test('renderColumns() renders an empty div from an empty list of columns', () => {
  render(renderColumns(getColumns(0)))
  expect(document.querySelector('div')).toBeEmptyDOMElement()
})

test('renderColumns() renders a single column from a list of a single column', () => {
  render(renderColumns(getColumns(1, 5)))
  expect(screen.getByRole('list')).toHaveAttribute('class', 'va-footer-links')
})

test('renderColumns() renders three columns from a list of three columns', () => {
  render(renderColumns(getColumns(3, 5)))
  const renderedColumns = screen.getAllByRole('list')
  expect(renderedColumns).toHaveLength(3)
  renderedColumns.forEach((renderedColumn) => {
    expect(renderedColumn).toHaveAttribute('class', 'va-footer-links')
    expect(renderedColumn.children).toHaveLength(5)
  })
})

test('generateLinkItems() renders columns from a list', () => {
  const allColumns = {}
  const columns = getColumns(1, 3).forEach((column) => {
    allColumns[faker.lorem.words(1)] = column.links
  })
  render(generateLinkItems(allColumns))
  const renderedColumns = screen.getAllByRole('list')
  expect(renderedColumns).toHaveLength(1)
  renderedColumns.forEach((renderedColumn) => {
    expect(renderedColumn).toHaveAttribute('class', 'va-footer-links')
    expect(renderedColumn.children).toHaveLength(3)
  })
})

test.skip('generateLinkItems() renders columns from a list with multiple columns', () => {
  const allColumns = {}
  Array(3)
    .fill()
    .forEach(() => {
      const key = faker.lorem.words(1)
      allColumns[key] = []
      getColumns(1, 3).forEach((column) => {
        allColumns[key] = column.links
      })
    })
  render(generateLinkItems(allColumns))
  const renderedColumns = screen.getAllByRole('list')
  expect(renderedColumns).toHaveLength(3)
  renderedColumns.forEach((renderedColumn) => {
    expect(renderedColumn).toHaveAttribute('class', 'va-footer-links')
    expect(renderedColumn.children).toHaveLength(3)
  })
})

test('createLinkGroups() renders columns from a list of links', () => {
  const columnNames = Array(3)
    .fill()
    .map(() => faker.lorem.words(2))
  const links = Array(20)
    .fill()
    .map((item, index) => {
      const columnName = columnNames[index % 3]
      const link = {}
      link.column = columnName
      link.href = faker.internet.url()
      link.title = faker.lorem.sentence(5)
      return link
    })
  render(createLinkGroups(links))
  const renderedColumns = screen.getAllByRole('list')
  expect(renderedColumns).toHaveLength(3)
  renderedColumns.forEach((renderedColumn) => {
    expect(renderedColumn).toHaveAttribute('class', 'va-footer-links')
    expect(renderedColumn.children.length).toBeGreaterThanOrEqual(1)
  })
})
