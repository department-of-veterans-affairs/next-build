import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import Footer from '@/components/footer'
import { HEADER_FOOTER_PATH } from '@/lib/constants'

interface LayoutProps {
  children: React.ReactNode
  footerData?: object
}

export default function Layout({ children, footerData }: LayoutProps) {
  if (!footerData) footerData = []
  return (
    <>
      <main>{children}</main>
      <Footer links={footerData} />
    </>
  )
}
