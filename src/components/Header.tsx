import React from 'react';
import { 
  Sparkles, 
  FileSpreadsheet, 
  Code2, 
  ShoppingCart, 
  MapPin, 
  RefreshCw,
  Search,
  ExternalLink,
  Lock
} from 'lucide-react';
import { ClinicSettings, CartItem } from '../types';

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
  isSyncing: boolean;
  onLockApp?: () => void;
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
  isSyncing,
  onLockApp,
}) => {
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#6B1D2F] text-white shadow-md border-b border-[#541523]">
      {/* Top Utility Bar */}
      <div className="bg-[#4D1320] py-1.5 px-4 text-[11px] text-rose-200 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Database Terhubung ke Spreadsheet</span>
            <span className="text-white/40">•</span>
            <span className="text-stone-300">Update Terakhir: {settings.lastSyncedAt || 'Hari ini'}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={onOpenBranches}
              className="hover:text-white flex items-center gap-1 transition cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[#E8BF87]" />
              <span>50+ Cabang Outlet</span>
            </button>
            <span className="text-white/30">|</span>
            <button 
              onClick={onOpenAppsScriptGuide}
              className="text-[#E8BF87] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3 h-3" />
              <span>Apps Script (Code.gs) Deploy Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C2941] to-[#501321] border border-[#C9A86A]/40 flex items-center justify-center shadow-inner">
            <span className="font-serif font-bold text-xl text-[#F9E2BE] tracking-wider">S</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">
                SOZO SKIN CLINIC
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#C9A86A] text-stone-900">
                BAU BOOK
              </span>
            </div>
            <p className="text-xs text-rose-200/90 font-light mt-0.5">
              Buku BAU, Rekomendasi Treatment & Promo Interaktif
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md min-w-[240px]">
          <Search className="w-4 h-4 text-rose-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari treatment, laser, peeling, promo..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-stone-900 placeholder-rose-200/60 focus:placeholder-stone-400 text-xs sm:text-sm border border-white/15 focus:border-[#C9A86A] focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-rose-200 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sync Button */}
          <button
            onClick={onRefreshData}
            disabled={isSyncing}
            title="Sinkronisasi data terbaru dari spreadsheet"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-200 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Edit Spreadsheet Button */}
          <button
            onClick={onOpenSpreadsheetEditor}
            className="px-3 py-2 rounded-xl bg-[#85233A] hover:bg-[#992943] text-xs font-semibold text-white flex items-center gap-1.5 border border-white/15 shadow-sm transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#E8BF87]" />
            <span className="hidden sm:inline">Edit Spreadsheet</span>
            <span className="sm:hidden">Edit</span>
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
