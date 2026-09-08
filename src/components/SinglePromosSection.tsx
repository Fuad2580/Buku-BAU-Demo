import React, { useState } from 'react';
import { Tag, MapPin, Sparkles, Percent, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { SinglePromoItem, ClinicSettings } from '../types';

interface SinglePromosSectionProps {
  singlePromos: SinglePromoItem[];
  isMemberPrice: boolean;
  settings: ClinicSettings;
}

export const SinglePromosSection: React.FC<SinglePromosSectionProps> = ({
  singlePromos,
  isMemberPrice,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Semua');
  const [hoveredPhoto, setHoveredPhoto] = useState<{ id: string; url: string; name: string } | null>(null);

  const groups = ['Semua', 'Glow & Rejuve', 'Slimming & Contouring', 'Acne & Scar', 'Anti-Aging', 'Hair Grow'];

  const filteredPromos = selectedGroup === 'Semua' 
    ? singlePromos 
    : singlePromos.filter(item => item.group === selectedGroup);

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#F7EADB] text-[#6B1D2F]">
              Buku BAU Hal. 9 - 10
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Harga Satuan Promo
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Promo Single Treatment
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Pilihan perawatan satuan dengan harga spesial. Hemat lebih banyak untuk member terdaftar.
          </p>
        </div>

        {/* Group Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-xl">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-[#6B1D2F] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Special Highlights: Botox 5% & Filler Threadlift 10% */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-2xl border border-rose-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wide">Voucher Diskon</span>
            <h4 className="text-base font-bold font-serif text-stone-900">Botox Premium (min. 50 unit)</h4>
            <p className="text-xs text-stone-600">Diskon 5% • Maksimal Potongan 150 RB</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-[#6B1D2F] text-white text-sm font-extrabold shadow-xs">
            Diskon 5%
          </span>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Voucher Diskon</span>
            <h4 className="text-base font-bold font-serif text-stone-900">Filler & Threadlift Benang</h4>
            <p className="text-xs text-stone-600">Diskon 10% • Maksimal Potongan 400 RB</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-[#C9A86A] text-stone-900 text-sm font-extrabold shadow-xs">
            Diskon 10%
          </span>
        </div>
      </div>

      {/* Table of Single Promos */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6B1D2F] text-white text-xs font-bold font-serif uppercase tracking-wider">
                <th className="p-3.5 pl-5">Treatment</th>
                <th className="p-3.5">Kategori Grup</th>
                <th className="p-3.5">Harga Normal</th>
                <th className="p-3.5">Non-Member</th>
                <th className="p-3.5">Harga Member</th>
                <th className="p-3.5">Khusus Outlet</th>
                <th className="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredPromos.map((item) => {
                const discount = item.originalPrice > item.memberPrice 
                  ? Math.round((1 - (item.memberPrice / item.originalPrice)) * 100)
                  : 0;

                return (
                  <tr key={item.id} className="hover:bg-rose-50/40 transition">
                    <td className="p-3.5 pl-5 font-bold text-stone-900 relative">
                      <div 
                        className="inline-block cursor-pointer relative group/item"
                        onMouseEnter={() => {
                          if (item.photoUrl) setHoveredPhoto({ id: item.id, url: item.photoUrl, name: item.name });
                        }}
                        onMouseLeave={() => setHoveredPhoto(null)}
                      >
                        <span className="group-hover/item:text-[#6B1D2F] transition flex items-center gap-1.5">
                          {item.name}
                          {item.photoUrl && (
                            <ImageIcon className="w-3.5 h-3.5 text-[#C9A86A] inline-block" />
                          )}
                        </span>

                        {hoveredPhoto?.id === item.id && (
                          <div className="absolute left-0 -top-2 transform -translate-y-full z-50 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 animate-in fade-in zoom-in-95 pointer-events-auto">
                            <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-1.5 border border-stone-100">
                              <img 
                                src={hoveredPhoto.url} 
                                alt={hoveredPhoto.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <p className="text-xs font-bold text-stone-800 font-serif truncate">{hoveredPhoto.name}</p>
                            <span className="text-[10px] text-stone-500">Preview Foto Treatment</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-medium">
                        {item.group}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-400 line-through">
                      {item.originalPrice} RB
                    </td>
                    <td className={`p-3.5 font-semibold ${!isMemberPrice ? 'text-[#6B1D2F] font-bold text-sm' : 'text-stone-600'}`}>
                      {item.nonMemberPrice} RB
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isMemberPrice ? 'text-sm text-[#6B1D2F]' : 'text-stone-800'}`}>
                          {item.memberPrice} RB
                        </span>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-stone-500 italic text-[11px]">
                      {item.outletRestricted ? (
                        <span className="flex items-center gap-1 text-amber-800 font-medium">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          {item.outletRestricted}
                        </span>
                      ) : (
                        'Semua Outlet'
                      )}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      {item.photoUrl ? (
                        <a
                          href={item.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#6B1D2F] hover:text-white text-stone-700 text-[11px] font-bold transition border border-stone-200"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Lihat Foto</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-stone-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
