import React from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  Repeat, 
  ShoppingBag, 
  MapPin, 
  Sparkles,
  Lock,
  X
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
}) => {
  const navItems = [
    {
      id: 'packages' as ActiveView,
      label: 'DASHBOARD',
      sublabel: 'Paket Treatment',
      icon: LayoutDashboard,
      count: countsByView.packages,
    },
    {
      id: 'single-promos' as ActiveView,
      label: 'PROMO SINGLE',
      sublabel: 'Ala Carte & Laser',
      icon: Tag,
      count: countsByView.singlePromos,
    },
    {
      id: 'subscriptions' as ActiveView,
      label: 'SUBSCRIPTION',
      sublabel: 'Langganan 3x / 6x / 12x',
      icon: Repeat,
      count: countsByView.subscriptions,
    },
    {
      id: 'skincare' as ActiveView,
      label: 'SKINCARE',
      sublabel: 'Homecare Kit Bundling',
      icon: ShoppingBag,
      count: countsByView.skincare,
    },
  ];

  const content = (
    <aside className="w-64 sm:w-72 h-full flex flex-col justify-between p-4 sm:p-5 text-white select-none relative overflow-hidden backdrop-blur-2xl bg-[#1b030b]/85 border-r border-rose-500/20 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      {/* Ambient background glow inside sidebar */}
      <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-52 h-52 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Header / Brand Logo */}
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#941e38] to-[#db3360] flex items-center justify-center shadow-[0_0_15px_rgba(219,51,96,0.5)] border border-rose-300/40">
              <Sparkles className="w-4 h-4 text-[#FDE047]" />
            </div>
            <div>
              <span className="text-xs font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-100 block font-serif">
                DASHBOARD
              </span>
              <span className="text-[10px] tracking-wider text-rose-300/70 font-semibold block uppercase">
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
          <div className="pt-3 mt-3 border-t border-rose-500/20 space-y-1.5">
            <button
              onClick={() => {
                onOpenBranches();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-200/75 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#FFD285]" />
              <span>50+ Cabang SOZO</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Controls */}
      {settings.accessPassword && onLockApp && (
        <div className="pt-3 border-t border-rose-500/20 relative z-10">
          <button
            onClick={onLockApp}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-rose-300/70 hover:text-rose-200 flex items-center justify-center gap-1.5 transition cursor-pointer border border-rose-500/20"
          >
            <Lock className="w-3.5 h-3.5 text-[#FFD285]" />
            <span>Kunci Sesi Menu</span>
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0 z-30">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
