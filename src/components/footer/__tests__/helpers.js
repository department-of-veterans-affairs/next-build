import { faker, render, screen, toHaveAttribute } from 'test-utils'
import { renderColumns } from '../helpers'

test('renderColumns() renders an empty div from an empty list of columns', async () => {
  const columns = []
  render(renderColumns(columns))
  expect(document.querySelector('div')).toBeEmptyDOMElement()
})

test('renderColumns() renders a single column from a list of a single column', async () => {
  const links = Array(5)
    .fill()
    .map(() => ({
      title: faker.lorem.sentence(3),
      href: faker.internet.url(),
    }))
  console.log(links)
  const columns = [{ links }]
  render(renderColumns(columns))
  screen.debug()
  expect(screen.getByRole('list')).toHaveAttribute('class', 'va-footer-links')
})

/**
export const renderColumns = (columnLinks) => {
    const render = columnLinks.map((column) => {
      return (
        <>
          <ul className="va-footer-links">
            {column.links.map((link) => {
              return (
                <li key={link.title}>
                  <span className="va-footer-link-text">
                    <a href={link.href}>{link.title}</a>
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )
    })
    return render
  }
  
  export const generateLinkItems = (allColumns) => {
    const linkColumns = Object.keys(allColumns).map((key) => {
      return {
        columns: key,
        links: allColumns[key],
      }
    })
    return renderColumns(linkColumns)
  }
  
  export const createLinkGroups = (links) => {
    const allGroups = links.reduce((acc, link) => {
      if (!acc[link.column]) {
        acc[link.column] = []
      }
      acc[link.column].push({
        href: link.href,
        title: link.title,
      })
      return acc
    }, {})
    return generateLinkItems(allGroups)
  }
  
  */
