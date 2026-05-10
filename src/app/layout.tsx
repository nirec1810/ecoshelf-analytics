import type { Metadata }  from 'next'
import { Geist }          from 'next/font/google'
import './globals.css'
import { Navbar }         from '@/components/shared/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:       'Ecoshelf Analytics',
  description: 'Sistema de gestión de panadería',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} min-h-screen bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}