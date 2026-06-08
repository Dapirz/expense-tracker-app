import api from './index';

// ============================================================
// AKUN (Accounts)
// Backend fields: id, nama, tipe, institusi, saldo
// Frontend fields: id, name, type, institution, balance
// ============================================================

const mapAkunFromBackend = (akun) => ({
  id: akun.id,
  name: akun.nama,
  type: akun.tipe,
  institution: akun.institusi,
  balance: akun.saldo,
});

const mapAkunToBackend = (akun) => ({
  nama: akun.name,
  tipe: akun.type,
  institusi: akun.institution,
  saldo: Number(akun.balance) || 0,
});

export const getAkun = async () => {
  const res = await api.get('/akun');
  return res.data.map(mapAkunFromBackend);
};

export const getAkunById = async (id) => {
  const res = await api.get(`/akun/${id}`);
  return mapAkunFromBackend(res.data);
};

export const createAkun = async (data) => {
  const res = await api.post('/akun', mapAkunToBackend(data));
  return res.data;
};

export const updateAkun = async (id, data) => {
  const res = await api.put(`/akun/${id}`, mapAkunToBackend(data));
  return res.data;
};

export const deleteAkun = async (id) => {
  const res = await api.delete(`/akun/${id}`);
  return res.data;
};

// ============================================================
// KATEGORI (Categories)
// Backend fields: id, nama, jenis
// Frontend fields: id, name, jenis
// ============================================================

const mapKategoriFromBackend = (kat) => ({
  id: kat.id,
  name: kat.nama,
  jenis: kat.jenis,
  icon: kat.icon || '🏷️',
});

const mapKategoriToBackend = (kat) => ({
  nama: kat.name,
  jenis: kat.jenis,
  icon: kat.icon || '🏷️',
});

export const getKategori = async () => {
  const res = await api.get('/kategori');
  return res.data.map(mapKategoriFromBackend);
};

export const createKategori = async (data) => {
  const res = await api.post('/kategori', mapKategoriToBackend(data));
  return res.data;
};

export const updateKategori = async (id, data) => {
  const res = await api.put(`/kategori/${id}`, mapKategoriToBackend(data));
  return res.data;
};

export const deleteKategori = async (id) => {
  const res = await api.delete(`/kategori/${id}`);
  return res.data;
};

// ============================================================
// TRANSAKSI (Transactions)
// Backend fields: id, akun_id, kategori_id, jumlah, tanggal, catatan
// Frontend uses same field names as backend (no mapping needed)
// ============================================================

export const getTransaksi = async () => {
  const res = await api.get('/transaksi');
  return res.data;
};

export const createTransaksi = async (data) => {
  const res = await api.post('/transaksi', data);
  return res.data;
};

export const updateTransaksi = async (id, data) => {
  const res = await api.put(`/transaksi/${id}`, data);
  return res.data;
};

export const deleteTransaksi = async (id) => {
  const res = await api.delete(`/transaksi/${id}`);
  return res.data;
};
