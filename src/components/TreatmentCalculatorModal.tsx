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
  const subtotal = cartItems.reduce((sum, item) => {
    const pricePerUnit = (useMemberPrice ? item.treatment.memberPrice : item.treatment.nonMemberPrice) * 1000;
    return sum + (pricePerUnit * item.quantity);
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
    msg += `Rangkaian Treatment:\n`;

    cartItems.forEach((item, index) => {
      const price = (useMemberPrice ? item.treatment.memberPrice : item.treatment.nonMemberPrice) * 1000;
      msg += `${index + 1}. ${item.treatment.name} (x${item.quantity}) - ${formatRupiah(price * item.quantity)}\n`;
      msg += `   Isi: ${item.treatment.inclusions.join(', ')}\n`;
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 bg-[#6B1D2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-[#E8BF87]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                Kalkulator Estimasi Biaya
              </h3>
              <p className="text-xs text-rose-200">
                Simulasi biaya paket treatment, DP, dan cicilan 0%
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Options: Member toggle and customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Tipe Harga
              </label>
              <div className="grid grid-cols-2 gap-1 bg-stone-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUseMemberPrice(false)}
                  className={`py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    !useMemberPrice ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
                  }`}
                >
                  Non-Member
                </button>
                <button
                  type="button"
                  onClick={() => setUseMemberPrice(true)}
                  className={`py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    useMemberPrice ? 'bg-[#C9A86A] text-stone-900 shadow-sm' : 'text-stone-600'
                  }`}
                >
                  ⭐ Member VIP
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Nama Pasien (Opsional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama Anda..."
                className="w-full text-xs px-3 py-1.5 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                Treatment Terpilih ({cartItems.length})
              </span>
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Kosongkan
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="py-10 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <Calculator className="w-10 h-10 mx-auto mb-2 text-stone-300 stroke-1" />
                <p className="text-sm font-medium">Belum ada treatment yang dipilih.</p>
                <p className="text-xs text-stone-400 mt-1">Klik tombol "+ Estimasi" pada kartu treatment untuk menambahkan.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cartItems.map((item) => {
                  const unitPrice = (useMemberPrice ? item.treatment.memberPrice : item.treatment.nonMemberPrice) * 1000;
                  return (
                    <div
                      key={item.treatment.id}
                      className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {item.treatment.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate">
                          {item.treatment.inclusions.join(', ')}
                        </p>
                        <span className="text-xs font-bold text-[#6B1D2F]">
                          {formatRupiah(unitPrice)} <span className="text-[10px] text-stone-400 font-normal">/sesi</span>
                        </span>
                      </div>

                      {/* Quantity control */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                          <button
                            onClick={() => onUpdateQuantity(item.treatment.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.treatment.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.treatment.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition cursor-pointer"
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
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal Treatment</span>
                <span className="font-semibold text-stone-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600">
                <span className="flex items-center gap-1">
                  <span>Service Charge (5%, Maks. Rp 150.000)</span>
                </span>
                <span className="font-semibold text-stone-900">{formatRupiah(serviceCharge)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Total Paket</span>
                <span className="text-lg font-extrabold text-[#6B1D2F]">{formatRupiah(totalWithService)}</span>
              </div>
              
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold block">DP Booking Appointment:</span>
                  <span className="text-[10px] text-amber-700">Untuk mengamankan promo & slot dokter</span>
                </div>
                <span className="font-bold text-sm">{formatRupiah(bookingDp)}</span>
              </div>

              <div className="flex justify-between text-xs text-stone-700 pt-1">
                <span>Sisa Pelunasan di Klinik:</span>
                <span className="font-extrabold text-stone-900">{formatRupiah(remainingAtClinic)}</span>
              </div>
            </div>
          )}

          {/* Cicilan 0% Simulation Card */}
          {cartItems.length > 0 && (
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-4 border border-rose-200/60">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-[#6B1D2F]" />
                <span className="text-xs font-bold text-[#6B1D2F] uppercase tracking-wide">
                  Simulasi Cicilan 0% Paylater
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] text-stone-500 block">3 Bulan (0%)</span>
                  <span className="text-xs font-bold text-stone-900">{formatRupiah(cicilan3x)}/bln</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] text-stone-500 block">6 Bulan (0%)</span>
                  <span className="text-xs font-bold text-stone-900">{formatRupiah(cicilan6x)}/bln</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] text-stone-500 block">12 Bulan (0%)</span>
                  <span className="text-xs font-bold text-stone-900">{formatRupiah(cicilan12x)}/bln</span>
                </div>
              </div>
              <p className="text-[10px] text-stone-500 mt-2 text-center">
                *Tersedia di Indodana, Kredivo, Atome, SPayLater, BRI, BCA, Mandiri
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>Masa berlaku paket: </span>
            <span className="font-semibold text-stone-700">{settings.packageValidityMonths} Bulan</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition cursor-pointer"
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
                    : 'bg-[#6B1D2F] hover:bg-[#521523] text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 pointer-events-none'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Rincian Estimasi Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#E8BF87]" />
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
