import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SkipLink } from './SkipLink';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout() {
  const mainRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} ref={mainRef} className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
