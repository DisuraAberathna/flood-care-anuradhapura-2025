import type { Metadata } from 'next'
import './globals.css'
import ToastProvider from '@/components/ToastProvider'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Flood Data Management',
  description: 'Application to store data of isolated people from floods',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ToastProvider />
        {children}
        <Footer />
      </body>
    </html>
  )
}

