import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { getTransaksi, createTransaksi, updateTransaksi, deleteTransaksi } from '../api/api';
import { getKategori } from '../api/api';
import { getAkun } from '../api/api';

const ITEMS_PER_PAGE = 5;

const fmt = (n) => 'Rp ' + Math.abs(n).toLocaleString('id-ID');

const getCategoryBadge = (jenis) => {
  if (jenis === 'pemasukan') return 'badge-green';
  return 'badge-red';
};

const TransaksiPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  /* Add modal */
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ jumlah: '', kategori_id: '', akun_id: '', tanggal: '', catatan: '' });

  /* Edit modal */
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  /* Delete modal */
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Helper: get category/account name by ID
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : '-';
  };
  const getCategoryJenis = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.jenis : 'pengeluaran';
  };
  const getAccountName = (id) => {
    const acc = accounts.find(a => a.id === id);
    return acc ? acc.name : '-';
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [trxData, katData, akunData] = await Promise.all([
        getTransaksi(),
        getKategori(),
        getAkun(),
      ]);
      setTransactions(trxData);
      setCategories(katData);
      setAccounts(akunData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Searching
  const filtered = transactions.filter((t) => {
    const catName = getCategoryName(t.kategori_id).toLowerCase();
    const accName = getAccountName(t.akun_id).toLowerCase();
    const s = search.toLowerCase();
    return (
      (t.catatan || '').toLowerCase().includes(s) ||
      catName.includes(s) ||
      accName.includes(s)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* stats */
  const totalIncome = transactions.reduce((s, t) => {
    const jenis = getCategoryJenis(t.kategori_id);
    return jenis === 'pemasukan' ? s + t.jumlah : s;
  }, 0);
  const totalExpense = transactions.reduce((s, t) => {
    const jenis = getCategoryJenis(t.kategori_id);
    return jenis === 'pengeluaran' ? s + t.jumlah : s;
  }, 0);
  const balance = totalIncome - totalExpense;

  const resetForm = () => {
    setForm({ jumlah: '', kategori_id: '', akun_id: '', tanggal: '', catatan: '' });
  };

  const handleSave = async () => {
    if (!form.jumlah || !form.tanggal || !form.akun_id || !form.kategori_id) {
      alert('Amount, date, account, and category are required!');
      return;
    }
    try {
      const payload = {
        akun_id: Number(form.akun_id),
        kategori_id: Number(form.kategori_id),
        jumlah: Math.abs(Number(form.jumlah)),
        tanggal: form.tanggal,
        catatan: form.catatan || '',
      };

      if (showEdit && editTarget) {
        await updateTransaksi(editTarget.id, payload);
        setShowEdit(false);
      } else {
        await createTransaksi(payload);
        setShowAdd(false);
      }
      resetForm();
      setEditTarget(null);
      setPage(1);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  const openEdit = (trx) => {
    setEditTarget(trx);
    setForm({
      jumlah: trx.jumlah,
      kategori_id: trx.kategori_id,
      akun_id: trx.akun_id,
      tanggal: trx.tanggal,
      catatan: trx.catatan,
    });
    setShowEdit(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTransaksi(deleteTarget.id);
      setDeleteTarget(null);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete transaction');
      setDeleteTarget(null);
    }
  };

  const pageNumbers = () => {
    const nums = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
      if (page < totalPages - 2) nums.push('...');
      nums.push(totalPages);
    }
    return nums;
  };

  return (
    <main className="page-container">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
        </div>
        <button className="btn btn-blue" id="add-transaction-btn" onClick={() => { resetForm(); setShowAdd(true); }}>
          + Add Transaction
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#EF4444' }}>
          {error}
        </div>
      )}

      {/* Summary cards */}
      <section className="summary-cards" style={{ marginBottom: '1.5rem' }}>
        <div className="card summary-card">
          <div className="summary-card-label">Total Income</div>
          <div className="summary-card-value text-green">{fmt(totalIncome)}</div>
          <div className="summary-card-trend trend-up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Income
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-card-label">Total Expense</div>
          <div className="summary-card-value text-red">{fmt(totalExpense)}</div>
          <div className="summary-card-trend trend-down">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            Expenses
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-card-label">Balance</div>
          <div className="summary-card-value" style={{ color: '#60A5FA' }}>{fmt(balance)}</div>
          <div className="summary-card-trend" style={{ color: 'var(--text-muted)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Balance
          </div>
        </div>
      </section>

      {/* Table card */}
      <div className="card">
        {/* Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          {/* Header */}
          <div className="table-header-row transaksi-cols" style={{ paddingLeft: '2rem' }}>
            <div>DATE</div>
            <div>DESCRIPTION</div>
            <div>CATEGORY</div>
            <div>ACCOUNT</div>
            <div style={{ textAlign: 'right' }}>AMOUNT</div>
            <div style={{ textAlign: 'center' }}>ACTION</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              {transactions.length === 0 ? 'No transactions yet.' : 'No transactions found.'}
            </div>
          ) : (
            paginated.map((trx) => {
              const jenis = getCategoryJenis(trx.kategori_id);
              const isIncome = jenis === 'pemasukan';
              return (
                <div className="table-data-row transaksi-cols" key={trx.id} style={{ paddingLeft: '2rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{trx.tanggal}</div>
                  <div style={{ fontWeight: 500 }}>{trx.catatan || '-'}</div>
                  <div>
                    <span className={`badge ${getCategoryBadge(jenis)}`}>{getCategoryName(trx.kategori_id)}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{getAccountName(trx.akun_id)}</div>
                  <div style={{ textAlign: 'right', fontWeight: 700 }} className={isIncome ? 'text-green' : 'text-red'}>
                    {isIncome ? '+ ' : '- '}{fmt(trx.jumlah)}
                  </div>
                  <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(trx)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="icon-btn delete" title="Delete" onClick={() => setDeleteTarget(trx)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="pagination-bar">
            <span className="pagination-info">Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries</span>
            <div className="pagination-controls">
              <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              {pageNumbers().map((n, i) =>
                n === '...'
                  ? <span key={`ellipsis-${i}`} className="page-ellipsis">...</span>
                  : <button key={n} className={`page-btn ${page === n ? 'page-btn-active' : ''}`} onClick={() => setPage(n)}>{n}</button>
              )}
              <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      <Modal isOpen={showAdd || showEdit} onClose={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); resetForm(); }}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-title-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </span>
            {showEdit ? 'Edit Transaction' : 'Add Transaction'}
          </div>
          <button className="modal-close" onClick={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); resetForm(); }}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Amount (Rp)</label>
            <div className="form-control-prefix">
              <span className="form-prefix">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.kategori_id} onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.jenis})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Account</label>
              <select className="form-control" value={form.akun_id} onChange={(e) => setForm({ ...form, akun_id: e.target.value })}>
                <option value="">Select account</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="What was this for?"
              rows={3}
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {showEdit ? 'Update Transaction' : 'Save Transaction'}
          </button>
          <button className="btn btn-secondary" onClick={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); resetForm(); }}>Cancel</button>
        </div>
      </Modal>

      {/* Delete Transaction Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="delete-modal-content">
          <div className="delete-modal-icon delete-icon-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <h3 className="delete-modal-title">Delete Transaction?</h3>
          <p className="delete-modal-desc">
            Are you sure you want to delete this transaction: <strong>"{deleteTarget?.catatan} - {deleteTarget ? fmt(deleteTarget.jumlah) : ''}"</strong>? This action will permanently remove the record and adjust your balance.
          </p>
          <button className="btn btn-danger" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
            Delete Transaction
          </button>
          <button className="btn-text-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      </Modal>
    </main>
  );
};

export default TransaksiPage;
