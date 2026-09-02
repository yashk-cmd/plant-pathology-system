import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { LogOut, ShieldCheck, History, Info, ScanLine } from 'lucide-react';

interface NavbarProps {
  activeTab: 'upload' | 'about' | 'history' | 'login' | 'signup';
  setActiveTab: (tab: 'upload' | 'about' | 'history' | 'login' | 'signup') => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  historyCount
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#15231C]/95 backdrop-blur-md border-b border-[#283E32] text-[#F3F6F2] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Wordmark */}
          <div id="nav-brand-logo">
            <BrandLogo
              size="md"
              showBadge={true}
              onClick={() => setActiveTab(isAuthenticated ? 'upload' : 'about')}
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-link-detect"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-[#2B4738] text-[#EDF5EE] border border-[#446E56] shadow-sm'
                  : 'text-[#B0C3B6] hover:text-white hover:bg-[#1F3329]'
              }`}
            >
              <ScanLine className="w-4 h-4 text-[#8CBFA0]" />
              <span>Detect Disease</span>
            </button>

            {isAuthenticated && (
              <button
                id="nav-link-history"
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'history'
                    ? 'bg-[#2B4738] text-[#EDF5EE] border border-[#446E56] shadow-sm'
                    : 'text-[#B0C3B6] hover:text-white hover:bg-[#1F3329]'
                }`}
              >
                <History className="w-4 h-4 text-[#8CBFA0]" />
                <span>Records</span>
                {historyCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#5B8F72] text-[#0F1B14] font-bold">
                    {historyCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="nav-link-about"
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'about'
                  ? 'bg-[#2B4738] text-[#EDF5EE] border border-[#446E56] shadow-sm'
                  : 'text-[#B0C3B6] hover:text-white hover:bg-[#1F3329]'
              }`}
            >
              <Info className="w-4 h-4 text-[#8CBFA0]" />
              <span>About Model</span>
            </button>
          </nav>

          {/* User Profile / Auth State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-[#273E32]">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-[#E5EFE7] truncate max-w-[140px]">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-[#8CBFA0] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Authenticated
                  </span>
                </div>

                <div
                  title={user.email}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#253E31] border border-[#48735C] text-[#CBE3D3] flex items-center justify-center font-bold text-xs shadow-inner"
                >
                  {(user.name || user.email)[0].toUpperCase()}
                </div>

                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  title="Log out of system"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#A5B8AC] hover:text-[#F3B0B0] hover:bg-[#3B1F20]/40 border border-transparent hover:border-[#692F31]/50 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => setActiveTab('login')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'login'
                      ? 'bg-[#253B2F] text-white border border-[#3A5C4A]'
                      : 'text-[#B0C3B6] hover:text-white hover:bg-[#1F3329]'
                  }`}
                >
                  Login
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => setActiveTab('signup')}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#3D6B51] hover:bg-[#315741] text-[#F3F8F4] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#528C6B]"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

