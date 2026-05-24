import { useState } from 'react';
import Modal from '../components/Modal';

const initialCategories = [
  { id: 1, name: 'Belanja', icon: '🛒', color: '#1D4ED8', bg: 'rgba(29,78,216,0.2)', count: 12 },
  { id: 2, name: 'Makanan', icon: '🍽️', color: '#B45309', bg: 'rgba(180,83,9,0.2)', count: 45 },
  { id: 3, name: 'Transportasi', icon: '🚌', color: '#15803D', bg: 'rgba(21,128,61,0.2)', count: 8 },
  { id: 4, name: 'Hiburan', icon: '🎬', color: '#7C3AED', bg: 'rgba(124,58,237,0.2)', count: 6 },
  { id: 5, name: 'Kesehatan', icon: '❤️', color: '#DC2626', bg: 'rgba(220,38,38,0.2)', count: 3 },
  { id: 6, name: 'Pendidikan', icon: '📚', color: '#0891B2', bg: 'rgba(8,145,178,0.2)', count: 2 },
];

const KategoriPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '🏷️' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name.trim()) return;
    setCategories([
      ...categories,
      { id: Date.now(), name: form.name, icon: form.icon, color: '#4ADE80', bg: 'rgba(74,222,128,0.15)', count: 0 },
    ]);
    setForm({ name: '', icon: '🏷️' });
    setShowAdd(false);
  };

  const handleDelete = () => {
    setCategories(categories.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Kategori</h1>
          <p className="page-subtitle">Atur pengeluaran dan pemasukan Anda dengan kategori yang rapi.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Cari kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-blue" id="add-category-btn" onClick={() => setShowAdd(true)}>
            + Tambah Kategori
          </button>
        </div>
      </div>

      {/* Category grid */}
      <div className="category-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Tidak ada kategori ditemukan.
          </div>
        ) : (
          filtered.map((cat) => (
            <div className="category-card" key={cat.id}>
              <div className="category-card-header">
                <div className="category-icon-box" style={{ background: cat.bg }}>
                  <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                </div>
                <div className="cat-menu-wrapper" style={{ position: 'relative' }}>
                  <button className="cat-menu-btn" onClick={() => setDeleteTarget(cat)} title="Hapus kategori">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} Transaksi</div>
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-title-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <path d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0-4-4L4 16v4z"/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"/>
              </svg>
            </span>
            Tambah Kategori
          </div>
          <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nama Kategori</label>
            <input
              className="form-control"
              placeholder="Contoh: Hiburan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ikon (emoji)</label>
            <input
              className="form-control"
              placeholder="🏷️"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Batal</button>
          <button className="btn btn-primary" onClick={handleSave}>Simpan Kategori</button>
        </div>
      </Modal>

      {/* Delete Category Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="delete-modal-content">
          <div className="delete-modal-icon delete-icon-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10"/><circle cx="17" cy="17" r="4"/>
              <line x1="15" y1="15" x2="19" y2="19"/>
            </svg>
          </div>
          <h3 className="delete-modal-title">Delete Category?</h3>
          <p className="delete-modal-desc">
            Are you sure you want to delete the <strong>"{deleteTarget?.name}"</strong> category? All {deleteTarget?.count} transactions associated with this category will become uncategorized.
          </p>
          <button className="btn btn-danger" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10"/>
              <circle cx="17" cy="17" r="4"/><line x1="15" y1="15" x2="19" y2="19"/>
            </svg>
            Delete Category
          </button>
          <button className="btn-text-cancel" onClick={() => setDeleteTarget(null)}>Keep Category</button>
        </div>
      </Modal>
    </main>
  );
};

export default KategoriPage;
