import { useState } from 'react'
import logoImage from '../assets/thread-form-logo.png'

// Top navigation keeps the main retail flows easy to reach.
export function Header({
  cartCount,
  favoriteCount,
  onNavigate,
  onSearchChange,
  onSearchOpen,
  onSearchSubmit,
  searchQuery,
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Navigate from the header and close the compact menu after a selection.
  function handleNavigate(nextView, shortcut) {
    setMenuOpen(false)
    onNavigate(nextView, shortcut)
  }

  // Toggle the search field and move the user to the searchable Shop view.
  function handleSearchToggle() {
    setSearchOpen((current) => !current)
    onSearchOpen()
  }

  // Submit typed search text without reloading the page.
  function handleSearchSubmit(event) {
    event.preventDefault()
    onSearchSubmit(searchQuery)
  }

  return (
    <header className="site-header">
      <button className="brand brand-button" type="button" onClick={() => handleNavigate('home')}>
        <img src={logoImage} alt="Thread & Form" />
      </button>
      <nav className={`primary-nav ${menuOpen ? 'menu-open' : ''}`} aria-label="Primary navigation">
        <button type="button" onClick={() => handleNavigate('shop', { audience: 'Men' })}>
          Men
        </button>
        <button type="button" onClick={() => handleNavigate('shop', { audience: 'Women' })}>
          Women
        </button>
        <button type="button" onClick={() => handleNavigate('shop', { audience: 'Kids & Baby' })}>
          Kids & Baby
        </button>
        <button type="button" onClick={() => handleNavigate('shop', { audience: 'Accessories' })}>
          Gifts
        </button>
        <button type="button" onClick={() => handleNavigate('shop', { newArrival: true })}>
          Discover
        </button>
        <button className="sale-link" type="button" onClick={() => handleNavigate('shop', { sale: true })}>
          Sale
        </button>
      </nav>
      <div className="header-icons" aria-label="Shopping tools">
        <form className={`header-search ${searchOpen ? 'search-open' : ''}`} onSubmit={handleSearchSubmit}>
          {searchOpen && (
            <input
              aria-label="Search products"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search"
              type="search"
              value={searchQuery}
            />
          )}
          <button className="icon-button" type="button" onClick={handleSearchToggle} aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 21-4.3-4.3" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </button>
        </form>
        <button className="icon-button favorite-nav-button" type="button" onClick={() => onNavigate('favorites')} aria-label="Favorites">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
          {favoriteCount > 0 && <span>{favoriteCount}</span>}
        </button>
        <button className="icon-button bag-icon" type="button" onClick={() => onNavigate('cart')} aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L21 8H7" />
          </svg>
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>
        <button
          className="icon-button menu-toggle"
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
