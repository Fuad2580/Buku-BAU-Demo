import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Calculator, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { CartItem, ClinicSettings } from '../types';

interface TreatmentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  settings: ClinicSettings;
}

export const TreatmentCalculatorModal: React.FC<TreatmentCalculatorModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
}) => {
  const [useMemberPrice, setUseMemberPrice] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('SOZO Arteri');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculation in actual Rupiah (treatment prices in data are in thousands / "RB")
  const getUnitPrice = (item: CartItem) => {
    if (item.treatment.unitPriceInRupiah !== undefined) {
      return item.treatment.unitPriceInRupiah;
    }
    return (useMemberPrice ? item.treatment.memberPrice : item.treatment.nonMemberPrice) * 1000;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (getUnitPrice(item) * item.quantity);
  }, 0);

  const rawServiceCharge = Math.round(subtotal * (settings.serviceChargePercent / 100));
  const serviceCharge = Math.min(rawServiceCharge, settings.serviceChargeMax);
  const totalWithService = subtotal + serviceCharge;
  const bookingDp = cartItems.length > 0 ? settings.bookingDp : 0;
  const remainingAtClinic = Math.max(0, totalWithService - bookingDp);

  // Paylater Cicilan 0% simulation
  const cicilan3x = totalWithService > 0 ? Math.round(totalWithService / 3) : 0;
  const cicilan6x = totalWithService > 0 ? Math.round(totalWithService / 6) : 0;
  const cicilan12x = totalWithService > 0 ? Math.round(totalWithService / 12) : 0;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const getSummaryText = () => {
    let msg = `ESTIMASI PERAWATAN - SOZO SKIN CLINIC\n`;
    if (customerName) msg += `Nama Pasien: ${customerName}\n`;
    msg += `Cabang: ${selectedOutlet}\n`;
    msg += `Tipe Harga: ${useMemberPrice ? 'Member' : 'Non-Member'}\n\n`;
    msg += `Rangkaian Treatment & Produk Terpilih:\n`;

    cartItems.forEach((item, index) => {
      const price = getUnitPrice(item);
      const badgeText = item.treatment.badge ? ` [${item.treatment.badge}]` : '';
      msg += `${index + 1}. ${item.treatment.name}${badgeText} (x${item.quantity}) - ${formatRupiah(price * item.quantity)}\n`;
      if (item.treatment.inclusions && item.treatment.inclusions.length > 0) {
        msg += `   Rincian: ${item.treatment.inclusions.join(', ')}\n`;
      }
    });

    msg += `\nSubtotal: ${formatRupiah(subtotal)}\n`;
    msg += `Service Charge (5%): ${formatRupiah(serviceCharge)}\n`;
    msg += `Total Estimasi: ${formatRupiah(totalWithService)}\n`;
    msg += `Estimasi DP: ${formatRupiah(bookingDp)}\n`;
    msg += `Sisa Pembayaran di Klinik: ${formatRupiah(remainingAtClinic)}\n`;
    return msg;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1C030A]/95 backdrop-blur-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_24px_60px_rgba(15,2,6,0.9)] overflow-hidden border border-rose-300/30 text-white relative before:content-[''] before:absolute before:top-0 before:left-8 before:right-8 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#FFAEC2] before:to-transparent before:shadow-[0_0_15px_#FFAEC2]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#3D0817] via-[#2A0510] to-[#1F040C] text-white flex items-center justify-between border-b border-rose-300/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
              <Calculator className="w-4 h-4 text-[#FCE3B4]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight text-white">
                Kalkulator Estimasi Biaya
              </h3>
              <p className="text-xs text-rose-200/80">
                Simulasi biaya paket treatment, DP, dan cicilan 0%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Options: Member toggle and customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-3.5 rounded-2xl border border-rose-300/20">
            <div>
              <label className="text-[11px] font-bold text-rose-200/70 uppercase block mb-1">
                Tipe Harga
              </label>
              <div className="grid grid-cols-2 gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setUseMemberPrice(false)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    !useMemberPrice ? 'bg-[#8C1D35] text-white shadow-sm' : 'text-rose-200/60 hover:text-white'
                  }`}
                >
                  Non-Member
                </button>
                <button
                  type="button"
                  onClick={() => setUseMemberPrice(true)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    useMemberPrice ? 'bg-gradient-to-r from-[#E6C994] to-[#C9A86A] text-stone-950 shadow-sm' : 'text-rose-200/60 hover:text-white'
                  }`}
                >
                  ⭐ Member VIP
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-rose-200/70 uppercase block mb-1">
                Nama Pasien (Opsional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama Anda..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-black/40 border border-rose-300/25 text-white placeholder-rose-200/40 focus:outline-none focus:ring-1 focus:ring-[#FFAEC2]"
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-rose-200/70 tracking-wider">
                Treatment Terpilih ({cartItems.length})
              </span>
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Kosongkan
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="py-10 text-center text-rose-200/50 bg-black/30 rounded-2xl border border-dashed border-rose-300/20">
                <Calculator className="w-10 h-10 mx-auto mb-2 text-rose-300/30 stroke-1" />
                <p className="text-sm font-medium text-rose-100">Belum ada treatment yang dipilih.</p>
                <p className="text-xs text-rose-300/50 mt-1">Klik tombol "+ Estimasi" pada kartu treatment untuk menambahkan.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cartItems.map((item) => {
                  const unitPrice = getUnitPrice(item);
                  return (
                    <div
                      key={item.treatment.id}
                      className="p-3 bg-black/40 rounded-2xl border border-rose-300/20 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {item.treatment.name}
                          </h4>
                          {item.treatment.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950/80 text-[#FFAEC2] border border-rose-500/30">
                              {item.treatment.badge}
                            </span>
                          )}
                        </div>
                        {item.treatment.inclusions && item.treatment.inclusions.length > 0 && (
                          <p className="text-[11px] text-rose-200/60 truncate">
                            {item.treatment.inclusions.join(', ')}
                          </p>
                        )}
                        <span className="text-xs font-bold text-[#FCE3B4]">
                          {formatRupiah(unitPrice)} <span className="text-[10px] text-rose-300/50 font-normal">/item</span>
                        </span>
                      </div>

                      {/* Quantity control */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-black/60 rounded-xl p-1 border border-rose-300/20">
                          <button
                            onClick={() => onUpdateQuantity(item.treatment.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.treatment.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.treatment.id)}
                          className="p-1.5 text-rose-300/50 hover:text-rose-300 transition cursor-pointer"
                          title="Hapus item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detailed Cost Breakdown */}
          {cartItems.length > 0 && (
            <div className="bg-black/40 rounded-2xl p-4 border border-rose-300/20 space-y-2">
              <div className="flex justify-between text-xs text-rose-200/80">
                <span>Subtotal Treatment</span>
                <span className="font-semibold text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-rose-200/80">
                <span className="flex items-center gap-1">
                  <span>Service Charge (5%, Maks. Rp 150.000)</span>
                </span>
                <span className="font-semibold text-white">{formatRupiah(serviceCharge)}</span>
              </div>
              <div className="pt-2 border-t border-rose-300/20 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Paket</span>
                <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8EE] via-[#FCE3B4] to-[#FFF0D4]">{formatRupiah(totalWithService)}</span>
              </div>
              
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-400/30 text-amber-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#FCE3B4] block">DP Booking Appointment:</span>
                  <span className="text-[10px] text-amber-300/80">Untuk mengamankan promo & slot dokter</span>
                </div>
                <span className="font-bold text-sm text-[#FCE3B4]">{formatRupiah(bookingDp)}</span>
              </div>

              <div className="flex justify-between text-xs text-rose-200/90 pt-1">
                <span>Sisa Pelunasan di Klinik:</span>
                <span className="font-extrabold text-white">{formatRupiah(remainingAtClinic)}</span>
              </div>
            </div>
          )}

          {/* Cicilan 0% Simulation Card */}
          {cartItems.length > 0 && (
            <div className="bg-[#2D0613]/80 rounded-2xl p-4 border border-rose-300/25">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-[#FCE3B4]" />
                <span className="text-xs font-bold text-[#FCE3B4] uppercase tracking-wide">
                  Simulasi Cicilan 0% Paylater
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/40 p-2.5 rounded-xl border border-rose-300/20 shadow-xs">
                  <span className="text-[10px] text-rose-200/60 block">3 Bulan (0%)</span>
                  <span className="text-xs font-bold text-white">{formatRupiah(cicilan3x)}/bln</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-rose-300/20 shadow-xs">
                  <span className="text-[10px] text-rose-200/60 block">6 Bulan (0%)</span>
                  <span className="text-xs font-bold text-white">{formatRupiah(cicilan6x)}/bln</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-rose-300/20 shadow-xs">
                  <span className="text-[10px] text-rose-200/60 block">12 Bulan (0%)</span>
                  <span className="text-xs font-bold text-[#FCE3B4]">{formatRupiah(cicilan12x)}/bln</span>
                </div>
              </div>
              <p className="text-[10px] text-rose-200/60 mt-2 text-center">
                *Tersedia di Indodana, Kredivo, Atome, SPayLater, BRI, BCA, Mandiri
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-black/50 border-t border-rose-300/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-rose-200/70 text-center sm:text-left">
            <span>Masa berlaku paket: </span>
            <span className="font-semibold text-[#FCE3B4]">{settings.packageValidityMonths} Bulan</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold hover:bg-white/20 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleCopySummary}
              disabled={cartItems.length === 0}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition ${
                cartItems.length > 0
                  ? copied 
                    ? 'bg-emerald-600 text-white cursor-pointer'
                    : 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] hover:from-[#A1223F] hover:to-[#C23154] text-white cursor-pointer border border-[#FFAEC2]/40'
                  : 'bg-white/10 text-white/30 pointer-events-none'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Rincian Estimasi Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#FCE3B4]" />
                  <span>Salin Rincian Estimasi</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
