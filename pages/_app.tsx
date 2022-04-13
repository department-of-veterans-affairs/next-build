import '../styles/globals.css'
import type { AppProps } from 'next/app'


export function reportWebVitals(metric: object) {
  console.log(metric);
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
