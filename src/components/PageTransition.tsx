import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
}

export default function PageTransition({ children, transitionKey }: PageTransitionProps) {
  const [displayContent, setDisplayContent] = useState(children);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setDisplayContent(children);
      setAnimating(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [transitionKey, children]);

  return (
    <div className={`page-transition ${animating ? 'page-transition-out' : 'page-transition-in'}`}>
      {displayContent}
    </div>
  );
}
