import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'

import '../styles/globals.css'

import { UserProvider } from '../contexts/UserContext'
import { initSentry } from '../lib/sentry'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function App({ Component, pageProps }) {
  const { initialSession, ...componentProps } = pageProps ?? {}

  useEffect(() => {
    initSentry()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <UserProvider initialSession={initialSession}>
        <div className={inter.variable}>
          <Component {...componentProps} />
        </div>
      </UserProvider>
    </ThemeProvider>
  )
}
