/* ============================================================
   Logika halaman Kartu Member (kartu.html)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  render();

  el("form-daftar").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = el("input-nama").value;
    if (!nama.trim()) return;
    AmpyangStore.createMember(nama, el("input-telepon").value);
    render();
  });

  el("btn-stempel").addEventListener("click", tambahStempel);
  el("btn-hadiah").addEventListener("click", tukarHadiah);
});

function render() {
  const m = AmpyangStore.getMember();
  el("bagian-daftar").hidden = !!m;
  el("bagian-kartu").hidden = !m;
  if (!m) return;

  el("kartu-nama").textContent = m.nama;
  el("kartu-id").textContent = m.memberId;
  el("kartu-sejak").textContent = "Member sejak " + formatTanggal(m.dibuat);

  // Grid stempel
  const grid = el("grid-stempel");
  grid.innerHTML = "";
  for (let i = 0; i < C.stampTarget; i++) {
    const cell = document.createElement("div");
    cell.className = "stempel" + (i < m.stempel ? " terisi" : "");
    cell.textContent = i < m.stempel ? "✓" : i + 1;
    grid.appendChild(cell);
  }

  const sisa = C.stampTarget - m.stempel;
  el("teks-progres").textContent =
    sisa > 0
      ? `Tinggal ${sisa} stempel lagi untuk dapat ${C.rewardText}.`
      : `Kartu penuh. Hadiahmu sudah masuk!`;

  // Hadiah tersedia
  const banner = el("banner-hadiah");
  banner.hidden = m.rewardTersedia === 0;
  if (m.rewardTersedia > 0) {
    el("teks-hadiah").textContent =
      `Kamu punya ${m.rewardTersedia} hadiah: ${C.rewardText}. ` +
      `Tunjukkan ke kasir untuk menukarnya.`;
  }
  el("btn-hadiah").hidden = m.rewardTersedia === 0;

  // Riwayat (10 terakhir)
  const riwayat = el("daftar-riwayat");
  const item = [...m.riwayat].reverse().slice(0, 10);
  riwayat.innerHTML = item.length
    ? item
        .map(
          (r) =>
            `<li><span>${r.ket}</span>` +
            `<time>${formatTanggal(r.t)}</time></li>`
        )
        .join("")
    : `<li class="kosong">Belum ada aktivitas. Yuk mampir ke kedai!</li>`;
}

async function tambahStempel() {
  const m = AmpyangStore.getMember();
  if (!m) return;

  if (AmpyangStore.stempelHariIni(m) >= C.maxStempelPerHari) {
    tampilkanPesan(
      `Batas ${C.maxStempelPerHari} stempel per hari sudah tercapai. Sampai jumpa besok!`
    );
    return;
  }

  const ok = await mintaPinKasir("Tambah Stempel");
  if (!ok) return;

  m.stempel += 1;
  m.totalStempel += 1;
  m.riwayat.push({
    t: new Date().toISOString(),
    tipe: "stempel",
    ket: `Stempel ke-${m.stempel}`,
  });

  if (m.stempel >= C.stampTarget) {
    m.stempel = 0;
    m.rewardTersedia += 1;
    m.riwayat.push({
      t: new Date().toISOString(),
      tipe: "hadiah",
      ket: "Kartu penuh — hadiah didapat!",
    });
    AmpyangStore.saveMember(m);
    render();
    tampilkanPesan(`Selamat, kartumu penuh! Kamu dapat ${C.rewardText}.`);
  } else {
    AmpyangStore.saveMember(m);
    render();
    tampilkanPesan("Stempel ditambahkan. Terima kasih sudah mampir!");
  }
}

async function tukarHadiah() {
  const m = AmpyangStore.getMember();
  if (!m || m.rewardTersedia === 0) return;

  const ok = await mintaPinKasir("Tukar Hadiah");
  if (!ok) return;

  m.rewardTersedia -= 1;
  m.totalReward += 1;
  m.riwayat.push({
    t: new Date().toISOString(),
    tipe: "hadiah",
    ket: `Hadiah ditukar: ${C.rewardText}`,
  });
  AmpyangStore.saveMember(m);
  render();
  tampilkanPesan("Hadiah berhasil ditukar. Selamat menikmati!");
}

function tampilkanPesan(teks) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = teks;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("muncul"), 10);
  setTimeout(() => {
    t.classList.remove("muncul");
    setTimeout(() => t.remove(), 400);
  }, 3500);
}
