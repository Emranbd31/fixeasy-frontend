import './globals.css'

export const metadata = {
  title: 'FixEasy Platform',
  description:
    'Secure Irish home services marketplace with zero-trust onboarding for clients and professionals.',
  metadataBase: new URL('https://fixeasy.ie')
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  )
}
