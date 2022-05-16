import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import Footer from '@/components/footer'
import { HEADER_FOOTER_PATH } from '@/lib/constants'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {

  return (
    <>
      <main>{children}</main>
    </>
  )
}
