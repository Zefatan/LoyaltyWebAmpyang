/* ============================================================
   Fungsi bersama semua halaman: promo, PIN kasir, PWA, util.
   ============================================================ */

const C = AMPYANG_CONFIG;

/* ---------- Util ---------- */
function el(id) {
  return document.getElementById(id);
}

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function sha256(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function linkWhatsApp() {
  return (
    "https://wa.me/" +
    C.waNumber +
    "?text=" +
    encodeURIComponent(C.waPesanGabung)
  );
}

/* ---------- Promo ---------- */
function promoAktif(p, sekarang) {
  const mulai = p.mulai ? new Date(p.mulai + "T00:00:00") : null;
  const selesai = p.selesai ? new Date(p.selesai + "T23:59:59") : null;
  if (mulai && sekarang < mulai) return false;
  if (selesai && sekarang > selesai) return false;
  return true;
}

async function muatPromo() {
  const res = await fetch(C.promoUrl, { cache: "no-cache" });
  if (!res.ok) throw new Error("Gagal memuat promo");
  const data = await res.json();
  const now = new Date();
  return (data.promos || []).filter((p) => promoAktif(p, now));
}

function kartuPromoHTML(p) {
  const periode =
    p.mulai && p.selesai
      ? `${formatTanggal(p.mulai)} – ${formatTanggal(p.selesai)}`
      : p.selesai
      ? `s.d. ${formatTanggal(p.selesai)}`
      : "Berlaku sampai info berikutnya";
  return `
    <article class="promo-card">
      ${p.label ? `<span class="promo-label">${p.label}</span>` : ""}
      <h3>${p.judul}</h3>
      <p>${p.deskripsi}</p>
      <p class="promo-periode">${periode}</p>
    </article>`;
}

async function renderPromo(containerId, batas) {
  const wadah = el(containerId);
  if (!wadah) return;
  try {
    let promos = await muatPromo();
    if (batas) promos = promos.slice(0, batas);
    wadah.innerHTML = promos.length
      ? promos.map(kartuPromoHTML).join("")
      : `<p class="kosong">Belum ada promo aktif saat ini. Pantau terus ya.</p>`;
  } catch {
    wadah.innerHTML = `<p class="kosong">Promo tidak dapat dimuat. Coba lagi nanti.</p>`;
  }
}

/* ---------- Modal PIN Kasir ---------- */
/* Meminta kasir memasukkan PIN di HP pelanggan.
   Mengembalikan Promise<boolean> — true jika PIN benar. */
function mintaPinKasir(judul) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${judul}</h3>
        <p class="modal-info">Serahkan HP ini ke <strong>kasir</strong> untuk memasukkan PIN.</p>
        <input type="password" inputmode="numeric" autocomplete="off"
               maxlength="6" class="pin-input" placeholder="PIN kasir" aria-label="PIN kasir">
        <p class="pin-salah" hidden>PIN salah. Coba lagi.</p>
        <div class="modal-tombol">
          <button class="btn btn-sekunder" data-aksi="batal">Batal</button>
          <button class="btn btn-utama" data-aksi="ok">Konfirmasi</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const input = overlay.querySelector(".pin-input");
    const salah = overlay.querySelector(".pin-salah");
    input.focus();

    function tutup(hasil) {
      overlay.remove();
      resolve(hasil);
    }

    overlay.querySelector('[data-aksi="batal"]').onclick = () => tutup(false);
    overlay.querySelector('[data-aksi="ok"]').onclick = periksa;
    input.onkeydown = (e) => {
      if (e.key === "Enter") periksa();
    };

    async function periksa() {
      const hash = await sha256(input.value.trim());
      if (hash === C.kasirPinHash) {
        tutup(true);
      } else {
        salah.hidden = false;
        input.value = "";
        input.focus();
      }
    }
  });
}

/* ---------- PWA: daftar service worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

/* ---------- Isi elemen umum (nama kedai, link WA, tahun) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-nama-kedai]").forEach((n) => {
    n.textContent = C.namaKedai;
  });
  document.querySelectorAll("[data-link-wa]").forEach((a) => {
    a.href = linkWhatsApp();
  });
  document.querySelectorAll("[data-tahun]").forEach((n) => {
    n.textContent = new Date().getFullYear();
  });
});
