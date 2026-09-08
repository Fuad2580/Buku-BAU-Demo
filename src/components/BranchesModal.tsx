import React, { useState } from 'react';
import { X, MapPin, Search, ExternalLink, Phone } from 'lucide-react';
import { BranchLocation } from '../types';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: BranchLocation[];
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  isOpen,
  onClose,
  branches,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');

  if (!isOpen) return null;

  const cities = ['Semua Kota', ...Array.from(new Set(branches.map(b => b.city)))];

  const filtered = branches.filter(b => {
    const matchCity = selectedCity === 'Semua Kota' || b.city === selectedCity;
    const matchSearch = !search || 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 bg-[#6B1D2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#E8BF87]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                Lokasi Cabang SOZO Skin Clinic
              </h3>
              <p className="text-xs text-rose-200">
                Temukan outlet terdekat di kotamu di seluruh Indonesia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama cabang, mall, jalan, atau kota..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Outlet List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <p className="text-sm">Tidak ada cabang yang cocok dengan pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-rose-200 hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-[#6B1D2F] bg-rose-50 px-2 py-0.5 rounded">
                        {branch.city}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {branch.name}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {branch.address}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${branch.name} ${branch.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#6B1D2F] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka di Google Maps</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <span>Menampilkan {filtered.length} dari {branches.length} cabang</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
