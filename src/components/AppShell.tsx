import type { ReactNode } from 'react';
import type { ActiveView } from '../types';
import TabBar from './TabBar';

interface AppShellProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  children: ReactNode;
}

export default function AppShell({ activeView, onNavigate, children }: AppShellProps) {
  return (
    <div className="app-bg">
      <div className="phone-frame">
        <main className="app-screen">{children}</main>
        {activeView !== 'onboarding' && (
          <button className="lighthouse-fab" onClick={() => onNavigate('lighthouse')} aria-label="打开求助灯塔">
            🗼
          </button>
        )}
        {activeView !== 'onboarding' && <TabBar activeView={activeView} onNavigate={onNavigate} />}
      </div>
    </div>
  );
}
