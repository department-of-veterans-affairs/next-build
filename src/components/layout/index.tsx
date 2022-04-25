import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import Footer from '@/components/footer'
import { HEADER_FOOTER_PATH } from '@/lib/constants'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
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
