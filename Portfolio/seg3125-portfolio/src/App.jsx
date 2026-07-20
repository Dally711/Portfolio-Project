import { useRef } from 'react'
import './App.css'
import analyticsImage from './assets/case studies/living-cost-logo.png'
import ecommerceImage from './assets/case studies/thread-and-form-logo.png'
import ecommerceImage2 from './assets/case studies/thread-form-logo.png'
import memoryGameImage from './assets/case studies/memory-master-logo.png'
import serviceSiteImage from './assets/case studies/meridian-logo-colour.png'
import webDevelopmentIcon from './assets/web-development.svg'
import workflowIcon from './assets/workflow.svg'

function App() {
  // Stores a reference to the custom cursor div so JavaScript can move it.
  const cursorRef = useRef(null)

  // Moves the custom cursor to the current mouse position.
  const moveCursor = (event) => {
    const cursor = cursorRef.current

    if (!cursor) {
      return
    }

    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`
    cursor.classList.add('is-visible')
  }

  // Hides the custom cursor when the mouse leaves the page.
  const hideCursor = () => {
    const cursor = cursorRef.current

    if (cursor) {
      cursor.classList.remove('is-visible')
    }
  }

  return (
    <div className="app-shell" onMouseMove={moveCursor} onMouseLeave={hideCursor}>
      {/* Custom cursor */}
      <div className="custom-cursor" ref={cursorRef} aria-hidden="true"></div>

      {/* Navigation */}
      <nav className="navbar navbar-expand-md navbar-dark fixed-top portfolio-navbar">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">Jaïme D. Tapa</a>

          <div className="navbar-nav ms-auto flex-row gap-3 gap-md-4">
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link" href="#work">How I Work</a>
            <a className="nav-link" href="#projects">Projects</a>
          </div>
        </div>
      </nav>

      {/* Hero / Introduction */}
      <section id="home" className="hero-section text-white">
        <div className="container">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-8">
              <p className="tag mb-3">Designing and Building Digital Experiences</p>
              <h1 className="display-2 fw-bold mb-4">Hi, I&apos;m Jaïme D. Tapa</h1>
              <p className="lead hero-copy mb-4">
                I am a second-year Software Engineering student building clean, user-focused
                digital experiences that are simple, organized and easy to use.
              </p>
              <a href="#projects" className="btn btn-primary btn-lg fw-bold">View My Work</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Me */}
      <section id="about" className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">About Me</h2>
              <p className="fs-5 lh-lg text-secondary">
                I am a second-year Software Engineering student at the University of Ottawa
                with an interest in web development, programming and user interface design.
                I have gained experience through a few projects and co-op placements and I
                want to learn more about cybersecurity.
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <img
                className="section-icon"
                src={webDevelopmentIcon}
                alt="Web development illustration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section id="work" className="section-padding bg-dark text-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-4 text-center workflow-icon-column">
              <img
                className="section-icon section-icon-dark"
                src={workflowIcon}
                alt="Workflow illustration"
              />
            </div>
            <div className="col-lg-8 workflow-text-column">
              <h2 className="fw-bold mb-3">How I Work</h2>
              <p className="fs-5 lh-lg text-white-50">
                My process is guided by user-centered design. I start by understanding
                user needs and the goal of the interface, then organize content clearly,
                build functional layouts and refine the experience through hierarchy,
                spacing and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="projects" className="section-padding">
        <div className="container">
          <h2 className="fw-bold mb-4">Case Studies</h2>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card project-card h-100 shadow-sm">
                <img
                  className="card-img-top project-card-image"
                  src={serviceSiteImage}
                  alt="Meridian Health Physiotherapy logo"
                />
                <div className="card-body d-flex flex-column">
                  <h3 className="h5 card-title fw-bold">Service Site</h3>
                  <p className="card-text text-secondary">A physiotherapy website with service information and online booking.</p>
                  <a
                    className="btn btn-outline-primary mt-auto"
                    href="https://meridianhealthphysiotherapy.netlify.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Website
                  </a>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card project-card h-100 shadow-sm">
                <img
                  className="card-img-top project-card-image"
                  src={memoryGameImage}
                  alt="Memory Master logo"
                />
                <div className="card-body d-flex flex-column">
                  <h3 className="h5 card-title fw-bold">Memory Game</h3>
                  <p className="card-text text-secondary">A sequence-memory game with multiple modes and score tracking.</p>
                  <a 
                    className="btn btn-outline-primary mt-auto"
                    href="https://el-memory-master.netlify.app/"
                    target="_blank"
                    type="button">View Website</a>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card project-card h-100 shadow-sm">
                <img
                  className="card-img-top project-card-image"
                  src={ecommerceImage2}
                  alt="Thread and Form logo"
                />
                <div className="card-body d-flex flex-column">
                  <h3 className="h5 card-title fw-bold">E-commerce Site</h3>
                  <p className="card-text text-secondary">A fashion storefront with product filters, a cart and checkout.</p>
                  <a 
                  className="btn btn-outline-primary mt-auto"
                  href="https://thread-and-form.netlify.app/"
                  target="_blank"
                  type="button">View Website</a>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card project-card h-100 shadow-sm">
                <img
                  className="card-img-top project-card-image"
                  src={analyticsImage}
                  alt="LivingCosts dashboard logo"
                />
                <div className="card-body d-flex flex-column">
                  <h3 className="h5 card-title fw-bold">Analytics Dashboard</h3>
                  <p className="card-text text-secondary">A bilingual dashboard for Canadian cost-of-living trends.</p>
                  <a
                    className="btn btn-outline-primary mt-auto"
                    href="https://living-cost-canada.netlify.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-0">&copy; 2026 Jaïme D. Tapa | Portfolio</p>
      </footer>
    </div>
  )
}

export default App
