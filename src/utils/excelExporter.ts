import * as XLSX from 'xlsx';
import { Category, TreatmentItem, SinglePromoItem, SubscriptionItem, SkincareKit, BranchLocation, ClinicSettings } from '../types';

export function exportBauToExcel(
  settings: ClinicSettings,
  categories: Category[],
  treatments: TreatmentItem[],
  singlePromos: SinglePromoItem[],
  subscriptions: SubscriptionItem[],
  branches: BranchLocation[],
  skincareKits: SkincareKit[],
  filename: string = 'Buku_BAU_SOZO_September_2026.xlsx'
) {
  const wb = XLSX.utils.book_new();

  // 1. Pengaturan_Klinik
  const configData = [
    ["Kunci Parameter", "Nilai", "Keterangan"],
    ["CLINIC_NAME", settings.clinicName || "SOZO Skin Clinic", "Nama Resmi Klinik"],
    ["PROMO_TITLE", settings.promoTitle || "Rona Cantik Bersemi", "Judul Besar Banner Promo Utama"],
    ["PROMO_SUBTITLE", settings.promoSubtitle || "Dapatkan kulit sehat, cerah, dan bebas masalah...", "Narasi / Deskripsi Promo di Bawah Judul"],
    ["PROMO_BADGE", settings.promoBadge || "Promo Spesial Buku BAU 2026", "Label / Badge di Atas Judul Promo"],
    ["PAYMENT_PARTNERS", settings.paymentPartners || "Indodana • Kredivo • Atome • SPayLater • BCA • BRI • Mandiri", "Daftar Partner Cicilan & Pembayaran"],
    ["TAGLINE", settings.tagline || "Cicilan 0% Paylater & Cashback hingga 500 RB", "Slogan / Header Web App"],
    ["PERIOD_TEXT", settings.periodText || "Berlaku untuk booking periode 1 - 30 September 2026", "Periode Promo Aktif"],
    ["BOOKING_DP", String(settings.bookingDp || 50000), "Nominal DP Booking Appointment (Rupiah)"],
    ["SERVICE_CHARGE_PCT", String(settings.serviceChargePercent || 5), "Persentase Service Charge (%)"],
    ["SERVICE_CHARGE_MAX", String(settings.serviceChargeMax || 150000), "Batas Maksimal Service Charge (Rupiah)"],
    ["VALIDITY_MONTHS", String(settings.packageValidityMonths || 6), "Masa Berlaku Paket (Bulan)"],
    ["WHATSAPP_CS", settings.csWhatsappNumber || "6281234567890", "Nomor WhatsApp CS untuk Booking Order"],
    ["ACCESS_PASSWORD", settings.accessPassword || "sozoskinjayajaya", "Password untuk Membuka Web App"],

    ["SUBSCRIPTION_PAGE_BADGE", settings.subscriptionPageBadge || "Buku BAU Hal. 72 - 80", "Badge Halaman Subscription"],
    ["SUBSCRIPTION_TAG_BADGE", settings.subscriptionTagBadge || "Maksimal Hemat", "Badge Tag Subscription"],
    ["SUBSCRIPTION_TITLE", settings.subscriptionTitle || "Paket Treatment Subscription (Langganan Sesi)", "Judul Banner Paket Subscription"],
    ["SUBSCRIPTION_SUBTITLE", settings.subscriptionSubtitle || "Dapatkan harga per sesi jauh lebih murah...", "Deskripsi Subscription"],
    ["SUBSCRIPTION_TERMS_TITLE", settings.subscriptionTermsTitle || "Masa Berlaku Paket:", "Judul Masa Berlaku"],
    ["SUBSCRIPTION_TERMS_LIST", settings.subscriptionTermsList || "• Paket 3x: berlaku hingga 5 bulan\n• Paket 6x: berlaku hingga 8 bulan\n• Paket 12x: berlaku hingga 14 bulan", "Poin-poin Masa Berlaku"],

    ["SINGLE_PROMO_PAGE_BADGE", settings.singlePromoPageBadge || "Buku BAU Hal. 9 - 10", "Badge Halaman Single Promo"],
    ["SINGLE_PROMO_TAG_BADGE", settings.singlePromoTagBadge || "Harga Satuan Promo", "Badge Tag Single Promo"],
    ["SINGLE_PROMO_TITLE", settings.singlePromoTitle || "Promo Single Treatment", "Judul Banner Single Promo"],
    ["SINGLE_PROMO_SUBTITLE", settings.singlePromoSubtitle || "Pilihan perawatan satuan dengan harga spesial...", "Deskripsi Single Promo"],

    ["SKINCARE_PAGE_BADGE", settings.skincarePageBadge || "Buku BAU Hal. 82 - 85", "Badge Halaman Skincare Kit"],
    ["SKINCARE_TAG_BADGE", settings.skincareTagBadge || "FREE Exclusive SOZO Pouch", "Badge Tag Skincare Kit"],
    ["SKINCARE_TITLE", settings.skincareTitle || "Paket Skincare Kit Bundling", "Judul Banner Skincare Kit"],
    ["SKINCARE_SUBTITLE", settings.skincareSubtitle || "Formula dermatologis teruji klinis...", "Deskripsi Skincare Kit"]
  ];
  const wsConfig = XLSX.utils.aoa_to_sheet(configData);
  XLSX.utils.book_append_sheet(wb, wsConfig, "Pengaturan_Klinik");

  // 2. Kategori
  const catHeaders = ["ID Kategori", "Nama Kategori", "Deskripsi", "Link Foto atau PDF Banner", "Badge", "Urutan"];
  const catRows = categories.map(c => [
    c.id,
    c.name,
    c.description || "",
    c.pdfOrPhotoUrl || "",
    c.badge || "",
    c.order || 0
  ]);
  const wsCat = XLSX.utils.aoa_to_sheet([catHeaders, ...catRows]);
  XLSX.utils.book_append_sheet(wb, wsCat, "Kategori");

  // 3. Daftar_Treatment
  const treatHeaders = [
    "ID Treatment", "ID Kategori", "Nama Treatment", "Skin Goal",
    "Rincian Isi Treatment (Pisahkan koma)", "Harga Normal (RB)",
    "Harga Promo Non-Member (RB)", "Harga Promo Member (RB)",
    "Badge Promo", "Promo Baru? (TRUE/FALSE)", "Khusus Outlet Tertentu", "Link Foto Treatment"
  ];
  const treatRows = treatments.map(t => [
    t.id,
    t.categoryId,
    t.name,
    t.skinGoal || "",
    (t.inclusions || []).join(', '),
    t.originalPrice || 0,
    t.nonMemberPrice || 0,
    t.memberPrice || 0,
    t.badge || "",
    Boolean(t.isNewPromo),
    t.outletNotes || "",
    t.photoUrl || ""
  ]);
  const wsTreat = XLSX.utils.aoa_to_sheet([treatHeaders, ...treatRows]);
  XLSX.utils.book_append_sheet(wb, wsTreat, "Daftar_Treatment");

  // 4. Promo_Single
  const singleHeaders = ["ID", "Grup Treatment", "Nama Treatment", "Harga Normal (RB)", "Non-Member (RB)", "Member (RB)", "Khusus Outlet", "Catatan", "Link Foto Treatment"];
  const singleRows = singlePromos.map(sp => [
    sp.id,
    sp.group || "Glow & Rejuve",
    sp.name,
    sp.originalPrice || 0,
    sp.nonMemberPrice || 0,
    sp.memberPrice || 0,
    sp.outletRestricted || "",
    sp.notes || "",
    sp.photoUrl || ""
  ]);
  const wsSingle = XLSX.utils.aoa_to_sheet([singleHeaders, ...singleRows]);
  XLSX.utils.book_append_sheet(wb, wsSingle, "Promo_Single");

  // 5. Subscription_Paket
  const subHeaders = [
    "ID", "Nama Treatment", "Harga Single (RB)",
    "3x Normal", "3x Non-Member", "3x Member", "3x Sesi/Member",
    "6x Normal", "6x Non-Member", "6x Member", "6x Sesi/Member",
    "12x Normal", "12x Non-Member", "12x Member", "12x Sesi/Member",
    "Link Foto Treatment"
  ];
  const subRows = subscriptions.map(sub => [
    sub.id,
    sub.treatmentName,
    sub.singlePrice || 0,
    sub.package3x?.original || 0,
    sub.package3x?.nonMember || 0,
    sub.package3x?.member || 0,
    sub.package3x?.perSessionMember || 0,
    sub.package6x?.original || 0,
    sub.package6x?.nonMember || 0,
    sub.package6x?.member || 0,
    sub.package6x?.perSessionMember || 0,
    sub.package12x?.original || 0,
    sub.package12x?.nonMember || 0,
    sub.package12x?.member || 0,
    sub.package12x?.perSessionMember || 0,
    sub.photoUrl || ""
  ]);
  const wsSub = XLSX.utils.aoa_to_sheet([subHeaders, ...subRows]);
  XLSX.utils.book_append_sheet(wb, wsSub, "Subscription_Paket");

  // 6. Daftar_Klinik_Cabang
  const branchHeaders = ["ID Cabang", "Kota", "Nama Cabang", "Alamat Lengkap", "Nomor WhatsApp / Telp", "Jam Operasional"];
  const branchRows = branches.map(b => [
    b.id,
    b.city,
    b.name,
    b.address,
    b.phone || "6281234567890",
    b.operatingHours || "10:00 - 20:00 WIB"
  ]);
  const wsBranches = XLSX.utils.aoa_to_sheet([branchHeaders, ...branchRows]);
  XLSX.utils.book_append_sheet(wb, wsBranches, "Daftar_Klinik_Cabang");

  // 7. Skincare_Homecare
  const skincareHeaders = ["ID Produk", "Nama Paket Skincare", "Harga Normal (Rp)", "Harga Promo (Rp)", "Isi Produk (Pisahkan koma)", "Free Gift / Bonus", "Link Foto Produk"];
  const skincareRows = skincareKits.map(sk => [
    sk.id,
    sk.name,
    sk.originalPrice || 0,
    sk.promoPrice || 0,
    (sk.items || []).join(', '),
    sk.freeGift || "",
    sk.photoUrl || ""
  ]);
  const wsSkincare = XLSX.utils.aoa_to_sheet([skincareHeaders, ...skincareRows]);
  XLSX.utils.book_append_sheet(wb, wsSkincare, "Skincare_Homecare");

  // Write file
  XLSX.writeFile(wb, filename);
}
