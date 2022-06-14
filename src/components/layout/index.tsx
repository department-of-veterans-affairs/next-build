import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import Footer from '@/components/footer'
import { HEADER_FOOTER_PATH } from '@/lib/constants'

export interface LayoutProps {
  meta?: React.ReactNode
  menus?: React.ReactNode
  taxonomy?: React.ReactNode
  blocks?: React.ReactNode
  children?: React.ReactNode
}

export default function Layout({
  meta,
  menus,
  blocks,
  taxonomy,
  children,
}: LayoutProps) {
  const { data, error } = useSWR(HEADER_FOOTER_PATH, fetcher)
  if (error || !data) return null
  const { footerData } = data

  return (
    <>
      <main>{children} </main>
      <Footer links={footerData} />
    </>
  )
}
