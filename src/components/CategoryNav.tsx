import React from 'react';
import { 
  Sparkles, 
  Tag, 
  Repeat, 
  Package, 
  Layers,
  Search,
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
}) => {
  const hasActiveFilter = Boolean(searchQuery || skinGoalFilter || (activeView === 'packages' && selectedCategoryId !== 'all') || sortBy !== 'default');
  const goalsToRender = availableSkinGoals && availableSkinGoals.length > 0 ? availableSkinGoals : DEFAULT_SKIN_GOALS;

  return (
    <div className="space-y-4 bg-[#1a030a]/95 border border-rose-500/25 p-4 sm:p-5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.55)] relative overflow-visible">
      
      {/* Luminous lens flare light effect */}
      <CardLightFlare topPosition="center" />

      {/* Top Bar: Section Title & Sort / Reset Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53965]/30 to-[#8C1D35]/50 border border-rose-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(229,57,101,0.25)]">
            {activeView === 'packages' && <Layers className="w-4 h-4 text-[#FFD285]" />}
            {activeView === 'single-promos' && <Tag className="w-4 h-4 text-[#FFD285]" />}
            {activeView === 'subscriptions' && <Repeat className="w-4 h-4 text-[#FFD285]" />}
            {activeView === 'skincare' && <Package className="w-4 h-4 text-[#FFD285]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide">
                {activeView === 'packages' && 'Katalog Paket Treatment'}
                {activeView === 'single-promos' && 'Katalog Promo Single Treatment'}
                {activeView === 'subscriptions' && 'Katalog Paket Langganan'}
                {activeView === 'skincare' && 'Katalog Skincare Kit Bundling'}
              </h2>
              {countsByView && (
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#FFD285] text-stone-950 shadow-xs">
                  {activeView === 'packages' && countsByView.packages}
                  {activeView === 'single-promos' && countsByView.singlePromos}
                  {activeView === 'subscriptions' && countsByView.subscriptions}
                  {activeView === 'skincare' && countsByView.skincare}
                </span>
              )}
            </div>
            <p className="text-[11px] text-rose-300/60 hidden sm:block">
              Filter dan urutkan treatment berdasarkan kebutuhan & prioritas
            </p>
          </div>
        </div>

        {/* Right Tools: Sort By & Reset Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort Selector Dropdown */}
          {onSortChange && (
            <div className="flex items-center gap-1.5 bg-black/40 border border-rose-500/30 px-3 py-1.5 rounded-2xl shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD285]" />
              <span className="text-[11px] font-bold text-rose-200 hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Urutkan Treatment"
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="default" className="bg-[#1f040b] text-white">★ Rekomendasi BAU</option>
                <option value="price-asc" className="bg-[#1f040b] text-white">🏷️ Harga: Terendah → Tertinggi</option>
                <option value="price-desc" className="bg-[#1f040b] text-white">💎 Harga: Tertinggi → Terendah</option>
                <option value="name-asc" className="bg-[#1f040b] text-white">🔤 Nama Treatment: A → Z</option>
                <option value="name-desc" className="bg-[#1f040b] text-white">🔤 Nama Treatment: Z → A</option>
                <option value="discount-desc" className="bg-[#1f040b] text-white">🔥 Diskon / Hemat Terbesar (%)</option>
              </select>
            </div>
          )}

          {/* Reset Filter Button if any filter is active */}
          {hasActiveFilter && onClearFilter && (
            <button
              type="button"
              onClick={onClearFilter}
              className="text-xs font-bold text-rose-200 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 px-3 py-1.5 rounded-xl border border-rose-500/40 transition cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <RotateCcw className="w-3 h-3 text-[#FFD285]" />
              <span className="hidden sm:inline">Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Skin Goals Pills (Universal: available across ALL views) with dark cosmic scrollbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 cosmic-scrollbar">
        <span className="text-xs font-bold text-rose-300/80 whitespace-nowrap mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FFD285]" />
          <span>Filter Goal:</span>
        </span>
        {goalsToRender.map((goal) => {
          const active = (goal === "Semua Goals" && !skinGoalFilter) || skinGoalFilter === goal;
          return (
            <button
              key={goal}
              onClick={() => onSelectSkinGoal(goal === "Semua Goals" ? "" : goal)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer ${
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

      {/* Categories Horizontal Scroll / Carousel when in 'packages' view with dark cosmic scrollbar */}
      {activeView === 'packages' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 cosmic-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
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
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
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
    </div>
  );
};
