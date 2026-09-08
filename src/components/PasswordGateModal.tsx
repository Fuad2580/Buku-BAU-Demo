import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface PasswordGateModalProps {
  correctPassword?: string;
  clinicName?: string;
  csWhatsappNumber?: string;
  onUnlock: () => void;
}

export const PasswordGateModal: React.FC<PasswordGateModalProps> = ({
  correctPassword = 'sozo',
  clinicName = 'SOZO Skin Clinic',
  csWhatsappNumber = '6281234567890',
  onUnlock,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPassword.trim()) {
      setIsError(true);
      setErrorMessage('Silakan masukkan password akses.');
      return;
    }

    setIsSubmitting(true);
    setIsError(false);

    setTimeout(() => {
      // If correctPassword is set and not empty, check match
      const target = (correctPassword || '').trim();
      if (!target || inputPassword.trim() === target) {
        setIsSubmitting(false);
        onUnlock();
      } else {
        setIsSubmitting(false);
        setIsError(true);
        setErrorMessage('Password salah. Pastikan huruf besar/kecil sesuai.');
      }
    }, 250);
  };

  const handleContactAdmin = () => {
    const cleanPhone = (csWhatsappNumber || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Halo Admin ${clinicName}, saya memerlukan password akses untuk membuka Buku Menu & Promo BAU terkini.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#6B1D2F] via-[#7d1f35] to-[#6B1D2F] text-white p-7 text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-28 h-28 bg-[#C9A86A]/20 rounded-full blur-xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-[#F7D8A7] shadow-inner mb-3">
            <Lock className="w-7 h-7 text-[#F7D8A7]" />
          </div>

          <h2 className="text-xl font-bold font-serif tracking-tight text-white">
            {clinicName}
          </h2>
          <p className="text-xs text-rose-100/90 mt-1 font-medium">
            Buku Menu BAU & Katalog Promo Eksklusif
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#6B1D2F] text-[11px] font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Akses Terproteksi
            </div>
            <p className="text-xs text-stone-500 pt-1 leading-relaxed">
              Masukkan password otorisasi untuk membuka rincian harga, paket membership, dan treatment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                <span>Password Akses</span>
                <span className="text-[10px] text-stone-400 font-normal">Diatur via Spreadsheet</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  autoFocus
                  placeholder="Ketik password..."
                  className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-stone-50 border ${
                    isError
                      ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/30'
                      : 'border-stone-300 focus:border-[#6B1D2F] focus:ring-2 focus:ring-rose-100'
                  } transition outline-none font-medium text-stone-800`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {isError && (
                <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#6B1D2F] hover:bg-[#521523] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-rose-950/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Buka Buku Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Help link */}
          <div className="pt-2 border-t border-stone-100 flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={handleContactAdmin}
              className="text-xs font-semibold text-[#6B1D2F] hover:text-[#521523] hover:underline flex items-center gap-1 transition"
            >
              Belum tahu password? Hubungi Admin WhatsApp
            </button>
            <p className="text-[10px] text-stone-400">
              Pengaturan password dapat diubah kapan saja di tab <strong>Pengaturan_Klinik</strong> Google Spreadsheet.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
