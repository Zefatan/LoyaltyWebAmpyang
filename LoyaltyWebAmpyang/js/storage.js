/* ============================================================
   LAPISAN DATA (Storage Adapter)
   Fase 1: data member disimpan di HP pelanggan (localStorage).
   HP pelanggan = kartu member-nya.

   Fase 2 (roadmap): ganti isi fungsi-fungsi di bawah dengan
   Firebase/Supabase tanpa mengubah halaman lain — semua halaman
   hanya bicara lewat AmpyangStore, tidak langsung ke localStorage.
   ============================================================ */

const AmpyangStore = (() => {
  const KEY = "ampyang_member_v1";

  function getMember() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveMember(member) {
    localStorage.setItem(KEY, JSON.stringify(member));
    return member;
  }

  function createMember(nama, telepon) {
    const member = {
      memberId: "AMP-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      nama: nama.trim(),
      telepon: (telepon || "").trim(),
      dibuat: new Date().toISOString(),
      stempel: 0,          // stempel di kartu yang sedang berjalan
      totalStempel: 0,     // total sepanjang masa (bahan tier di masa depan)
      rewardTersedia: 0,   // hadiah yang belum ditukar
      totalReward: 0,
      riwayat: [],         // {t: ISO, tipe: "stempel"|"hadiah", ket: string}
    };
    return saveMember(member);
  }

  function resetMember() {
    localStorage.removeItem(KEY);
  }

  // Jumlah stempel yang sudah didapat member hari ini (untuk batas harian)
  function stempelHariIni(member) {
    const today = new Date().toDateString();
    return member.riwayat.filter(
      (r) => r.tipe === "stempel" && new Date(r.t).toDateString() === today
    ).length;
  }

  return { getMember, saveMember, createMember, resetMember, stempelHariIni };
})();
