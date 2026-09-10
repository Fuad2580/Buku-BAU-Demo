import React, { useState } from 'react';
import { FileText, ExternalLink, Image as ImageIcon, Edit3, Check, X } from 'lucide-react';
import { Category } from '../types';
import { CardLightFlare } from './CardLightFlare';

interface CategoryBannerProps {
  category: Category;
  onUpdatePhotoUrl: (categoryId: string, newUrl: string) => void;
}

export const CategoryBanner: React.FC<CategoryBannerProps> = ({
  category,
  onUpdatePhotoUrl,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(category.pdfOrPhotoUrl || '');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const isPdf = category.pdfOrPhotoUrl && (
    category.pdfOrPhotoUrl.toLowerCase().includes('.pdf') ||
    category.pdfOrPhotoUrl.toLowerCase().includes('drive.google.com')
  );

  const handleSave = () => {
    onUpdatePhotoUrl(category.id, tempUrl.trim());
    setIsEditing(false);
  };

  // Convert Google Drive view link to embeddable preview if possible
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return url;
  };

  return (
    <div className="bg-[#1a030a]/95 rounded-3xl border border-rose-500/25 shadow-xl overflow-hidden mb-6 relative overflow-visible">
      
      {/* Luminous lens flare light effect */}
      <CardLightFlare topPosition="center" />

      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        
        {/* Left Info Column */}
        <div className="p-6 md:col-span-7 flex flex-col justify-between space-y-4 text-rose-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 shadow-sm">
                Level Kategori
              </span>
              {category.badge && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-950/60 text-[#FFD285] border border-rose-500/30">
                  {category.badge}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              {category.name}
            </h2>
            <p className="text-sm text-rose-200/80 mt-2 leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Action / PDF Link Handler */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isPdf ? (
              <button
                onClick={() => setShowPdfModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E53965] to-[#B02848] hover:brightness-110 text-white text-xs font-bold transition shadow-md border-t border-rose-300/40 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FFD285]" />
                <span>Buka Link PDF Kategori</span>
              </button>
            ) : category.pdfOrPhotoUrl ? (
              <a
                href={category.pdfOrPhotoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-100 text-xs font-bold transition border border-rose-500/25"
              >
                <ImageIcon className="w-4 h-4 text-[#FFD285]" />
                <span>Buka Foto Kategori</span>
                <ExternalLink className="w-3 h-3 text-rose-300/60" />
              </a>
            ) : null}

            {/* Edit link in spreadsheet simulator */}
            {!isEditing ? (
              <button
                onClick={() => {
                  setTempUrl(category.pdfOrPhotoUrl || '');
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1 text-xs text-rose-300/70 hover:text-[#FFD285] font-medium transition cursor-pointer"
                title="Ganti Link Foto atau Dokumen PDF dari Spreadsheet"
              >
                <Edit3 className="w-3 h-3" />
                <span>Ganti Link Foto/PDF</span>
              </button>
            ) : (
              <div className="w-full flex items-center gap-2 mt-2 bg-black/40 p-2 rounded-xl border border-rose-500/25">
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Tempel link URL Foto atau Link PDF Google Drive..."
                  className="flex-1 text-xs bg-black/50 text-white px-2.5 py-1.5 rounded-lg border border-rose-500/30 focus:outline-none focus:border-[#FFD285]"
                />
                <button
                  onClick={handleSave}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                  title="Simpan"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 transition cursor-pointer"
                  title="Batal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Photo/Media Column */}
        <div className="md:col-span-5 relative min-h-[160px] md:min-h-[220px] bg-black/40 overflow-hidden border-t md:border-t-0 md:border-l border-rose-500/20">
          {category.pdfOrPhotoUrl && !isPdf ? (
            <img
              src={category.pdfOrPhotoUrl}
              alt={category.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : isPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black/40 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 shadow-sm flex items-center justify-center mb-3 border border-rose-500/30">
                <FileText className="w-7 h-7 text-[#FFD285]" />
              </div>
              <p className="text-xs font-bold text-white">Dokumen PDF Terlampir</p>
              <p className="text-[11px] text-rose-300/60 max-w-[200px] truncate mt-0.5">
                {category.pdfOrPhotoUrl}
              </p>
              <button
                onClick={() => setShowPdfModal(true)}
                className="mt-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E53965] to-[#B02848] text-white text-xs font-semibold shadow-xs cursor-pointer border-t border-rose-300/40"
              >
                Pratinjau PDF
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-rose-300/40 p-6">
              <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
              <span className="text-xs text-rose-200/60">Belum ada foto/link PDF</span>
              <span className="text-[10px] text-rose-300/40">Dapat diisi via Spreadsheet</span>
            </div>
          )}
        </div>

      </div>

      {/* PDF Modal Viewer */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#6B1D2F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E8BF87]" />
                <h3 className="font-bold text-sm font-serif">
                  Dokumen PDF: {category.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={category.pdfOrPhotoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs text-white font-medium flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Buka di Tab Baru
                </a>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-stone-100 relative">
              <iframe
                src={getEmbedUrl(category.pdfOrPhotoUrl)}
                title={`PDF ${category.name}`}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
