import type { Metadata } from 'next'
import '@fontsource/rajdhani/400.css'
import '@fontsource/rajdhani/500.css'
import '@fontsource/rajdhani/600.css'
import '@fontsource/rajdhani/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'AV Collect - Aviation Trading Cards',
  description: 'Premium aviation trading card platform for plane spotters',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-av-bg">
      <body className="font-sans antialiased min-h-screen bg-av-bg text-av-text">
        {children}
      </body>
    </html>
  )
}
