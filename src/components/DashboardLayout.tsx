import React, { useState } from 'react';
import {
  LayoutDashboard,
  Scan,
  Layers,
  History,
  Grid,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Sprout,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { User as UserType, Farm } from '../types/phyto2';

interface DashboardLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
  activeFarm: Farm;
  onExitToLanding: () => void;
  pendingReviewsCount: number;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  activeFarm,
  onExitToLanding,
  pendingReviewsCount,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scanner', label: 'New Inspection', icon: Scan },
    { id: 'evidence', label: 'Evidence Map', icon: Layers },
    { id: 'history', label: 'Inspection History', icon: History },
    { id: 'plants', label: 'Plant Monitoring', icon: Grid },
    { id: 'analytics', label: 'Farm Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const toggleRole = () => {
    if (currentUser.role === 'farmer') {
      setCurrentUser({
        id: 'USR-EXPERT',
        name: 'Dr. C. Gopalakrishnan',
        email: 'gopal.ento@iihr.res.in',
        role: 'expert',
        created_at: '2026-08-15T09:00:00Z',
      });
    } else {
      setCurrentUser({
        id: 'USR-01',
        name: 'Somesh Gowda',
        email: 'somesh.gowda@karnataka-farmers.org',
        role: 'farmer',
        created_at: '2026-09-01T08:00:00Z',
      });
    }
  };

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#071C16] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-[#0B251C] border-r border-[#244637] transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#244637]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] font-black text-sm shrink-0">
                Φ
              </div>
              {!collapsed && (
                <div className="truncate">
                  <span className="font-bold text-white text-sm block">PhytoTrace 2.0</span>
                  <span className="text-[10px] text-[#A3E635] font-mono">Agri-Intelligence</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-[#A7B8AE] hover:text-white p-1 rounded-lg hover:bg-[#103D2B] transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#103D2B] text-[#A3E635] border border-[#A3E635]/30 shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                      : 'text-[#A7B8AE] hover:text-white hover:bg-[#103D2B]/50'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#A3E635]' : 'text-[#73877B]'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.id === 'history' && pendingReviewsCount > 0 && (
                    <span className="ml-auto bg-[#FBBF24]/20 text-[#FBBF24] text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                      {pendingReviewsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Role Switcher */}
        <div className="p-3 border-t border-[#244637] bg-[#071C16]/60">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#164A35] flex items-center justify-center text-xs font-bold text-[#A3E635] shrink-0 border border-[#244637]">
                  {currentUser.role === 'expert' ? 'DR' : 'SG'}
                </div>
                <div className="truncate text-xs">
                  <span className="font-bold text-white block truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-[#A3E635] capitalize font-mono block">
                    {currentUser.role === 'expert' ? 'Entomologist Reviewer' : 'Farmer / Operator'}
                  </span>
                </div>
              </div>

              <button
                onClick={toggleRole}
                className="w-full py-1.5 px-2 bg-[#103D2B] hover:bg-[#164A35] text-[10px] font-mono text-[#BBF7D0] rounded-lg border border-[#244637] transition-colors text-center"
              >
                Switch to {currentUser.role === 'farmer' ? 'Expert Mode' : 'Farmer Mode'}
              </button>

              <button
                onClick={onExitToLanding}
                className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-[#73877B] hover:text-white transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Exit to Landing Page</span>
              </button>
            </div>
          ) : (
            <button
              onClick={toggleRole}
              title={`Active as ${currentUser.role}. Click to switch.`}
              className="w-full h-8 flex items-center justify-center rounded-lg bg-[#103D2B] text-[#A3E635] text-xs font-bold"
            >
              {currentUser.role === 'expert' ? 'EX' : 'FA'}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-6 bg-[#0B251C]/90 backdrop-blur-md border-b border-[#244637] flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#103D2B] border border-[#244637] text-xs">
              <Sprout className="w-3.5 h-3.5 text-[#A3E635]" />
              <span className="font-semibold text-white">{activeFarm.farm_name}</span>
              <span className="text-[#73877B] text-[11px] hidden sm:inline">({activeFarm.location.split('(')[0]})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-[#A7B8AE] font-mono text-[11px] bg-[#103D2B] px-2.5 py-1 rounded-lg border border-[#244637]">
              <Calendar className="w-3 h-3 text-[#A3E635]" />
              <span>{todayStr}</span>
            </div>

            {/* Notification Indicator */}
            <button
              onClick={() => setCurrentTab('history')}
              className="relative p-2 rounded-xl text-[#A7B8AE] hover:text-white bg-[#103D2B] border border-[#244637] transition-colors"
              title="Pending Reviews & Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingReviewsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_6px_#FBBF24]" />
              )}
            </button>

            {/* Action */}
            <button
              onClick={() => setCurrentTab('scanner')}
              className="btn-neon px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
            >
              <Scan className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analyze Leaf</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Ergonomic thumb-zone) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B251C] border-t border-[#244637] grid grid-cols-5 p-1 text-[10px] font-bold text-[#A7B8AE]">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl ${
            currentTab === 'overview' ? 'text-[#A3E635] bg-[#103D2B]' : ''
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setCurrentTab('scanner')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl ${
            currentTab === 'scanner' ? 'text-[#A3E635] bg-[#103D2B]' : ''
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>Scan</span>
        </button>
        <button
          onClick={() => setCurrentTab('evidence')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl ${
            currentTab === 'evidence' ? 'text-[#A3E635] bg-[#103D2B]' : ''
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Evidence</span>
        </button>
        <button
          onClick={() => setCurrentTab('plants')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl ${
            currentTab === 'plants' ? 'text-[#A3E635] bg-[#103D2B]' : ''
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Plants</span>
        </button>
        <button
          onClick={() => setCurrentTab('history')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl ${
            currentTab === 'history' ? 'text-[#A3E635] bg-[#103D2B]' : ''
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </nav>
    </div>
  );
};
