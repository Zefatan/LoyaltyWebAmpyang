/* ============================================================
   Alat bantu pemilik kedai (admin.html) — semua berjalan
   di browser, tidak ada data yang dikirim ke mana pun.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Alat 1: Buat hash PIN kasir baru ---- */
  el("form-pin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pin = el("input-pin").value.trim();
    if (pin.length < 4) {
      el("hasil-pin").textContent = "PIN minimal 4 digit.";
      return;
    }
    const hash = await sha256(pin);
    el("hasil-pin").textContent = hash;
    el("blok-hasil-pin").hidden = false;
  });

  /* ---- Alat 2: Penyusun promo (JSON generator) ---- */
  const daftarPromo = [];

  el("form-promo").addEventListener("submit", (e) => {
    e.preventDefault();
    daftarPromo.push({
      id: "p" + Date.now(),
      judul: el("promo-judul").value.trim(),
      deskripsi: el("promo-deskripsi").value.trim(),
      label: el("promo-label").value.trim(),
      mulai: el("promo-mulai").value,
      selesai: el("promo-selesai").value,
    });
    e.target.reset();
    perbaruiJSON();
  });

  el("btn-kosongkan").addEventListener("click", () => {
    daftarPromo.length = 0;
    perbaruiJSON();
  });

  el("btn-salin").addEventListener("click", async () => {
    await navigator.clipboard.writeText(el("hasil-json").textContent);
    el("btn-salin").textContent = "Tersalin";
    setTimeout(() => (el("btn-salin").textContent = "Salin JSON"), 2000);
  });

  function perbaruiJSON() {
    const data = {
      diperbarui: new Date().toISOString().slice(0, 10),
      promos: daftarPromo,
    };
    el("hasil-json").textContent = JSON.stringify(data, null, 2);
    el("blok-hasil-json").hidden = daftarPromo.length === 0;
    el("jumlah-promo").textContent = daftarPromo.length;
  }
});
