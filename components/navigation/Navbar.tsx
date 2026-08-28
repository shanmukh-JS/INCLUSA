'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Layers,
  PlusCircle,
  Globe,
  UserCheck,
  History,
  Menu,
  X,
  Compass,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { documentStore } from '@/lib/storage/document-store';
import { AccessibilityProfile } from '@/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeProfile, setActiveProfile] = useState<AccessibilityProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveProfile(documentStore.getActiveProfile(user?.id));
  }, [pathname, user?.id]);

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/dashboard', label: 'Workspace', icon: Layers },
    { href: '/analyze', label: 'Analyze', icon: PlusCircle },
    { href: '/website', label: 'Website Audit', icon: Globe },
    { href: '/profile', label: 'My Profile', icon: UserCheck },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[var(--border-strong)] shadow-[0_6px_0_0_#192138] transition-all">
        {/* Brand / Logo with Incli Mascot */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-xl"
            aria-label="INCLUSA Home"
          >
            <div className="relative transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200">
              <InclusaMascot pose="waving" size={38} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                  INCLUSA
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 text-[10px] font-black">
                  <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                  AI WORLD
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[var(--accent-amber-bg)] text-[var(--text-primary)] border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Active Profile */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/profile"
                title={`Logged in as ${user.fullName} (${user.email})`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black truncate max-w-[130px]">
                  {user.fullName || user.email.split('@')[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-xl border border-[var(--border-color)] hover:bg-rose-50 text-[var(--text-muted)] hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-xs font-black text-[var(--text-primary)] hover:bg-amber-50 shadow-[2px_2px_0_0_#192138] transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          <Link
            href="/analyze"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#192138] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_#192138] transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5 text-white" />
            <span>Analyze Content</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138]"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-white border-2 border-[var(--border-strong)] shadow-[0_8px_0_0_#192138] space-y-1.5 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                  isActive
                    ? 'bg-[var(--accent-amber-bg)] text-[var(--text-primary)] border-2 border-[var(--border-strong)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
