import React from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  Repeat, 
  ShoppingBag, 
  MapPin, 
  Sparkles,
  Lock,
  X,
  Maximize,
  Minimize
} from 'lucide-react';
import { ClinicSettings, ActiveView } from '../types';

interface CosmicSidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  countsByView: {
    packages: number;
    singlePromos: number;
    subscriptions: number;
    skincare: number;
  };
  onOpenBranches: () => void;
  onLockApp?: () => void;
  settings: ClinicSettings;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const CosmicSidebar: React.FC<CosmicSidebarProps> = ({
  activeView,
  onSelectView,
  countsByView,
  onOpenBranches,
  onLockApp,
  settings,
  isOpenMobile = false,
  onCloseMobile,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const navItems = [
    {
      id: 'packages' as ActiveView,
      label: settings.navPackagesTitle || 'DASHBOARD',
      sublabel: settings.navPackagesSubtitle || 'Paket Treatment',
      icon: LayoutDashboard,
      count: countsByView.packages,
    },
    {
      id: 'single-promos' as ActiveView,
      label: settings.navSingleTitle || 'PROMO SINGLE',
      sublabel: settings.navSingleSubtitle || 'Ala Carte & Laser',
      icon: Tag,
      count: countsByView.singlePromos,
    },
    {
      id: 'subscriptions' as ActiveView,
      label: settings.navSubscriptionTitle || 'SUBSCRIPTION',
      sublabel: settings.navSubscriptionSubtitle || 'Langganan 3x / 6x / 12x',
      icon: Repeat,
      count: countsByView.subscriptions,
    },
    {
      id: 'skincare' as ActiveView,
      label: settings.navSkincareTitle || 'SKINCARE',
      sublabel: settings.navSkincareSubtitle || 'Homecare Kit Bundling',
      icon: ShoppingBag,
      count: countsByView.skincare,
    },
  ];

  const content = (
    <aside className="w-64 sm:w-72 flex flex-col p-4 sm:p-5 text-white select-none relative overflow-hidden bg-gradient-to-b from-[#2e0717] via-[#200410] to-[#150209] border border-rose-400/35 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
      {/* Ambient background glow inside sidebar */}
      <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-rose-600/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

      {/* Top Header / Brand Logo */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between pb-3.5 border-b border-rose-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#941e38] to-[#db3360] flex items-center justify-center shadow-[0_0_15px_rgba(219,51,96,0.5)] border border-rose-300/40">
              <Sparkles className="w-4 h-4 text-[#FDE047]" />
            </div>
            <div>
              <span className="text-xs font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-100 block font-serif">
                DASHBOARD
              </span>
              <span className="text-[10px] tracking-wider text-rose-300/80 font-semibold block uppercase">
                {settings.clinicName || 'SOZO Skin Clinic'}
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-rose-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Menu List */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-300 text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-900/80 via-[#450917]/90 to-rose-950/90 text-white shadow-[0_0_25px_rgba(229,57,101,0.25)] border border-rose-400/40'
                    : 'text-rose-200/75 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {/* Active Light Rim Flare on Top Edge */}
                {isActive && (
                  <div className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD285] to-transparent shadow-[0_0_8px_#FFD285]" />
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-[#E53965]/30 text-[#FFD285] shadow-[0_0_12px_rgba(255,210,133,0.35)]'
                        : 'bg-white/[0.04] text-rose-300 group-hover:text-white group-hover:bg-white/[0.08]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wider block font-serif">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-rose-300/60 group-hover:text-rose-200/80 block">
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                      isActive
                        ? 'bg-[#FFD285] text-stone-900 shadow-xs'
                        : 'bg-white/10 text-rose-300 group-hover:bg-white/15'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick External/Modal Navigation */}
          <div className="pt-2.5 mt-2.5 border-t border-rose-500/20">
            <button
              onClick={() => {
                onOpenBranches();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-200/80 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#FFD285]" />
              <span>50+ Cabang SOZO</span>
            </button>
          </div>

          {/* Full Screen Mode Toggle */}
          {onToggleFullscreen && (
            <div className="pt-2 mt-1 border-t border-rose-500/20">
              <button
                onClick={() => {
                  onToggleFullscreen();
                  if (onCloseMobile) onCloseMobile();
                }}
                title="Sembunyikan toolbar browser agar nyaman di-scroll"
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-between transition cursor-pointer border shadow-xs ${
                  isFullscreen
                    ? 'bg-rose-500/30 text-white border-rose-400/50 shadow-[0_0_12px_rgba(229,57,101,0.3)]'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-rose-200 hover:text-white border-rose-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-[#FFD285]" /> : <Maximize className="w-3.5 h-3.5 text-[#FFD285]" />}
                  <span>{isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh (Kiosk)'}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-rose-200">
                  {isFullscreen ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          )}

          {/* Bottom Controls / Lock Session - Dinaikin immediately below 50+ Cabang */}
          {settings.accessPassword && onLockApp && (
            <div className="pt-2 mt-1 border-t border-rose-500/20">
              <button
                onClick={onLockApp}
                className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-rose-200/90 hover:text-white flex items-center justify-center gap-2 transition cursor-pointer border border-rose-500/30 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#FFD285]" />
                <span>Kunci Sesi Menu</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar - Frozen / Sticky on scroll */}
      <div className="hidden lg:block sticky top-28 shrink-0 z-30 self-start">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full max-w-[280px] p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
