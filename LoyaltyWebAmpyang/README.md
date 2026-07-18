# Loyalty Website Kedai Ampyang

Website kartu member digital + info promo untuk Kedai Ampyang.
**Gratis selamanya, tanpa server, minim maintenance.**

- **Kartu stempel digital** — beli 10, gratis 1 (angka bisa diatur)
- **Validasi PIN kasir** — stempel hanya sah jika kasir memasukkan PIN
- **Halaman promo** — promo tampil/hilang otomatis sesuai tanggal
- **PWA** — bisa di-install di HP seperti aplikasi, tetap terbuka saat offline
- **Kanal WhatsApp** — tombol gabung siaran promo

Rencana lengkap program (opsi loyalty, asumsi, roadmap): lihat [PLANNING.md](PLANNING.md).

---

## Cara Menerbitkan Website (sekali saja, sekitar 3 menit)

1. Buka repo ini di GitHub, masuk ke **Settings**, lalu **Pages**.
2. Pada *Build and deployment*, pilih **Deploy from a branch**.
3. Pilih branch utama, folder **/ (root)**, lalu **Save**.
4. Tunggu sekitar 1 menit. Alamat situs muncul di halaman yang sama, bentuknya:
   `https://<username>.github.io/LoyaltyWebAmpyang/`
5. Jadikan alamat itu QR code (gratis di banyak layanan QR), cetak, tempel di kasir dan meja.

## Sebelum Dipakai Sungguhan (wajib)

1. **Ganti PIN kasir.** Buka `admin.html` di situs, gunakan *Buat Hash PIN Baru*,
   lalu salin hasilnya ke `js/config.js` bagian `kasirPinHash`.
   (PIN bawaan `2468` hanya untuk uji coba.)
2. **Isi identitas kedai** di `js/config.js`: alamat, jam buka, dan
   `waNumber` (nomor WhatsApp format `62...`).

## Rutinitas Pemilik

| Tugas | Caranya | Lama |
|---|---|---|
| Ganti/tambah promo | `admin.html`: susun promo, salin JSON, tempel ke `data/promos.json` di GitHub (tombol pensil/Edit, lalu Commit) | < 5 menit |
| Ganti PIN kasir | `admin.html`: buat hash, tempel ke `js/config.js` | < 2 menit |
| Ubah aturan stempel | Edit `stampTarget` / `rewardText` / `maxStempelPerHari` di `js/config.js` | < 1 menit |

Semua bisa dilakukan dari HP lewat situs GitHub — tidak perlu laptop.

## Struktur Proyek

```
index.html        Beranda: ajakan member + promo unggulan
kartu.html        Kartu member digital (stempel, hadiah, riwayat)
promo.html        Semua promo aktif
admin.html        Alat pemilik: hash PIN & penyusun promo
data/promos.json  Daftar promo (satu-satunya "database" promo)
js/config.js      SEMUA pengaturan kedai ada di sini
js/storage.js     Lapisan data (siap diganti Firebase di Fase 2)
js/app.js         Logika bersama (promo, modal PIN, PWA)
js/kartu.js       Logika kartu stempel
sw.js             Service worker (offline + install)
```

## Uji Coba di Komputer

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Roadmap Singkat

- **Fase 1 (sekarang):** stempel + promo + WhatsApp — Rp0/bulan
- **Fase 2:** login Google (kartu tak hilang ganti HP) + push notification — tetap Rp0/bulan
- **Fase 3:** pre-order dan pembayaran online — opsional, ada biaya gateway

Detail di [PLANNING.md](PLANNING.md).
