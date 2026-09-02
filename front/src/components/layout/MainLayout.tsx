import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SkipLink } from './SkipLink';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const mainRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const isFirstRender = useRef(true);
  const isFullBleed = location.pathname === '/flux';

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <div className={`${styles.root} ${isFullBleed ? styles.rootLocked : ''}`}>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        ref={mainRef}
        className={isFullBleed ? styles.mainFull : 'container'}
      >
        <Outlet />
      </main>
      {!isFullBleed && <Footer />}
    </div>
  );
}
