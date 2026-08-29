import { useEffect } from 'react'

export default function Boardgames() {
  useEffect(() => {
    // Initialize page-specific functionality if needed
  }, [])

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

      <div className="lounge-shell" id="app">
        {/* Header component would go here */}
        <main id="main" className="lounge-main">
          <!-- Hero -->
        <section className="lounge-hero bg-hero" aria-labelledby="bg-hero-heading">
          <p className="lounge-hero__welcome">Board Games</p>
          <h1 id="bg-hero-heading" className="lounge-hero__title">Play. Relax. Enjoy Together.</h1>
          <p className="lounge-hero__copy">
            Fun for everyone! Choose a game, request it to your table and enjoy the time with friends and family.
          </p>
          <ul className="bg-hero__perks">
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="3.2" />
                  <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35" />
                  <path d="M16.5 3.7a3.2 3.2 0 0 1 0 6.2" />
                </svg>
              </span>
              <span>For All Ages</span>
            </li>
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <span>Great Time Together</span>
            </li>
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M12 22s8-4.5 8-11.2A4.8 4.8 0 0 0 12 6.2 4.8 4.8 0 0 0 4 10.8C4 17.5 12 22 12 22z" />
                  <path d="M9.5 11.2l1.7 1.7 3.4-3.5" />
                </svg>
              </span>
              <span>Complimentary for Dine-in</span>
            </li>
          </ul>
        </section>

        <!-- Browse panel -->
        <section className="lounge-panel bg-panel" aria-labelledby="browse-heading">
          <div className="lounge-panel__head">
            <span className="lounge-panel__rule" aria-hidden="true"></span>
            <h2 id="browse-heading">Browse Our Games</h2>
            <span className="lounge-panel__rule" aria-hidden="true"></span>
          </div>

          <div className="bg-toolbar">
            <p id="bg-count" className="bg-toolbar__count">12 games</p>

            <label className="bg-search">
              <span className="sr-only">Search games</span>
              <input
                type="search"
                id="bg-search"
                placeholder="Search games..."
                autocomplete="off"
                enterkeyhint="search"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </label>

            <button type="button" className="bg-request-btn" id="bg-request-any">
              Request a Game
            </button>
          </div>

          <div className="bg-filters" id="bg-filters" role="group" aria-label="Filter by category">
            <button type="button" className="bg-filter is-active" data-filter="all" aria-pressed="true">All Games</button>
            <button type="button" className="bg-filter" data-filter="family" aria-pressed="false">Family</button>
            <button type="button" className="bg-filter" data-filter="kids" aria-pressed="false">Kids</button>
            <button type="button" className="bg-filter" data-filter="strategy" aria-pressed="false">Strategy</button>
            <button type="button" className="bg-filter" data-filter="party" aria-pressed="false">Party</button>
            <button type="button" className="bg-filter" data-filter="two-players" aria-pressed="false">Two Players</button>
            <button type="button" className="bg-filter" data-filter="quick" aria-pressed="false">Quick Games</button>
            <button type="button" className="bg-filter" data-filter="card" aria-pressed="false">Card Games</button>
          </div>

          <div className="bg-grid" id="bg-grid" aria-live="polite"></div>

          <div className="bg-empty" id="bg-empty" hidden>
            <p>No games match your search. Try another category or keyword.</p>
            <button type="button" className="bg-filter is-active" id="bg-reset-filters">
              Show All Games
            </button>
          </div>
        </section>

        <!-- How it works + Rules -->
        <section className="bg-info" aria-label="How it works and game rules">
          <div className="lounge-panel bg-info__card">
            <div className="lounge-panel__head">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h2>How It Works</h2>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </div>
            <ol className="bg-steps">
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path d="M12 3.2l1.9 4.7 5.1.4-3.9 3.2 1.2 4.9L12 13.9 7.7 16.4l1.2-4.9L5 8.3l5.1-.4L12 3.2z" />
                  </svg>
                </span>
                <div>
                  <strong>1. Choose a Game</strong>
                  <p>Browse the collection and select your favourite game.</p>
                </div>
              </li>
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 11h18" />
                  </svg>
                </span>
                <div>
                  <strong>2. Request to Your Table</strong>
                  <p>Click on âRequest Gameâ and enter your table number.</p>
                </div>
              </li>
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <rect x="2" y="7" width="20" height="11" rx="3" />
                    <circle cx="7.5" cy="12.5" r="1.4" />
                    <circle cx="16.5" cy="12.5" r="1.4" />
                  </svg>
                </span>
                <div>
                  <strong>3. We Bring It to You</strong>
                  <p>Our team will deliver the game to your table.</p>
                </div>
              </li>
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <div>
                  <strong>4. Enjoy &amp; Return</strong>
                  <p>Have fun! Please return the game to our team after use.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="lounge-panel bg-info__card">
            <div className="lounge-panel__head">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h2>Game Rules</h2>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </div>
            <ul className="bg-rules">
              <li>Games are complimentary for dine-in customers</li>
              <li>Please keep food &amp; drinks away from the games</li>
              <li>Handle games with care â report any missing pieces</li>
              <li>One game set per table at a time (unless available)</li>
              <li>Return games to staff when you are finished</li>
              <li>Please keep noise respectful of other guests</li>
              <li>Children should be supervised while playing</li>
            </ul>
          </div>
        </section>

        <!-- Footer promo -->
        <footer className="lounge-panel bg-footer">
          <div className="bg-footer__promo">
            <span className="bg-footer__trophy" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M8 4h8v3a4 4 0 0 1-8 0V4z" />
                <path d="M8 5H5.5a2.5 2.5 0 0 0 0 5H8M16 5h2.5a2.5 2.5 0 0 1 0 5H16" />
                <path d="M12 11v3M9 20h6M10 17h4v3h-4z" />
              </svg>
            </span>
            <div className="bg-footer__promo-copy">
              <strong>Game of the Week</strong>
              <p>Try our featured game of the week and get <em>10% OFF</em> on any Mocktail!</p>
            </div>
          </div>

          <div className="bg-footer__featured">
            <div className="bg-footer__featured-media">
              <img
                src="assets/images/games/pictionary.webp"
                alt="Pictionary board game"
                width="144"
                height="144"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bg-footer__featured-body">
              <span className="bg-footer__featured-label">Featured</span>
              <strong>PICTIONARY</strong>
              <p>Draw, guess &amp; laugh together</p>
              <button type="button" className="bg-footer__play" id="bg-play-featured">Play Now</button>
            </div>
          </div>
        </footer>
        </main>
      </div>
    </>
  )
}
