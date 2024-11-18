import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface PageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, isVisible }) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={isVisible}
      timeout={500}
      classNames="page-transition"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div ref={nodeRef}>
        {children}
      </div>
    </CSSTransition>
  );
};

export default PageTransition;