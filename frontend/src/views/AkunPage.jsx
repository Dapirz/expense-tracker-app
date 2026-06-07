import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { getAkun, createAkun, updateAkun, deleteAkun } from '../api/api';

const fmt = (n) => 'Rp ' + Math.abs(n).toLocaleString('id-ID');

const AccountTypeIcon = ({ type }) => {
  if (type === 'Checking') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
    </svg>
  );
  if (type === 'Savings') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/>
    </svg>
  );
  if (type === 'E-Wallet') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.8">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.8">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
    </svg>
  );
};

const AkunPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'Bank Account', institution: '', balance: '' });

  // Fetch data dari API
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAkun();
      setAccounts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data akun');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (showEdit && editTarget) {
        await updateAkun(editTarget.id, form);
        setShowEdit(false);
      } else {
        await createAkun(form);
        setShowAdd(false);
      }
      setForm({ name: '', type: 'Bank Account', institution: '', balance: '' });
      setEditTarget(null);
      await fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan akun');
    }
  };

  const openEdit = (acc) => {
    setEditTarget(acc);
    setForm({ name: acc.name, type: acc.type, institution: acc.institution, balance: acc.balance });
    setShowEdit(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAkun(deleteTarget.id);
      setDeleteTarget(null);
      await fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus akun');
      setDeleteTarget(null);
    }
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Accounts</h1>
        <button className="btn btn-blue" id="add-account-btn" onClick={() => { setForm({ name: '', type: 'Bank Account', institution: '', balance: '' }); setShowAdd(true); }}>
          + Add Account
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#EF4444' }}>
          {error}
        </div>
      )}

      {/* Table card */}
      <div className="card">
        <div className="table-wrapper">
          {/* Header */}
          <div className="table-header-row accounts-table-cols">
            <div>#</div>
            <div>Account Name</div>
            <div>Type</div>
            <div>Institution</div>
            <div style={{ textAlign: 'right' }}>Balance</div>
            <div style={{ textAlign: 'center' }}>Action</div>
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : accounts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada akun. Klik "+ Add Account" untuk menambahkan.</div>
          ) : (
            accounts.map((acc, idx) => (
              <div className="table-data-row accounts-table-cols" key={acc.id}>
                <div className="text-muted">{idx + 1}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="account-icon-circle">
                    <AccountTypeIcon type={acc.type} />
                  </div>
                  <span style={{ fontWeight: 500 }}>{acc.name}</span>
                </div>

                <div className="text-muted" style={{ fontSize: '0.875rem' }}>{acc.type}</div>

                <div className="text-muted" style={{ fontSize: '0.875rem' }}>{acc.institution}</div>

                <div style={{ textAlign: 'right', fontWeight: 700 }} className={acc.balance < 0 ? 'text-red' : ''}>
                  {acc.balance < 0 ? '-' : ''}{fmt(acc.balance)}
                </div>

                <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                  <button className="icon-btn" title="Edit" onClick={() => openEdit(acc)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="icon-btn delete" title="Delete" onClick={() => setDeleteTarget(acc)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Account Modal */}
      <Modal isOpen={showAdd || showEdit} onClose={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); }}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-title-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </span>
            {showEdit ? 'Edit Akun' : 'Tambah Akun Baru'}
          </div>
          <button className="modal-close" onClick={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); }}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Account Name</label>
            <input
              className="form-control"
              placeholder="Contoh: Tabungan Utama"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Bank Account</option>
                <option>Checking</option>
                <option>Savings</option>
                <option>Credit Card</option>
                <option>E-Wallet</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <input
                className="form-control"
                placeholder="BCA, Mandiri, GoPay..."
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Balance (Rupiah)</label>
            <div className="form-control-prefix">
              <span className="form-prefix">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => { setShowAdd(false); setShowEdit(false); setEditTarget(null); }}>
            Batal
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {showEdit ? 'Simpan Perubahan' : 'Simpan Akun'}
          </button>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="delete-modal-content">
          <div className="delete-modal-icon delete-icon-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
            </svg>
          </div>
          <h3 className="delete-modal-title">Delete Account?</h3>
          <p className="delete-modal-desc">
            Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This will erase all history, recurring transfers, and scheduled payments for this account.
          </p>
          <button className="btn btn-danger" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Delete Account
          </button>
          <button className="btn-text-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      </Modal>
    </main>
  );
};

export default AkunPage;
