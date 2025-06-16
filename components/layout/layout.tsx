import { ReactNode } from 'react'
import Header from './header'
import Footer from './footer'

type LayoutProps = {
  children: ReactNode
  currentPage?: 'home' | 'events' | 'contact'
}

export default function Layout({ children, currentPage = 'home' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header currentPage={currentPage} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
