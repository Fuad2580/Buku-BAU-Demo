import React, { useState, useMemo } from 'react';
import { Tag, MapPin, Sparkles, Image as ImageIcon, Plus, Check, Calculator, Search, RotateCcw } from 'lucide-react';
import { SinglePromoItem, ClinicSettings, CartItem, TreatmentItem } from '../types';
import { CardLightFlare } from './CardLightFlare';
import { PhotoLightboxModal, PhotoLightboxData } from './PhotoLightboxModal';

interface SinglePromosSectionProps {
  singlePromos: SinglePromoItem[];
  isMemberPrice: boolean;
  settings: ClinicSettings;
  searchQuery?: string;
  skinGoalFilter?: string;
  cartItems?: CartItem[];
  onToggleCart?: (item: TreatmentItem) => void;
  onClearFilter?: () => void;
}

export const SinglePromosSection: React.FC<SinglePromosSectionProps> = ({
  singlePromos,
  isMemberPrice,
  searchQuery = '',
  skinGoalFilter = '',
  cartItems = [],
  onToggleCart,
  onClearFilter,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Semua');
  const [hoveredPhoto, setHoveredPhoto] = useState<{ id: string; url: string; name: string; rowIndex: number } | null>(null);
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  const groups = ['Semua', 'Glow & Rejuve', 'Slimming & Contouring', 'Acne & Scar', 'Anti-Aging', 'Hair Grow'];

  // Helper to map single promo item to TreatmentItem for cart calculation
  const mapToTreatmentItem = (item: SinglePromoItem): TreatmentItem => ({
    id: `single-${item.id}`,
    categoryId: 'single-promos',
    name: item.name,
    subTitle: item.group,
    inclusions: [`1x ${item.name} (${item.group})`],
    originalPrice: item.originalPrice,
    nonMemberPrice: item.nonMemberPrice,
    memberPrice: item.memberPrice,
    badge: 'Single Promo',
    outletNotes: item.outletRestricted,
    photoUrl: item.photoUrl,
    itemType: 'single',
  });

  // Filtered single promos based on selected group, search query, and skin goal
  const filteredPromos = useMemo(() => {
    return singlePromos.filter((item) => {
      // 1. Group filter
      const matchGroup = selectedGroup === 'Semua' || item.group === selectedGroup;

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.outletRestricted && item.outletRestricted.toLowerCase().includes(q));

      // 3. Skin goal filter
      let matchGoal = true;
      if (skinGoalFilter) {
        const goal = skinGoalFilter.toLowerCase();
        if (goal.includes('glow') || goal.includes('pink') || goal.includes('pigment')) {
          matchGoal = item.group === 'Glow & Rejuve';
        } else if (goal.includes('slimm')) {
          matchGoal = item.group === 'Slimming & Contouring';
        } else if (goal.includes('acne') || goal.includes('scar')) {
          matchGoal = item.group === 'Acne & Scar';
        } else if (goal.includes('aging')) {
          matchGoal = item.group === 'Anti-Aging';
        } else if (goal.includes('hair')) {
          matchGoal = item.group === 'Hair Grow';
        } else {
          matchGoal = item.name.toLowerCase().includes(goal) || item.group.toLowerCase().includes(goal);
        }
      }

      return matchGroup && matchSearch && matchGoal;
    });
  }, [singlePromos, selectedGroup, searchQuery, skinGoalFilter]);

  const handleOpenPhoto = (item: SinglePromoItem) => {
    if (!item.photoUrl) return;
    setActiveLightboxData({
      url: item.photoUrl,
      name: item.name,
      categoryOrGroup: item.group,
      originalPrice: item.originalPrice,
      nonMemberPrice: item.nonMemberPrice,
      memberPrice: item.memberPrice,
      outletRestricted: item.outletRestricted,
      treatmentItemForCart: mapToTreatmentItem(item),
    });
  };

  const isItemInCart = (itemId: string) => {
    return cartItems.some((ci) => ci.treatment.id === `single-${itemId}` || ci.treatment.id === itemId);
  };

  return (
    <div className="space-y-6 text-stone-800">
      
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-visible">
        <CardLightFlare topPosition="center" />
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#E6C994] to-[#C9A86A] text-stone-950 shadow-sm">
              Buku BAU Hal. 9 - 10
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Harga Satuan Promo
            </span>
            {searchQuery && (
              <span className="text-xs font-semibold text-[#8C1D35] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Search className="w-3 h-3" />
                Pencarian: "{searchQuery}"
              </span>
            )}
            {skinGoalFilter && (
              <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Goal: {skinGoalFilter}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Promo Single Treatment
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Pilihan perawatan satuan dengan harga spesial. Hemat lebih banyak untuk member terdaftar.
          </p>
        </div>

        {/* Group Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 border border-stone-200 rounded-2xl">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white shadow-sm border-t border-[#FFAEC2]/40'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Special Highlights: Botox 5% & Filler Threadlift 10% */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-[#8C1D35] uppercase tracking-wide">Voucher Diskon</span>
            <h4 className="text-base font-bold font-serif text-stone-900">Botox Premium (min. 50 unit)</h4>
            <p className="text-xs text-stone-600">Diskon 5% • Maksimal Potongan 150 RB</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white text-sm font-extrabold shadow-sm border-t border-[#FFAEC2]/40">
            Diskon 5%
          </span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">Voucher Diskon</span>
            <h4 className="text-base font-bold font-serif text-stone-900">Filler & Threadlift Benang</h4>
            <p className="text-xs text-stone-600">Diskon 10% • Maksimal Potongan 400 RB</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C9A86A] to-[#B08F52] text-stone-950 text-sm font-extrabold shadow-sm">
            Diskon 10%
          </span>
        </div>
      </div>

      {/* Table of Single Promos */}
      {filteredPromos.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">
            Tidak ditemukan treatment satuan yang cocok dengan filter
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? `Tidak ada hasil untuk pencarian "${searchQuery}".` : 'Coba ubah kategori grup atau reset filter.'}
          </p>
          {onClearFilter && (
            <button
              onClick={() => {
                setSelectedGroup('Semua');
                onClearFilter();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#8C1D35] text-white text-xs font-bold hover:bg-[#73172B] transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter Pencarian</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-visible relative">
          <CardLightFlare topPosition="center" />
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-700 text-xs font-bold font-serif uppercase tracking-wider border-b border-stone-200">
                  <th className="p-3.5 pl-5">Treatment</th>
                  <th className="p-3.5">Kategori Grup</th>
                  <th className="p-3.5">Harga Normal</th>
                  <th className="p-3.5">Non-Member</th>
                  <th className="p-3.5">Harga Member</th>
                  <th className="p-3.5">Khusus Outlet</th>
                  <th className="p-3.5 pr-5 text-right">Aksi & Estimasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filteredPromos.map((item, index) => {
                  const discount = item.originalPrice > item.memberPrice 
                    ? Math.round((1 - (item.memberPrice / item.originalPrice)) * 100)
                    : 0;
                  const inCart = isItemInCart(item.id);
                  const treatmentForCart = mapToTreatmentItem(item);

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3.5 pl-5 font-bold text-stone-900 relative">
                        <div 
                          className="inline-block cursor-pointer relative group/item"
                          onClick={() => handleOpenPhoto(item)}
                          onMouseEnter={() => {
                            if (item.photoUrl) {
                              setHoveredPhoto({ id: item.id, url: item.photoUrl, name: item.name, rowIndex: index });
                            }
                          }}
                          onMouseLeave={() => setHoveredPhoto(null)}
                        >
                          <span className="group-hover/item:text-[#8C1D35] transition flex items-center gap-1.5 font-bold">
                            {item.name}
                            {item.photoUrl && (
                              <span className="p-1 rounded-md bg-rose-50 group-hover/item:bg-rose-100 text-[#8C1D35] transition">
                                <ImageIcon className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </span>

                          {/* Hover preview tooltip: for top rows (index < 3), opens downwards so it NEVER gets cut off! */}
                          {hoveredPhoto?.id === item.id && (
                            <div 
                              className={`absolute left-0 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 animate-in fade-in zoom-in-95 pointer-events-none ${
                                index < 3 ? 'top-full mt-2' : '-top-2 transform -translate-y-full'
                              }`}
                            >
                              <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-1.5 border border-stone-200">
                                <img 
                                  src={hoveredPhoto.url} 
                                  alt={hoveredPhoto.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <p className="text-xs font-bold text-stone-900 font-serif truncate">{hoveredPhoto.name}</p>
                              <span className="text-[10px] text-stone-500 block">Klik untuk foto besar & tambah ke estimasi</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                          {item.group}
                        </span>
                      </td>

                      <td className="p-3.5 text-stone-400 line-through">
                        {item.originalPrice} RB
                      </td>

                      <td className={`p-3.5 font-semibold ${!isMemberPrice ? 'text-[#8C1D35] font-bold text-sm' : 'text-stone-600'}`}>
                        {item.nonMemberPrice} RB
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${isMemberPrice ? 'text-sm text-[#8C1D35]' : 'text-stone-900'}`}>
                            {item.memberPrice} RB
                          </span>
                          {discount > 0 && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-stone-500 italic text-[11px]">
                        {item.outletRestricted ? (
                          <span className="flex items-center gap-1 text-amber-700 font-medium">
                            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                            {item.outletRestricted}
                          </span>
                        ) : (
                          'Semua Outlet'
                        )}
                      </td>

                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* Photo Button */}
                          {item.photoUrl && (
                            <button
                              type="button"
                              onClick={() => handleOpenPhoto(item)}
                              className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-[#8C1D35] text-[11px] font-semibold transition border border-stone-200 flex items-center gap-1 cursor-pointer"
                              title="Lihat Foto Treatment"
                            >
                              <ImageIcon className="w-3 h-3 text-[#8C1D35]" />
                              <span>Foto</span>
                            </button>
                          )}

                          {/* + Estimasi Button */}
                          {onToggleCart && (
                            <button
                              type="button"
                              onClick={() => onToggleCart(treatmentForCart)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                inCart
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-[#8C1D35] hover:bg-[#73172B] text-white border-t border-[#FFAEC2]/30'
                              }`}
                            >
                              {inCart ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Ditambahkan</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Estimasi</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full-screen Photo Lightbox Modal */}
      <PhotoLightboxModal
        data={activeLightboxData}
        onClose={() => setActiveLightboxData(null)}
        isInCart={activeLightboxData ? isItemInCart(activeLightboxData.treatmentItemForCart?.id.replace('single-', '') || '') : false}
        onToggleCart={onToggleCart}
        isMemberPrice={isMemberPrice}
      />

    </div>
  );
};
