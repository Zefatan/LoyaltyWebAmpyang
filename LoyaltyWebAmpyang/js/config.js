/* ============================================================
   KONFIGURASI KEDAI AMPYANG
   File ini satu-satunya yang perlu diubah pemilik kedai.
   Cara edit: buka file ini di GitHub > tombol pensil > ubah > Commit.
   ============================================================ */

const AMPYANG_CONFIG = {
  // Identitas kedai
  namaKedai: "Kedai Ampyang",
  tagline: "Ngopi hangat, rezeki ngumpul.",
  alamat: "Jl. Contoh No. 1 (ganti dengan alamat kedai)",
  jamBuka: "Setiap hari, 07.00 - 22.00",

  // Nomor WhatsApp untuk info promo (format internasional tanpa +, contoh: 6281234567890)
  waNumber: "6281234567890",
  waPesanGabung: "Halo Kedai Ampyang, saya mau gabung info promo member!",

  // Program loyalty: kartu stempel
  stampTarget: 10,               // jumlah stempel untuk dapat hadiah
  rewardText: "1 minuman gratis pilihan kamu",
  maxStempelPerHari: 2,          // batas stempel per member per hari (anti-curang)

  // PIN kasir (disimpan sebagai hash SHA-256, bukan PIN aslinya).
  // PIN bawaan: 2468 — WAJIB diganti sebelum dipakai sungguhan!
  // Cara ganti: buka halaman admin.html > "Buat Hash PIN Baru" > salin ke sini.
  kasirPinHash: "a1fb4e703a9ef1fa4936801721ff285a97ac85330856674412e054892afe6972",

  // Sumber data promo (file JSON di repo ini)
  promoUrl: "data/promos.json",
};
