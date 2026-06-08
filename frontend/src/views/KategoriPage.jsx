import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { getKategori, createKategori, updateKategori, deleteKategori } from '../api/api';

const COLOR_MAP = {
  'pengeluaran': { color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  'pemasukan': { color: '#4ADE80', bg: 'rgba(74,222,128,0.15)' },
};

const KategoriPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ name: '', jenis: 'pengeluaran', icon: '🏷️' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKategori();
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (showEdit && editTarget) {
        await updateKategori(editTarget.id, form);
        setShowEdit(false);
      } else {
        await createKategori(form);
        setShowAdd(false);
      }
      setForm({ name: '', jenis: 'pengeluaran', icon: '🏷️' });
      setEditTarget(null);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const openEdit = (cat) => {
    setEditTarget(cat);
    setForm({ name: cat.name, jenis: cat.jenis, icon: cat.icon || '🏷️' });
    setShowEdit(true);
  };

  const handleDelete = async () => {
    try {
      await deleteKategori(deleteTarget.id);
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
      setDeleteTarget(null);
    }
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Categories</h1>
          <p className="page-subtitle">Organize your expenses and income with tidy categories.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-blue" id="add-category-btn" onClick={() => { setForm({ name: '', jenis: 'pengeluaran', icon: '🏷️' }); setShowAdd(true); }}>
            + Add Category
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#EF4444' }}>
          {error}
        </div>
      )}

      {/* Category grid */}
      <div className="category-grid">
        {loading ? (
          <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {categories.length === 0 ? 'No categories yet. Click "+ Add Category" to get started.' : 'No categories found.'}
          </div>
        ) : (
          filtered.map((cat) => {
            const colors = COLOR_MAP[cat.jenis] || COLOR_MAP['pengeluaran'];
            return (
              <div className="category-card" key={cat.id}>
                <div className="category-card-header">
                  <div className="category-icon-box" style={{ background: colors.bg }}>
                    <span style={{ fontSize: '1.3rem' }}>{cat.icon || '🏷️'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="cat-menu-btn" onClick={() => openEdit(cat)} title="Edit category">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="cat-menu-btn" onClick={() => setDeleteTarget(cat)} title="Delete category">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">
                  <span className={`badge ${cat.jenis === 'pemasukan' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                    {cat.jenis === 'pemasukan' ? 'Income' : 'Expense'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal isOpen={showAdd || showEdit} onClose={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); }}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-title-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <path d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0-4-4L4 16v4z"/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"/>
              </svg>
            </span>
            {showEdit ? 'Edit Category' : 'Add Category'}
          </div>
          <button className="modal-close" onClick={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); }}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              className="form-control"
              placeholder="e.g. Food, Transport, Salary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })}>
                <option value="pengeluaran">Expense</option>
                <option value="pemasukan">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Icon (Emoji)</label>
              <input
                className="form-control"
                placeholder="🏷️"
                value={form.icon}
                onChange={(e) => {
                  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
                  const segments = [...segmenter.segment(e.target.value)];
                  setForm({ ...form, icon: segments.length > 0 ? segments[segments.length - 1].segment : '' });
                }}
                style={{ fontSize: '1.25rem', textAlign: 'center' }}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); }}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {showEdit ? 'Save Changes' : 'Save Category'}
          </button>
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
            Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? Categories that are still used by transactions cannot be deleted.
          </p>
          <button className="btn btn-danger" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10"/>
              <circle cx="17" cy="17" r="4"/><line x1="15" y1="15" x2="19" y2="19"/>
            </svg>
            Delete Category
          </button>
          <button className="btn-text-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      </Modal>
    </main>
  );
};

export default KategoriPage;
