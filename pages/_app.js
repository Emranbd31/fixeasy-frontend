import '../styles/globals.css'
import '../styles/hero.css'
import '../styles/admin.css'
import '../styles/registration.css'
import '../styles/theme-aurora.css'

import SupportWidget from '../components/SupportWidget'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SupportWidget />
    </>
  )
}
