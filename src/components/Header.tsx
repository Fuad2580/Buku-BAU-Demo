import React from 'react';
import { 
  Sparkles, 
  Code2, 
  ShoppingCart, 
  MapPin, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Lock,
  FileSpreadsheet,
  Download,
  Menu,
  Maximize,
  Minimize
} from 'lucide-react';
import { ClinicSettings, CartItem } from '../types';

// Subtle 4-point luxury sparkle star
const SparkleStar: React.FC<{ className?: string }> = ({ className = 'w-3 h-3 text-[#FDE047]' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 0C12.4 6.2 17.8 11.6 24 12C17.8 12.4 12.4 17.8 12 24C11.6 17.8 6.2 12.4 0 12C6.2 11.6 11.6 6.2 12 0Z"
      fill="currentColor"
    />
  </svg>
);

interface HeaderProps {
  settings: ClinicSettings;
  cartItems: CartItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenSpreadsheetEditor: () => void;
  onOpenAppsScriptGuide: () => void;
  onOpenBranches: () => void;
  onRefreshData: () => void;
  onDownloadExcel?: () => void;
  isSyncing: boolean;
  onLockApp?: () => void;
  onOpenMobileMenu?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartItems,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenSpreadsheetEditor,
  onOpenAppsScriptGuide,
  onOpenBranches,
  onRefreshData,
  onDownloadExcel,
  isSyncing,
  onLockApp,
  onOpenMobileMenu,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header id="app-main-header" className="sticky top-0 z-50 bg-gradient-to-r from-[#2a040e]/95 via-[#4a0e1c]/95 to-[#24030b]/95 text-white shadow-xl border-b border-rose-500/20 backdrop-blur-xl relative">
      {/* Background Micro Sparkle Accent */}
      <div className="absolute top-2 right-1/3 pointer-events-none animate-twinkle opacity-40 hidden md:block">
        <SparkleStar className="w-3.5 h-3.5 text-[#FCE3B4]" />
      </div>
      <div className="absolute bottom-2 left-1/4 pointer-events-none animate-twinkle-delay-2 opacity-30 hidden md:block">
        <SparkleStar className="w-3 h-3 text-[#FDE047]" />
      </div>

      {/* Top Utility Bar */}
      <div className="bg-black/40 py-1.5 px-4 text-[11px] text-rose-200 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Database Terhubung ke Spreadsheet</span>
            <span className="text-white/40">•</span>
            <span className="text-stone-300">Update Terakhir: {settings.lastSyncedAt || 'Hari ini'}</span>
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <button 
              onClick={onOpenBranches}
              className="hover:text-white flex items-center gap-1 transition cursor-pointer text-rose-200"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E8BF87]" />
              <span>50+ Cabang</span>
            </button>
            {onToggleFullscreen && (
              <button 
                onClick={onToggleFullscreen}
                className="hover:text-white flex items-center gap-1 transition cursor-pointer text-rose-200 border-l border-white/10 pl-3"
                title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh (Toolbar Hilang)"}
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-[#E8BF87]" /> : <Maximize className="w-3.5 h-3.5 text-[#E8BF87]" />}
                <span>{isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4 relative z-10">
        {/* Mobile Hamburger & Logo & Title */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white border border-rose-500/30 transition cursor-pointer"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5 text-[#FFD285]" />
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C2941] via-[#5C1626] to-[#380A15] border border-[#E6C994]/50 flex items-center justify-center shadow-[0_0_12px_rgba(201,168,106,0.3)] relative shrink-0">
            <span className="font-serif font-bold text-xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3D6] to-[#E6C994] tracking-wider">S</span>
            <div className="absolute -top-1 -right-1 animate-twinkle-fast pointer-events-none">
              <SparkleStar className="w-2.5 h-2.5 text-[#FDE047]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-none">
                SOZO SKIN CLINIC
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F6D29A] to-[#C9A86A] text-stone-900 shadow-xs flex items-center gap-1 hidden sm:inline-flex">
                <Sparkles className="w-2.5 h-2.5" />
                BAU BOOK
              </span>
            </div>
            <p className="text-[11px] text-rose-200/80 font-light mt-0.5 hidden sm:block">
              Buku BAU, Rekomendasi Treatment & Promo Interaktif
            </p>
          </div>
        </div>

        {/* Cosmic Glass Search Input matching reference */}
        <div className="relative flex-1 max-w-md min-w-[240px] group">
          {/* Top luminous rim light flare */}
          <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFAEC2] to-transparent shadow-[0_0_12px_#FFAEC2] pointer-events-none z-10 opacity-80 group-focus-within:opacity-100 group-focus-within:via-white transition-opacity" />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search treatment, laser, peeling, promo..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-[#19030A]/75 hover:bg-[#20040D]/85 focus:bg-[#22040E]/95 text-white placeholder-rose-200/50 text-xs sm:text-sm border border-rose-300/30 focus:border-[#FFAEC2] focus:ring-2 focus:ring-[#FFAEC2]/20 focus:outline-none transition backdrop-blur-xl shadow-inner"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-xs text-rose-300 hover:text-white pointer-events-auto p-0.5"
              >
                ✕
              </button>
            )}
            <Search className="w-4 h-4 text-[#FCE3B4]/80 group-focus-within:text-[#FCE3B4]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh (Hilangkan Toolbar Chrome)"}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition border cursor-pointer ${
                isFullscreen
                  ? 'bg-rose-500/30 hover:bg-rose-500/40 text-white border-rose-400/60 shadow-[0_0_12px_rgba(229,57,101,0.35)]'
                  : 'bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white border-white/10'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-[#FFD285]" />
                  <span className="hidden sm:inline">Normal</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-[#FFD285]" />
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>
          )}

          {/* Sync Button */}
          <button
            onClick={onRefreshData}
            disabled={isSyncing}
            title="Sinkronisasi data terbaru dari Google Spreadsheet"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-200 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          {/* Lock Screen Button (If password protected) */}
          {settings.accessPassword && onLockApp && (
            <button
              onClick={onLockApp}
              title="Kunci Akses Buku Menu"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium flex items-center gap-1 transition border border-white/10 cursor-pointer text-rose-200 hover:text-white"
            >
              <Lock className="w-3.5 h-3.5 text-[#E8BF87]" />
              <span className="hidden lg:inline text-[11px]">Kunci</span>
            </button>
          )}

          {/* Estimator / Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-xl bg-[#C9A86A] hover:bg-[#bd9a5a] text-stone-900 text-xs font-bold flex items-center gap-2 shadow transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-stone-900" />
            <span className="hidden md:inline">Kalkulator Estimasi</span>
            <span className="md:hidden">Estimasi</span>
            {totalCartCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-[#6B1D2F] rounded-full shadow">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
