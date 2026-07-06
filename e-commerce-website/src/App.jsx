import { useMemo, useState } from 'react'
import { Cart } from './components/Cart'
import { Checkout } from './components/Checkout'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import {
  ProductPreviewSection,
  WhyShopSection,
} from './components/HomeSections'
import { ProductCatalog } from './components/ProductCatalog'
import { ProductDetails } from './components/ProductDetails'
import { ProductFilters } from './components/ProductFilters'
import { PromoStrip } from './components/PromoStrip'
import { Survey } from './components/Survey'
import { filterGroups, initialFilters, products } from './data/products'
import './App.css'

// App owns the shared state for page flow, filters, cart, checkout, and survey responses.
function App() {
  // View state replaces a routing dependency for this small prototype.
  const [view, setView] = useState('home')
  const [selectedProductId, setSelectedProductId] = useState(products[0].id)

  // Product exploration state for the faceted search on the Shop view.
  const [filters, setFilters] = useState(initialFilters)
  const [priceLimit, setPriceLimit] = useState(120)
  const [specialFilter, setSpecialFilter] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [favoriteIds, setFavoriteIds] = useState([])

  // Checkout state for cart contents and the current checkout step.
  const [cart, setCart] = useState([])
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [details, setDetails] = useState({ name: '', email: '', address: '' })
  const [payment, setPayment] = useState({ card: '', expiry: '', postal: '' })
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Survey state for the communication process required by the assignment.
  const [survey, setSurvey] = useState({ rating: '5', comment: '' })
  const [surveySent, setSurveySent] = useState(false)

  const selectedProduct = products.find((product) => product.id === selectedProductId) || products[0]
  const featuredProducts = products.filter((product) => product.featured).slice(0, 6)
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 4)
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4)
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id))

  // Recalculate visible products whenever facets, search, price, or shortcut filters change.
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const facetMatch = Object.entries(filters).every(([key, selected]) => {
          if (selected.length === 0) return true
          if (key === 'size') return selected.some((size) => product.availableSizes.includes(size))
          if (key === 'color') return selected.some((color) => product.colors.includes(color))
          return selected.includes(product[key])
        })
        const specialMatch = Object.entries(specialFilter).every(
          ([key, value]) => product[key] === value,
        )
        const normalizedSearch = searchQuery.trim().toLowerCase()
        const searchMatch =
          normalizedSearch.length === 0 ||
          [
            product.name,
            product.brand,
            product.category,
            product.material,
            product.color,
            product.description,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch)

        return facetMatch && specialMatch && searchMatch && product.price <= priceLimit
      }),
    [filters, priceLimit, searchQuery, specialFilter],
  )

  // Keep the Shop page populated if a stale filter combination returns no matches.
  const shopProducts = filteredProducts.length > 0 || searchQuery ? filteredProducts : products

  // Expand cart line items with their product data for cart and checkout display.
  const cartItems = useMemo(
    () =>
      cart.map((line) => ({
        ...line,
        product: products.find((product) => product.id === line.id),
      })),
    [cart],
  )

  // Derived order totals keep the cart and checkout summaries consistent.
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8
  const total = subtotal + shipping
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Navigate between prototype views and optionally apply homepage shortcut filters.
  function navigate(nextView, shortcut = {}) {
    if (nextView === 'shop') {
      setSearchQuery('')
      setPriceLimit(120)
      setSpecialFilter({})
      if (shortcut.audience) setFilters({ ...initialFilters, audience: [shortcut.audience] })
      else setFilters(initialFilters)
      if (shortcut.sale || shortcut.newArrival) setSpecialFilter(shortcut)
    }
    if (nextView === 'checkout') setCheckoutStep(0)
    setView(nextView)
  }

  // Open the Shop page with a text search ready to use.
  function openSearch() {
    setFilters(initialFilters)
    setSpecialFilter({})
    setPriceLimit(120)
    setView('shop')
  }

  // Submit search from the header and show matching catalog items.
  function submitSearch(query) {
    setSearchQuery(query)
    openSearch()
  }

  // Add or remove one selected facet value from the active filters.
  function toggleFilter(group, value) {
    setSpecialFilter({})
    setFilters((current) => {
      const active = current[group]
      return {
        ...current,
        [group]: active.includes(value)
          ? active.filter((item) => item !== value)
          : [...active, value],
      }
    })
  }

  // Reset the catalog back to the full product collection.
  function clearFilters() {
    setFilters(initialFilters)
    setSpecialFilter({})
    setPriceLimit(120)
  }

  // Open a product details view before adding a product to the cart.
  function viewProduct(productId) {
    setSelectedProductId(productId)
    setView('product')
  }

  // Add a product to the cart, or increase quantity if it is already there.
  function addToCart(productId, quantity = 1) {
    setCart((current) => {
      const existing = current.find((line) => line.id === productId)
      if (existing) {
        return current.map((line) =>
          line.id === productId
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        )
      }
      return [...current, { id: productId, quantity }]
    })
  }

  // Save or remove products from the favorites page.
  function toggleFavorite(productId) {
    setFavoriteIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }

  // Change cart quantity while removing lines that reach zero.
  function updateQuantity(productId, amount) {
    setCart((current) =>
      current
        .map((line) =>
          line.id === productId
            ? { ...line, quantity: Math.max(0, line.quantity + amount) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  // Mark the prototype order as complete and keep the user on confirmation.
  function placeOrder() {
    setOrderPlaced(true)
    setCheckoutStep(2)
  }

  return (
    <main>
      <PromoStrip />
      <Header
        cartCount={cartCount}
        favoriteCount={favoriteIds.length}
        onNavigate={navigate}
        onSearchChange={setSearchQuery}
        onSearchOpen={openSearch}
        onSearchSubmit={submitSearch}
        searchQuery={searchQuery}
      />

      {view === 'home' && (
        <>
          <Hero onNavigate={navigate} />
          <ProductPreviewSection
            label="Featured"
            favoriteIds={favoriteIds}
            onAddToCart={addToCart}
            onNavigate={navigate}
            onToggleFavorite={toggleFavorite}
            onViewDetails={viewProduct}
            products={featuredProducts}
            title="Featured products"
          />
          <ProductPreviewSection
            label="New arrivals"
            favoriteIds={favoriteIds}
            onAddToCart={addToCart}
            onNavigate={navigate}
            onToggleFavorite={toggleFavorite}
            onViewDetails={viewProduct}
            products={newArrivals}
            title="New arrivals"
          />
          <ProductPreviewSection
            label="Best sellers"
            favoriteIds={favoriteIds}
            onAddToCart={addToCart}
            onNavigate={navigate}
            onToggleFavorite={toggleFavorite}
            onViewDetails={viewProduct}
            products={bestSellers}
            title="Best sellers"
          />
          <WhyShopSection />
        </>
      )}

      {view === 'shop' && (
        <section className="shop-layout" id="shop">
          <ProductFilters
            filterGroups={filterGroups}
            filters={filters}
            onClearFilters={clearFilters}
            onPriceLimitChange={setPriceLimit}
            onToggleFilter={toggleFilter}
            priceLimit={priceLimit}
          />
          <ProductCatalog
            products={shopProducts}
            favoriteIds={favoriteIds}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            onViewDetails={viewProduct}
            title="All products"
          />
        </section>
      )}

      {view === 'favorites' && (
        <section className="favorites-page">
          <ProductCatalog
            products={favoriteProducts}
            favoriteIds={favoriteIds}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            onViewDetails={viewProduct}
            title="Favorite items"
          />
        </section>
      )}

      {view === 'product' && (
        <ProductDetails
          onAddToCart={(productId, quantity) => {
            addToCart(productId, quantity)
            setView('cart')
          }}
          isFavorite={favoriteIds.includes(selectedProduct.id)}
          onBackToShop={() => navigate('shop')}
          onToggleFavorite={toggleFavorite}
          product={selectedProduct}
        />
      )}

      {view === 'cart' && (
        <Cart
          cartItems={cartItems}
          onCheckout={() => navigate('checkout')}
          onQuantityChange={updateQuantity}
          onShop={() => navigate('shop')}
          shipping={shipping}
          subtotal={subtotal}
          total={total}
        />
      )}

      {view === 'checkout' && (
        <Checkout
          cartItems={cartItems}
          checkoutStep={checkoutStep}
          details={details}
          onDetailsChange={setDetails}
          onPaymentChange={setPayment}
          onPlaceOrder={placeOrder}
          onStepChange={setCheckoutStep}
          onSurvey={() => setView('survey')}
          orderPlaced={orderPlaced}
          payment={payment}
          shipping={shipping}
          subtotal={subtotal}
          total={total}
        />
      )}

      {view === 'survey' && (
        <Survey
          onSurveyChange={setSurvey}
          onSurveySubmit={() => setSurveySent(true)}
          survey={survey}
          surveySent={surveySent}
        />
      )}

      <Footer onNavigate={navigate} />
    </main>
  )
}

export default App
