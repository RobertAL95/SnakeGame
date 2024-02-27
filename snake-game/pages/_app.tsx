import '../styles/globals.css'
import { StylesProvider } from '@material-ui/core/styles';
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider injectFirst>
    <Component {...pageProps} />
    </StylesProvider>
  )

  // <Component {...pageProps} />
}


