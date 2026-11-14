import PerspectiveText from '@src/components/animationComponents/perspectiveText/Index';
import clsx from 'clsx';
import styles from '@src/components/dom/navbar/styles/menuButton.module.scss';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function MenuButton() {
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading] = useStore(
    useShallow((state) => [state.isMenuOpen, state.setIsMenuOpen, state.lenis, state.isLoading])
  );

  const handleClick = useCallback(() => {
    if (!isLoading) {
      const next = !isMenuOpen;
      setIsMenuOpen(next);
      if (next) {
        lenis?.stop();
      } else {
        lenis?.start();
      }
    }
  }, [isLoading, isMenuOpen, setIsMenuOpen, lenis]);

  return (
    <button
      id="menu-toggle-button"
      type="button"
      onClick={handleClick}
      aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
      aria-expanded={isMenuOpen}
      aria-controls="menu"
      className={clsx('p-xs', styles.button)}
    >
      <PerspectiveText label={isMenuOpen ? 'Close' : 'Menu'} className={clsx('p-x', styles.label)} />
    </button>
  );
}

export default MenuButton;
