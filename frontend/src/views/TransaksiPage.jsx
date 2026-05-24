import { useState } from 'react';
import Modal from '../components/Modal';

/* ---- mock data ---- */
const ALL_TRANSACTIONS = [
  { id: 1, tanggal: 'Oct 24, 2024', catatan: 'Grocery Run - Superindo', kategori: 'Food', akun: 'BCA Utama', jumlah: -450000 },
  { id: 2, tanggal: 'Oct 22, 2024', catatan: 'Freelance Web Design', kategori: 'Income', akun: 'Mandiri Bisnis', jumlah: 3500000 },
  { id: 3, tanggal: 'Oct 20, 2024', catatan: 'Netflix Subscription', kategori: 'Entertainment', akun: 'Credit Card', jumlah: -186000 },
  { id: 4, tanggal: 'Oct 18, 2024', catatan: 'Pertamina Gas', kategori: 'Transport', akun: 'BCA Utama', jumlah: -300000 },
  { id: 5, tanggal: 'Oct 15, 2024', catatan: 'Monthly Salary', kategori: 'Income', akun: 'BCA Utama', jumlah: 12000000 },
  { id: 6, tanggal: 'Oct 12, 2024', catatan: 'Indomaret', kategori: 'Food', akun: 'GoPay', jumlah: -87500 },
  { id: 7, tanggal: 'Oct 10, 2024', catatan: 'Spotify Premium', kategori: 'Entertainment', akun: 'Credit Card', jumlah: -54990 },
];

const ITEMS_PER_PAGE = 5;

const fmt = (n) => 'Rp ' + Math.abs(n).toLocaleString('id-ID');

const getCategoryBadge = (kat) => {
  const map = {
    Income: 'badge-green',
    Food: 'badge-red',
    Entertainment: 'badge-blue',
    Transport: 'badge-gray',
    Groceries: 'badge-orange',
  };
  return map[kat] || 'badge-gray';
};

const CATEGORIES = ['Food', 'Income', 'Entertainment', 'Transport', 'Groceries', 'Shopping', 'Health'];
const ACCOUNTS = ['BCA Utama', 'Mandiri Bisnis', 'Credit Card', 'GoPay', 'OVO'];

const TransaksiPage = () => {
  const [transactions, setTransactions] = useState(ALL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  /* Add modal */
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ jumlah: '', kategori: '', akun: '', tanggal: '', catatan: '' });

  /* Delete modal */
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = transactions.filter(
    (t) =>
      t.catatan.toLowerCase().includes(search.toLowerCase()) ||
      t.kategori.toLowerCase().includes(search.toLowerCase()) ||
      t.akun.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* stats */
  const totalIncome = transactions.filter((t) => t.jumlah > 0).reduce((s, t) => s + t.jumlah, 0);
  const totalExpense = transactions.filter((t) => t.jumlah < 0).reduce((s, t) => s + t.jumlah, 0);
  const balance = totalIncome + totalExpense;

  const handleSave = () => {
    if (!form.jumlah || !form.tanggal) return;
    setTransactions([
      {
        id: Date.now(),
        tanggal: new Date(form.tanggal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        catatan: form.catatan || 'Transaction',
        kategori: form.kategori || 'Other',
        akun: form.akun || 'BCA Utama',
        jumlah: Number(form.jumlah),
      },
      ...transactions,
    ]);
    setForm({ jumlah: '', kategori: '', akun: '', tanggal: '', catatan: '' });
    setShowAdd(false);
    setPage(1);
  };

  const handleDelete = () => {
    setTransactions(transactions.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
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
        <button className="btn btn-blue" id="add-transaction-btn" onClick={() => setShowAdd(true)}>
          + Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <section className="summary-cards" style={{ marginBottom: '1.5rem' }}>
        <div className="card summary-card">
          <div className="summary-card-label">Total Income</div>
          <div className="summary-card-value text-green">{fmt(totalIncome)}</div>
          <div className="summary-card-trend trend-up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +5% vs last month
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-card-label">Total Expense</div>
          <div className="summary-card-value text-red">{fmt(totalExpense)}</div>
          <div className="summary-card-trend trend-down">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            -2% vs last month
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-card-label">Balance</div>
          <div className="summary-card-value" style={{ color: '#60A5FA' }}>{fmt(balance)}</div>
          <div className="summary-card-trend" style={{ color: 'var(--text-muted)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Available funds
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="card summary-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Filter &amp; Sort</div>
        </div>
      </section>

      {/* Table card */}
      <div className="card">
        {/* Search + download */}
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
          <button className="icon-btn" title="Download CSV" style={{ border: '1px solid var(--border-color)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
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
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</div>
          ) : (
            paginated.map((trx) => (
              <div className="table-data-row transaksi-cols" key={trx.id} style={{ paddingLeft: '2rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{trx.tanggal}</div>
                <div style={{ fontWeight: 500 }}>{trx.catatan}</div>
                <div>
                  <span className={`badge ${getCategoryBadge(trx.kategori)}`}>{trx.kategori}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{trx.akun}</div>
                <div style={{ textAlign: 'right', fontWeight: 700 }} className={trx.jumlah > 0 ? 'text-green' : 'text-red'}>
                  {trx.jumlah > 0 ? '+ ' : '- '}{fmt(trx.jumlah)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
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
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-title-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </span>
            Add Transaction
          </div>
          <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Amount (RP)</label>
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
              <select className="form-control" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Account</label>
              <select className="form-control" value={form.akun} onChange={(e) => setForm({ ...form, akun: e.target.value })}>
                <option value="">Select account</option>
                {ACCOUNTS.map((a) => <option key={a}>{a}</option>)}
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
            Save Transaction
          </button>
          <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
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
