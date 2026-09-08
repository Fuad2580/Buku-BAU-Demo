import React from 'react';
import { 
  Sparkles, 
  Tag, 
  Repeat, 
  Package, 
  Layers
} from 'lucide-react';
import { Category } from '../types';
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
}

const SKIN_GOALS = [
  "Semua Goals",
  "Glowing",
  "Pink Plumpy",
  "Pigmentation",
  "Anti-Aging",
  "Acne Free",
  "Scar Free",
  "Face Slimming",
  "Body Slimming",
  "Hair"
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
}) => {
  return (
    <div className="space-y-4 bg-white border border-stone-200/90 p-4 rounded-3xl shadow-sm relative overflow-visible">
      
      {/* Luminous lens flare light effect matching user reference photo */}
      <CardLightFlare topPosition="left-center" />

      {/* View Switcher Tabs (Paket, Single Promo, Subscription, Skincare) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 border border-stone-200/70 rounded-2xl">
          <button
            onClick={() => onChangeView('packages')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeView === 'packages'
                ? 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white shadow-md border-t border-[#FFAEC2]/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Paket Treatment Kategori</span>
          </button>

          <button
            onClick={() => onChangeView('single-promos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeView === 'single-promos'
                ? 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white shadow-md border-t border-[#FFAEC2]/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Promo Single Treatment</span>
          </button>

          <button
            onClick={() => onChangeView('subscriptions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeView === 'subscriptions'
                ? 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white shadow-md border-t border-[#FFAEC2]/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Langganan (3x / 6x / 12x)</span>
          </button>

          <button
            onClick={() => onChangeView('skincare')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeView === 'skincare'
                ? 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white shadow-md border-t border-[#FFAEC2]/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Paket Skincare Kit</span>
          </button>
        </div>

        {/* Skin Goals Pills (when in packages view) */}
        {activeView === 'packages' && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            <span className="text-xs font-bold text-stone-500 whitespace-nowrap mr-1">Goal:</span>
            {SKIN_GOALS.map((goal) => {
              const active = (goal === "Semua Goals" && !skinGoalFilter) || skinGoalFilter === goal;
              return (
                <button
                  key={goal}
                  onClick={() => onSelectSkinGoal(goal === "Semua Goals" ? "" : goal)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white shadow-sm font-bold border-t border-[#FFAEC2]/50'
                      : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 border border-stone-200/80'
                  }`}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories Horizontal Scroll / Carousel when in 'packages' view */}
      {activeView === 'packages' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-gradient-to-r from-[#8C1D35] via-[#A82544] to-[#6E1225] text-white shadow-md border-t border-[#FFAEC2]/60'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
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
                    ? isRecommendation
                      ? 'bg-gradient-to-r from-[#8C1D35] to-[#A82544] text-white shadow-md font-bold ring-2 ring-[#C9A86A] border-t border-[#FFAEC2]'
                      : 'bg-gradient-to-r from-[#8C1D35] via-[#A82544] to-[#6E1225] text-white shadow-md font-bold border-t border-[#FFAEC2]/60'
                    : isRecommendation
                    ? 'bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-100/80 font-bold shadow-2xs'
                    : 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {isRecommendation && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                )}
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    active 
                      ? 'bg-gradient-to-r from-[#FCE3B4] to-[#C9A86A] text-stone-950' 
                      : isRecommendation
                      ? 'bg-[#C9A86A] text-stone-950 font-extrabold'
                      : 'bg-rose-100 text-[#8C1D35] border border-rose-200'
                  }`}>
                    {cat.badge}
                  </span>
                )}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-white/20 text-white' : isRecommendation ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-stone-200 text-stone-600'
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
