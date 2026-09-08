import React, { useState } from 'react';
import { FileText, ExternalLink, Image as ImageIcon, Edit3, Check, X } from 'lucide-react';
import { Category } from '../types';

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
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        
        {/* Left Info Column */}
        <div className="p-6 md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#F7EADB] text-[#6B1D2F]">
                Level Kategori
              </span>
              {category.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C9A86A]/20 text-stone-800">
                  {category.badge}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              {category.name}
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Action / PDF Link Handler */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isPdf ? (
              <button
                onClick={() => setShowPdfModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B1D2F] hover:bg-[#521523] text-white text-xs font-bold transition shadow cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#E8BF87]" />
                <span>Buka Link PDF Kategori</span>
              </button>
            ) : category.pdfOrPhotoUrl ? (
              <a
                href={category.pdfOrPhotoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition"
              >
                <ImageIcon className="w-4 h-4 text-stone-600" />
                <span>Buka Foto Kategori</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            ) : null}

            {/* Edit link in spreadsheet simulator */}
            {!isEditing ? (
              <button
                onClick={() => {
                  setTempUrl(category.pdfOrPhotoUrl || '');
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 font-medium transition cursor-pointer"
                title="Ganti Link Foto atau Dokumen PDF dari Spreadsheet"
              >
                <Edit3 className="w-3 h-3" />
                <span>Ganti Link Foto/PDF</span>
              </button>
            ) : (
              <div className="w-full flex items-center gap-2 mt-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Tempel link URL Foto atau Link PDF Google Drive..."
                  className="flex-1 text-xs bg-white px-2.5 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
                />
                <button
                  onClick={handleSave}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
                  title="Simpan"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition cursor-pointer"
                  title="Batal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Photo/Media Column */}
        <div className="md:col-span-5 relative min-h-[160px] md:min-h-[220px] bg-stone-100 overflow-hidden">
          {category.pdfOrPhotoUrl && !isPdf ? (
            <img
              src={category.pdfOrPhotoUrl}
              alt={category.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : isPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-[#FDF4EA] text-center border-t md:border-t-0 md:border-l border-stone-200">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 border border-stone-200">
                <FileText className="w-7 h-7 text-[#6B1D2F]" />
              </div>
              <p className="text-xs font-bold text-stone-800">Dokumen PDF Terlampir</p>
              <p className="text-[11px] text-stone-500 max-w-[200px] truncate mt-0.5">
                {category.pdfOrPhotoUrl}
              </p>
              <button
                onClick={() => setShowPdfModal(true)}
                className="mt-3 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-semibold shadow-xs cursor-pointer"
              >
                Pratinjau PDF
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-6">
              <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
              <span className="text-xs">Belum ada foto/link PDF</span>
              <span className="text-[10px] text-stone-400">Dapat diisi via Spreadsheet</span>
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
