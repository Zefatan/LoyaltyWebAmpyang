# Perencanaan Loyalty Website — Kedai Ampyang

Dokumen ini adalah rencana lengkap program loyalty Kedai Ampyang: tujuan, opsi
program, keputusan yang diambil, asumsi yang dipakai, alur operasional, dan
roadmap pengembangan.

---

## 1. Tujuan

| Tujuan | Ukuran keberhasilan (KPI) |
|---|---|
| Pelanggan datang kembali lebih sering | Jumlah stempel per minggu, jumlah kartu penuh per bulan |
| Exposure promo lebih luas | Anggota daftar siaran WhatsApp, kunjungan halaman promo |
| Biaya Rp0 dan minim maintenance | Tidak ada tagihan bulanan; update promo di bawah 5 menit |
| Jangka panjang: transaksi lebih praktis | (Fase 2 dan 3, lihat roadmap) |

## 2. Opsi Program Loyalty (dan mana yang dipilih)

| Opsi | Cara kerja | Kelebihan | Kekurangan | Cocok jika |
|---|---|---|---|---|
| **A. Kartu stempel digital (dipilih)** | 1 kunjungan = 1 stempel; 10 stempel = 1 minuman gratis | Paling mudah dipahami, nol pelatihan kasir, nol maintenance | Tidak membedakan nilai belanja | Kedai dengan menu harga mirip dan kunjungan rutin |
| B. Sistem poin | Poin sesuai nominal belanja, tukar dari katalog hadiah | Adil terhadap nilai belanja, fleksibel | Kasir harus input nominal; perlu kelola katalog dan nilai tukar | Menu dengan rentang harga lebar |
| C. Membership tier | Bronze/Silver/Gold dari frekuensi kunjungan; benefit naik per tier | Retensi jangka panjang kuat, terasa eksklusif | Paling kompleks; benefit permanen berarti biaya permanen | Basis pelanggan sudah besar dan loyal |
| D. Hybrid stempel + tier | Mulai stempel; total kunjungan menaikkan tier | Jalur upgrade alami dari A | Kompleksitas menengah | Evolusi dari A setelah 3-6 bulan |

**Keputusan: mulai dari A (kartu stempel).** Struktur data sudah menyimpan
`totalStempel` sepanjang masa, sehingga upgrade ke D (tier) tinggal menambah
logika tampilan — tanpa migrasi data.

Mengubah aturan main: cukup edit `stampTarget`, `rewardText`, dan
`maxStempelPerHari` di `js/config.js`.

## 3. Asumsi yang Dipakai (mohon dikoreksi jika salah)

1. **"Gratis" berarti benar-benar Rp0 per bulan.** Karena itu dipilih website
   statis di GitHub Pages dengan data di HP pelanggan. Tidak ada server,
   tidak ada tagihan.
2. **HP pelanggan = kartu member.** Data stempel tersimpan di browser HP
   pelanggan. Konsekuensi: ganti HP atau hapus data browser berarti kartu
   hilang (sama seperti kartu stempel kertas yang hilang). Solusi permanen
   ada di Fase 2 (login + cloud).
3. **Kasir tidak diberi perangkat khusus.** Validasi memakai PIN rahasia yang
   diketik kasir di HP pelanggan. Anti-curang tambahan: batas
   `maxStempelPerHari` (bawaan: 2) dan riwayat ber-timestamp.
4. **Notifikasi promo** butuh dua jalur karena keterbatasan teknis:
   - WhatsApp (fase 1): gratis dan paling efektif di Indonesia, tapi manual.
   - Push notification (fase 2): butuh backend (Firebase gratis), dan di
     iPhone hanya bekerja bila situs di-install ke home screen.
5. **"Transaksi" di masa depan tidak gratis.** Payment gateway
   (Midtrans/Xendit) memotong sekitar 0,7-2% per transaksi. Karena itu
   transaksi online ditaruh di Fase 3 sebagai keputusan bisnis terpisah.

## 4. Alur Operasional di Kedai

**Pelanggan baru:**
1. Lihat QR atau tautan situs di meja atau kasir, lalu buka website.
2. Isi nama, dan kartu member langsung jadi (tanpa install, tanpa OTP).
3. (Disarankan) install ke home screen agar seperti aplikasi.

**Setiap kunjungan:**
1. Pelanggan pesan dan bayar seperti biasa.
2. Buka halaman Kartu, tekan **Tambah Stempel**, serahkan HP ke kasir.
3. Kasir mengetik PIN, stempel bertambah. Selesai dalam hitungan detik.

**Kartu penuh:**
1. Situs otomatis memberi 1 hadiah dan mengosongkan kartu.
2. Saat menukar, pelanggan menekan **Tukar Hadiah** dan kasir memasukkan PIN.

**Pemilik kedai (rutinitas):**
- Ganti/tambah promo: buka `admin.html`, susun promo, salin JSON ke
  `data/promos.json` di GitHub (di bawah 5 menit, dari HP pun bisa).
- Broadcast promo baru lewat WhatsApp Business.
- Ganti PIN kasir berkala lewat `admin.html` (misalnya tiap bulan atau saat
  karyawan berganti).

## 5. Keamanan dan Anti-Kecurangan (Fase 1)

| Risiko | Mitigasi |
|---|---|
| Pelanggan menambah stempel sendiri | PIN hanya diketahui kasir; PIN disimpan sebagai hash SHA-256 (tidak terbaca dari kode) |
| PIN bocor | Ganti PIN kapan pun lewat `admin.html` (1 menit); batas stempel harian membatasi kerugian |
| Spam stempel dalam sehari | `maxStempelPerHari` (bawaan 2) |
| Manipulasi data lokal oleh pengguna teknis | Diterima sebagai risiko fase 1 — kerugian maksimal 1 minuman; Fase 2 (cloud) menghilangkan risiko ini |

## 6. Roadmap

### Fase 1 — Loyalty + Promo (repo ini, Rp0 per bulan) — selesai
- Kartu stempel digital dengan PIN kasir
- Halaman promo berbatas tanggal (otomatis tampil/hilang)
- PWA: bisa di-install dan tetap terbuka saat sinyal jelek
- Kanal WhatsApp untuk siaran promo
- `admin.html`: alat ganti PIN dan penyusun promo

### Fase 2 — Akun Cloud + Push Notification (tetap Rp0 per bulan)
- Firebase (tier gratis): login Google, kartu tidak hilang walau ganti HP
- Push notification promo (FCM) untuk yang meng-install PWA
- Dashboard kasir sederhana + statistik (member aktif, stempel per minggu)
- Upgrade opsional ke program D (stempel + tier) memakai `totalStempel`
- Persiapan sudah ada: semua akses data lewat adapter `js/storage.js`,
  jadi migrasi tidak menyentuh halaman lain.

### Fase 3 — Transaksi (ada biaya per transaksi, keputusan bisnis terpisah)
- Menu digital + pre-order (pesan dari HP, bayar di kasir — masih gratis)
- Pembayaran online via gateway (Midtrans/Xendit, sekitar 0,7-2% per
  transaksi) — hanya jika volume sudah membenarkan biayanya

## 7. Rencana Peluncuran (Marketing)

1. **Cetak QR code** menuju situs, tempel di kasir, meja, dan pintu.
   Teks ajakan: "Scan, kumpulkan 10 stempel, tukar dengan minuman gratis."
2. **Script kasir** (1 kalimat): "Sudah punya kartu member kami? Scan ini,
   gratis, langsung dapat stempel pertama."
3. **Promo peluncuran** (sudah terpasang di `data/promos.json`): stempel ganda
   untuk member baru selama bulan pertama.
4. **WhatsApp Business**: buat daftar siaran "Promo Ampyang"; tombol gabung
   sudah ada di situs.
5. **Evaluasi bulanan**: hitung kartu penuh yang ditukar — ukuran paling jujur
   bahwa program berjalan.
