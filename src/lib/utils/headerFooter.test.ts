import { buildHeaderFooterData } from './headerFooter'
import { FooterLink } from '@/types/dataTypes/formatted/headerFooter'

describe('headerFooter', () => {
  test('should combine footer menus into one array', () => {
    const headerMegaMenu = { items: [], tree: [] }
    const footerBottomRail = { items: [], tree: [] }
    const footerColumns = { items: [], tree: [] }

    const result = buildHeaderFooterData({
      footerBottomRail,
      footerColumns,
      headerMegaMenu,
    })

    expect(result.footerData).toBeInstanceOf(Array<FooterLink>)
  })
})
