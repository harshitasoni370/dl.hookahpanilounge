import { useEffect } from 'react'

export default function Makeityourmoment() {
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
          <section className="lounge-hero bg-hero" aria-labelledby="moment-hero-heading">
          <p className="lounge-hero__welcome">Make It Your Moment</p>
          <h1 id="moment-hero-heading" className="lounge-hero__title">Turn Your Celebration Into a Show.</h1>
          <p className="lounge-hero__copy">
            Personalized celebration add-ons â screen shoutouts, pyro shots and party poppers for birthdays, anniversaries and special surprises.
          </p>
          <ul className="bg-hero__perks">
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <rect x="2.5" y="5" width="19" height="12" rx="1.5" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </span>
              <span>Big Screen</span>
            </li>
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M12 3c2.2 3.2 4.5 5.2 4.5 8.2a4.5 4.5 0 1 1-9 0C7.5 8.2 9.8 6.2 12 3z" />
                  <path d="M9.2 14.5c.6 1.4 1.5 2.2 2.8 2.2s2.2-.8 2.8-2.2" />
                </svg>
              </span>
              <span>Pyro Effects</span>
            </li>
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M12 3l1.2 3.2L16.5 7l-2.8 2.1.9 3.4L12 10.8 9.4 12.5l.9-3.4L7.5 7l3.3-.8L12 3z" />
                </svg>
              </span>
              <span>Grand Bundle</span>
            </li>
          </ul>
        </section>

        <section className="lounge-panel bg-panel" aria-labelledby="browse-heading">
          <div className="lounge-panel__head">
            <span className="lounge-panel__rule" aria-hidden="true"></span>
            <h2 id="browse-heading">Browse Moments</h2>
            <span className="lounge-panel__rule" aria-hidden="true"></span>
          </div>

          <div className="bg-toolbar">
            <p id="moment-count" className="bg-toolbar__count">4 moments</p>

            <label className="bg-search">
              <span className="sr-only">Search moments</span>
              <input
                type="search"
                id="moment-search"
                placeholder="Search moments..."
                autocomplete="off"
                enterkeyhint="search"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </label>

            <button type="button" className="bg-request-btn" id="moment-book-any">
              Book Your Moment
            </button>
          </div>

          <div className="bg-filters" id="moment-filters" role="group" aria-label="Filter by type">
            <button type="button" className="bg-filter is-active" data-filter="all" aria-pressed="true">All Moments</button>
            <button type="button" className="bg-filter" data-filter="screen" aria-pressed="false">Screen</button>
            <button type="button" className="bg-filter" data-filter="effects" aria-pressed="false">Effects</button>
            <button type="button" className="bg-filter" data-filter="bundle" aria-pressed="false">Bundle</button>
          </div>

          <div className="bg-grid" id="moment-grid" aria-live="polite">
            <article className="bg-card" data-categories="screen" data-name="shine on screen" data-id="screen">
              <div className="bg-card__media bg-card__media--moment-screen">
                <img
                  src="assets/images/moments/screen.webp"
                  alt="Personalized name and photo displayed on the big screen"
                  width="640"
                  height="400"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="bg-card__body">
                <h3 className="bg-card__title">Shine on Screen</h3>
                <ul className="bg-card__meta">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <span>AED 50 / Session</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <rect x="2.5" y="5" width="19" height="12" rx="1.5" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                    <span>Name + photo + message</span>
                  </li>
                </ul>
                <p className="bg-card__desc">
                  Your name, photo and personalized message on our big screen â perfect for birthdays, anniversaries and congratulations.
                </p>
                <div className="bg-card__status bg-card__status--available">
                  <span className="bg-card__status-dot" aria-hidden="true"></span>
                  <span>Available</span>
                </div>
                <div className="bg-card__actions bg-card__actions--single">
                  <button type="button" className="bg-card__btn bg-card__btn--solid" data-action="book" data-id="screen">
                    Book Moment
                  </button>
                </div>
              </div>
            </article>

            <article className="bg-card" data-categories="effects" data-name="pyro moment" data-id="pyro">
              <div className="bg-card__media bg-card__media--moment-pyro">
                <img
                  src="assets/images/moments/pyro.webp"
                  alt="Cake presentation with pyrotechnic celebration effect"
                  width="640"
                  height="400"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="bg-card__body">
                <h3 className="bg-card__title">Pyro Moment</h3>
                <ul className="bg-card__meta">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <span>AED 100 / Shot</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path d="M12 3c2.2 3.2 4.5 5.2 4.5 8.2a4.5 4.5 0 1 1-9 0C7.5 8.2 9.8 6.2 12 3z" />
                    </svg>
                    <span>Cake &amp; special moments</span>
                  </li>
                </ul>
                <p className="bg-card__desc">
                  Add a dramatic pyrotechnic celebration effect to your cake presentation or special moment, subject to venue safety rules.
                </p>
                <div className="bg-card__status bg-card__status--available">
                  <span className="bg-card__status-dot" aria-hidden="true"></span>
                  <span>Available</span>
                </div>
                <div className="bg-card__actions bg-card__actions--single">
                  <button type="button" className="bg-card__btn bg-card__btn--solid" data-action="book" data-id="pyro">
                    Book Moment
                  </button>
                </div>
              </div>
            </article>

            <article className="bg-card" data-categories="effects" data-name="party popper moment" data-id="popper">
              <div className="bg-card__media bg-card__media--moment-popper">
                <img
                  src="assets/images/moments/popper.webp"
                  alt="Party poppers and confetti during a celebration"
                  width="640"
                  height="400"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="bg-card__body">
                <h3 className="bg-card__title">Party Popper Moment</h3>
                <ul className="bg-card__meta">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <span>AED 50</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path d="M12 14v7M9 21h6" />
                    </svg>
                    <span>Confetti celebration</span>
                  </li>
                </ul>
                <p className="bg-card__desc">
                  A coordinated party popper and confetti moment during your cake cutting or special announcement.
                </p>
                <div className="bg-card__status bg-card__status--available">
                  <span className="bg-card__status-dot" aria-hidden="true"></span>
                  <span>Available</span>
                </div>
                <div className="bg-card__actions bg-card__actions--single">
                  <button type="button" className="bg-card__btn bg-card__btn--solid" data-action="book" data-id="popper">
                    Book Moment
                  </button>
                </div>
              </div>
            </article>

            <article className="bg-card" data-categories="bundle" data-name="the grand moment" data-id="grand">
              <div className="bg-card__media bg-card__media--moment-grand">
                <img
                  src="assets/images/moments/grand.webp"
                  alt="The Grand Moment with screen, pyro and party poppers together"
                  width="640"
                  height="400"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="bg-card__body">
                <h3 className="bg-card__title">The Grand Moment</h3>
                <ul className="bg-card__meta">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <span>AED 175</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path d="M12 3l1.2 3.2L16.5 7l-2.8 2.1.9 3.4L12 10.8 9.4 12.5l.9-3.4L7.5 7l3.3-.8L12 3z" />
                    </svg>
                    <span>All three combined</span>
                  </li>
                </ul>
                <p className="bg-card__desc">
                  The full experience: personalized screen, 1 pyro shot and party poppers â save when you book the bundle.
                </p>
                <div className="bg-card__status bg-card__status--available">
                  <span className="bg-card__status-dot" aria-hidden="true"></span>
                  <span>Best Value</span>
                </div>
                <div className="bg-card__actions bg-card__actions--single">
                  <button type="button" className="bg-card__btn bg-card__btn--solid" data-action="book" data-id="grand">
                    Book Bundle
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div className="bg-empty" id="moment-empty" hidden>
            <p>No moments match your search. Try another category or keyword.</p>
            <button type="button" className="bg-filter is-active" id="moment-reset-filters">
              Show All Moments
            </button>
          </div>
        </section>

        <section className="bg-info" aria-label="How it works and booking notes">
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
                  <strong>1. Choose a Moment</strong>
                  <p>Pick a screen shoutout, pyro shot, poppers â or the full Grand Moment bundle.</p>
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
                  <strong>2. Book on WhatsApp</strong>
                  <p>Tap âBook Momentâ and share your celebration details with our team.</p>
                </div>
              </li>
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path d="M12 22s8-4.5 8-11.2A4.8 4.8 0 0 0 12 6.2 4.8 4.8 0 0 0 4 10.8C4 17.5 12 22 12 22z" />
                    <path d="M9.5 11.2l1.7 1.7 3.4-3.5" />
                  </svg>
                </span>
                <div>
                  <strong>3. We Set It Up</strong>
                  <p>Our team prepares the screen, effects and timing around your visit.</p>
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
                  <strong>4. Celebrate</strong>
                  <p>Enjoy the moment with your guests â weâll handle the show.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="lounge-panel bg-info__card">
            <div className="lounge-panel__head">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h2>Booking Notes</h2>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </div>
            <ul className="bg-rules">
              <li>Moments are available for dine-in guests</li>
              <li>Please book in advance for peak hours and weekends</li>
              <li>Pyro effects are subject to venue safety rules and availability</li>
              <li>Share name, photo and message details when booking screen moments</li>
              <li>Effects timing is coordinated with cake cutting or announcements</li>
              <li>The Grand Moment includes screen + 1 pyro shot + party poppers</li>
              <li>Prices are in AED and may vary during special events</li>
            </ul>
          </div>
        </section>

        <footer className="lounge-panel bg-footer">
          <div className="bg-footer__promo">
            <span className="bg-footer__trophy" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M12 3l1.2 3.2L16.5 7l-2.8 2.1.9 3.4L12 10.8 9.4 12.5l.9-3.4L7.5 7l3.3-.8L12 3z" />
                <path d="M5 14l.7 1.8L7.5 16l-1.5 1.2.5 1.9L5 18.2 3.5 19.1l.5-1.9L2.5 16l1.8-.2L5 14z" />
                <path d="M19 14l.7 1.8L21.5 16l-1.5 1.2.5 1.9L19 18.2l-1.5.9.5-1.9L16.5 16l1.8-.2L19 14z" />
              </svg>
            </span>
            <div className="bg-footer__promo-copy">
              <strong>Moment of the Week</strong>
              <p>Book <em>The Grand Moment</em> and make your celebration unforgettable.</p>
            </div>
          </div>

          <div className="bg-footer__featured">
            <div className="bg-footer__featured-media">
              <img
                src="assets/images/moments/grand.webp"
                alt="The Grand Moment celebration package"
                width="144"
                height="144"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bg-footer__featured-body">
              <span className="bg-footer__featured-label">Featured</span>
              <strong>THE GRAND MOMENT</strong>
              <p>Screen + Pyro + Poppers Â· AED 175</p>
              <button type="button" className="bg-footer__play" id="moment-play-featured">Book Now</button>
            </div>
          </div>
        </footer>
        </main>
      </div>
    </>
  )
}
