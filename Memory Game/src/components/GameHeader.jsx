import { useEffect, useRef, useState } from 'react';

// Keeps the scroll progress between 0 and 1 so CSS values never overshoot.
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// The logo should wait briefly before shrinking, then finish before the setup panel reaches the navbar.
const TRANSITION_START_TRAVEL = 40;
const TRANSITION_END_TRAVEL = 280;
const MOBILE_BREAKPOINT = 576;

// Logo sizes for the large centered state and compact navbar state.
const HEADER_SIZES = {
  desktop: {
    compactLogoWidth: 120,
    compactHeight: 85,
    largeHeight: 360,
    largeLogoWidth: 330,
  },
  mobile: {
    compactLogoWidth: 112,
    compactHeight: 77,
    largeHeight: 300,
    largeLogoWidth: 280,
  },
};

function GameHeader({ setupPanelRef }) {
  const headerRef = useRef(null);
  // Stores the setup panel's first top position so all future scroll math is relative to the starting layout.
  const initialSetupTop = useRef(null);
  const [headerState, setHeaderState] = useState({
    headerHeight: 360,
    logoWidth: 330,
    progress: 0,
  });

  useEffect(() => {
    let animationFrame = 0;

    // Converts the setup panel's upward movement into logo size, position, and navbar progress.
    const updateHeader = () => {
      const setupPanel = setupPanelRef.current;

      if (!setupPanel) {
        setHeaderState((currentState) => ({
          ...currentState,
          progress: 0,
        }));
        return;
      }

      // Reset the baseline at the top of the page so refreshes and responsive layout changes stay accurate.
      if (initialSetupTop.current === null || window.scrollY <= 1) {
        initialSetupTop.current = setupPanel.getBoundingClientRect().top;
      }

      const viewportWidth = window.innerWidth;
      const sizeSet = viewportWidth < MOBILE_BREAKPOINT
        ? HEADER_SIZES.mobile
        : HEADER_SIZES.desktop;
      const setupTop = setupPanel.getBoundingClientRect().top;
      const setupTravel = initialSetupTop.current - setupTop;
      const nextProgress = clamp(
        (setupTravel - TRANSITION_START_TRAVEL) / (TRANSITION_END_TRAVEL - TRANSITION_START_TRAVEL),
        0,
        1,
      );

      // Interpolate between the large hero logo and the compact navbar logo.
      const nextLogoWidth = sizeSet.largeLogoWidth
        - ((sizeSet.largeLogoWidth - sizeSet.compactLogoWidth) * nextProgress);
      const nextHeaderHeight = sizeSet.largeHeight
        - ((sizeSet.largeHeight - sizeSet.compactHeight) * nextProgress);

      setHeaderState({
        headerHeight: nextHeaderHeight,
        logoWidth: nextLogoWidth,
        progress: nextProgress,
      });
    };

    // requestAnimationFrame keeps scroll handling smooth and avoids layout work on every scroll event.
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateHeader);
    };

    // Responsive changes can move the setup panel, so the stored baseline must be measured again.
    const handleResize = () => {
      initialSetupTop.current = null;
      scheduleUpdate();
    };

    updateHeader();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', handleResize);
    };
  }, [setupPanelRef]);

  return (
    <div
      ref={headerRef}
      className="game-header"
      style={{
        // CSS variables let the browser animate the logo dimensions and navbar background together.
        '--compact-progress': headerState.progress,
        '--header-height': `${headerState.headerHeight}px`,
        '--logo-width': `${headerState.logoWidth}px`,
      }}
    >
      <img
        className="game-logo"
        src="/memory-master-logo.png"
        alt="Memory Master"
      />
    </div>
  );
}

export default GameHeader;
