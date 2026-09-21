import Header from './Header'

function AppLayout({ children, className = '' }) {
  return (
    <div className="app-shell">
      <Header />
      <main className={`page-container ${className}`.trim()}>{children}</main>
    </div>
  )
}

export default AppLayout
