import React from 'react';
import { 
  Sparkles, 
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { Category, SortOption } from '../types';
import { CardLightFlare } from './CardLightFlare';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  activeView: 'packages' | 'single-promos' | 'subscriptions' | 'skincare';
  onChangeView: (view: 'packages' | 'single-promos' | 'subscriptions' | 'skincare') => void;
  skinGoalFilter: string;
  onSelectSkinGoal: (goal: string) => void;
  treatmentCountsByCategory: Record<string, number>;
  countsByView?: {
    packages: number;
    singlePromos: number;
    subscriptions: number;
    skincare: number;
  };
  searchQuery?: string;
  onClearFilter?: () => void;
  availableSkinGoals?: string[];
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  stickyTopOffset?: number;
}

const DEFAULT_SKIN_GOALS = [
  "Semua Goals",
  "Glowing",
  "Pink Plumpy",
  "Pigmentation",
  "Anti-Aging",
  "Acne Free",
  "Scar Free",
  "Face Slimming",
  "Body Slimming",
  "Hair Grow",
  "Hair Removal"
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  activeView,
  onChangeView,
  skinGoalFilter,
  onSelectSkinGoal,
  treatmentCountsByCategory,
  countsByView,
  searchQuery,
  onClearFilter,
  availableSkinGoals = DEFAULT_SKIN_GOALS,
  sortBy = 'default',
  onSortChange,
  stickyTopOffset = 88,
}) => {
  const hasActiveFilter = Boolean(searchQuery || skinGoalFilter || (activeView === 'packages' && selectedCategoryId !== 'all') || sortBy !== 'default');
  const goalsToRender = availableSkinGoals && availableSkinGoals.length > 0 ? availableSkinGoals : DEFAULT_SKIN_GOALS;

  return (
    <div 
      style={{ top: `${stickyTopOffset}px` }}
      className="sticky z-30 space-y-2.5 bg-[#180209]/95 border border-rose-500/25 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-md relative overflow-visible transition-all"
    >
      {/* Luminous lens flare light effect */}
      <CardLightFlare topPosition="center" />

      {/* Row 1 (Top): Categories Horizontal Scroll / Carousel when in 'packages' view */}
      {activeView === 'packages' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 cosmic-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
              selectedCategoryId === 'all'
                ? 'bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 shadow-[0_0_15px_rgba(255,210,133,0.35)] border border-amber-200'
                : 'bg-white/[0.05] text-rose-200/80 hover:text-white hover:bg-white/[0.1] border border-rose-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD285]" />
            <span>Semua Kategori</span>
          </button>

          {categories.map((cat) => {
            const active = selectedCategoryId === cat.id;
            const count = treatmentCountsByCategory[cat.id] || 0;
            const isRecommendation = cat.id === 'treatment-recommendation';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                  active
                    ? 'bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 font-bold shadow-[0_0_18px_rgba(255,210,133,0.4)] border border-amber-200'
                    : isRecommendation
                    ? 'bg-rose-950/70 text-[#FFD285] border border-amber-500/40 hover:bg-rose-900/80 font-bold'
                    : 'bg-white/[0.05] text-rose-200/80 hover:text-white hover:bg-white/[0.1] border border-rose-500/20'
                }`}
              >
                {isRecommendation && (
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD285] fill-[#FFD285]" />
                )}
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    active 
                      ? 'bg-stone-950 text-[#FFD285]' 
                      : 'bg-[#FFD285]/20 text-[#FFD285] border border-[#FFD285]/30'
                  }`}>
                    {cat.badge}
                  </span>
                )}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-stone-950/25 text-stone-950 font-bold' : 'bg-black/40 text-rose-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Row 2 (Bottom): Sort selector, Reset Filter & Skin Goals Pills */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full ${activeView === 'packages' ? 'pt-2 border-t border-rose-500/20' : ''}`}>
        {/* Sort & Reset Actions - Pinned */}
        <div className="flex items-center gap-2 shrink-0">
          {onSortChange && (
            <div className="flex items-center gap-1.5 bg-black/60 border border-rose-500/35 px-2.5 py-1.5 rounded-xl shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD285]" />
              <span className="text-[11px] font-bold text-rose-200 hidden md:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Urutkan Treatment"
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="default" className="bg-[#1f040b] text-white">★ Rekomendasi BAU</option>
                <option value="price-asc" className="bg-[#1f040b] text-white">🏷️ Harga: Terendah → Tertinggi</option>
                <option value="price-desc" className="bg-[#1f040b] text-white">💎 Harga: Tertinggi → Terendah</option>
                <option value="name-asc" className="bg-[#1f040b] text-white">🔤 Nama: A → Z</option>
                <option value="name-desc" className="bg-[#1f040b] text-white">🔤 Nama: Z → A</option>
                <option value="discount-desc" className="bg-[#1f040b] text-white">🔥 Diskon / Hemat Terbesar (%)</option>
              </select>
            </div>
          )}

          {hasActiveFilter && onClearFilter && (
            <button
              type="button"
              onClick={onClearFilter}
              title="Reset semua filter aktif"
              className="text-xs font-bold text-rose-200 hover:text-white bg-rose-950/70 hover:bg-rose-900/90 px-2.5 py-1.5 rounded-xl border border-rose-500/40 transition cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
            >
              <RotateCcw className="w-3 h-3 text-[#FFD285]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <div className="hidden sm:block h-5 w-[1px] bg-rose-500/30 shrink-0 mx-0.5" />
        </div>

        {/* Skin Goals Pills (Universal: available across ALL views) with dark cosmic scrollbar */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 cosmic-scrollbar">
          <span className="text-xs font-bold text-rose-300/80 whitespace-nowrap mr-0.5 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-[#FFD285]" />
            <span className="hidden sm:inline">Filter Goal:</span>
            <span className="sm:hidden">Goal:</span>
          </span>
          {goalsToRender.map((goal) => {
            const active = (goal === "Semua Goals" && !skinGoalFilter) || skinGoalFilter === goal;
            return (
              <button
                key={goal}
                onClick={() => onSelectSkinGoal(goal === "Semua Goals" ? "" : goal)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer shrink-0 ${
                  active
                    ? 'bg-gradient-to-r from-rose-800 to-rose-950 text-white shadow-[0_0_15px_rgba(229,57,101,0.35)] font-bold border border-[#FFD285]/60 ring-1 ring-[#FFD285]/30'
                    : 'bg-white/[0.05] text-rose-200/80 hover:text-white hover:bg-white/[0.1] border border-rose-500/20'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
