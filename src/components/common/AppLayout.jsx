import Header from './Header'
import Footer from './Footer'   // ← 추가

function AppLayout({ children, className = '' }) {
  return (
    <div className="app-shell">
      <Header />
      <main className={`page-container ${className}`.trim()}>{children}</main>
      <Footer />                 {/* ← 추가 */}
    </div>
  )
}

export default AppLayout
