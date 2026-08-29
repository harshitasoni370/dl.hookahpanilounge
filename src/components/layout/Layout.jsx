import Header from './Header'

export default function Layout({ children, className = '' }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="lounge-bg" aria-hidden="true">
        <div
          className="lounge-bg__image"
          style={{ backgroundImage: "url('assets/images/index-hero-bg.webp')" }}
        />
        <div className="lounge-bg__overlay" />
      </div>

      <div className={`lounge-shell ${className}`} id="app">
        <Header />
        <main id="main" role="main">
          {children}
        </main>
      </div>
    </>
  )
}
