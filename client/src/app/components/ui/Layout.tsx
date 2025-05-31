import Navbar from './Navbar'
import Footer from './Footer'
import Container from './Container'

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter }: LayoutProps) {
  return (
    <>
      <Navbar />
      {/* fffef7 */}
      {/* bg-[#e9edff] */}
      <main className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-200 to-pink-100  flex flex-col items-center p-0">
        <Container>
          {children}
        </Container>
      </main>
      {showFooter && <Footer />}
    </>
  )
}