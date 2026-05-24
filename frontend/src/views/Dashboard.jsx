import { useState } from 'react';
import Modal from '../components/Modal';

/* ---- initial data ---- */
const initialAccounts = [
  { id: 1, name: 'BCA Primary', type: 'Checking', balance: 8200000 },
  { id: 2, name: 'Mandiri Credit', type: 'Credit Card', balance: -450000 },
  { id: 3, name: 'BNI Savings', type: 'Savings', balance: 4700000 },
];

const initialTransactions = [
  { id: 1, tanggal: 'Oct 24, 2023', catatan: 'Starbucks Coffee', kategori: 'FOOD & DRINK', jumlah: -54000 },
  { id: 2, tanggal: 'Oct 23, 2023', catatan: 'Monthly Salary', kategori: 'INCOME', jumlah: 28000000 },
  { id: 3, tanggal: 'Oct 21, 2023', catatan: 'Netflix Subscription', kategori: 'ENTERTAINMENT', jumlah: -159900 },
  { id: 4, tanggal: 'Oct 19, 2023', catatan: 'Groceries Supermarket', kategori: 'GROCERIES', jumlah: -1245000 },
  { id: 5, tanggal: 'Oct 18, 2023', catatan: 'Uber Ride', kategori: 'TRANSPORT', jumlah: -240000 },
];

const fmt = (n) =>
  'Rp ' + Math.abs(n).toLocaleString('id-ID');

const getBadgeClass = (kategori) => {
  if (kategori === 'INCOME') return 'badge-green';
  if (kategori === 'ENTERTAINMENT') return 'badge-blue';
  if (kategori === 'TRANSPORT') return 'badge-gray';
  return 'badge-red';
};

const AccountIcon = ({ type }) => {
  const icons = {
    Checking: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
      </svg>
    ),
    'Credit Card': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    Savings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  };
  return icons[type] || icons.Checking;
};

const Dashboard = () => {
  const [searchTrx, setSearchTrx] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [newAccount, setNewAccount] = useState({ name: '', type: 'Bank Account', institution: '', balance: '' });

  const totalBalance = 12450000;
  const totalExpense = 3240500;
  const totalIncome = 5800000;

  const filteredTrx = initialTransactions.filter((t) =>
    t.catatan.toLowerCase().includes(searchTrx.toLowerCase()) ||
    t.kategori.toLowerCase().includes(searchTrx.toLowerCase())
  );

  const handleSaveAccount = () => {
    if (!newAccount.name.trim()) return;
    setAccounts([
      ...accounts,
      {
        id: Date.now(),
        name: newAccount.name,
        type: newAccount.type,
        balance: Number(newAccount.balance) || 0,
      },
    ]);
    setNewAccount({ name: '', type: 'Bank Account', institution: '', balance: '' });
    setShowAddAccount(false);
  };

  return (
    <main className="page-container">
      {/* Summary cards */}
      <section className="summary-cards">
        <div className="card summary-card">
          <div className="summary-card-label">
            Total Balance
            <span className="summary-card-icon" style={{ borderColor: 'rgba(96,165,250,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </span>
          </div>
          <div className="summary-card-value" style={{ color: '#F0F6FF' }}>{fmt(totalBalance)}</div>
          <div className="summary-card-trend trend-up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +5.2% from last month
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-card-label">
            Expenses
            <span className="summary-card-icon" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
              </svg>
            </span>
          </div>
          <div className="summary-card-value" style={{ color: '#F0F6FF' }}>{fmt(totalExpense)}</div>
          <div className="summary-card-trend trend-down">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            -1.2% from last month
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-card-label">
            Income
            <span className="summary-card-icon" style={{ borderColor: 'rgba(74,222,128,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
            </span>
          </div>
          <div className="summary-card-value" style={{ color: '#F0F6FF' }}>{fmt(totalIncome)}</div>
          <div className="summary-card-trend trend-up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +8.4% from last month
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="dashboard-main">
        {/* Accounts */}
        <div className="card accounts-card">
          <div className="accounts-card-title">Accounts</div>

          {accounts.map((acc) => (
            <div className="account-item" key={acc.id}>
              <div className="account-info">
                <div className="account-icon-circle">
                  <AccountIcon type={acc.type} />
                </div>
                <div>
                  <div className="account-name">{acc.name}</div>
                  <div className="account-type-label">{acc.type}</div>
                </div>
              </div>
              <div className={`account-balance ${acc.balance < 0 ? 'text-red' : ''}`}>
                {acc.balance < 0 ? '-' : ''}{fmt(acc.balance)}
              </div>
            </div>
          ))}

          <button className="btn-add-account" onClick={() => setShowAddAccount(true)}>
            + Add Account
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="card transactions-card">
          <div className="transactions-card-header">
            <h2 className="transactions-title">Recent Transactions</h2>
            <div className="search-bar">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTrx}
                onChange={(e) => setSearchTrx(e.target.value)}
              />
            </div>
          </div>

          {/* Table header */}
          <div className="table-wrapper">
            <div className="table-header-row transaction-cols">
              <div>DATE</div>
              <div>DESCRIPTION</div>
              <div style={{ textAlign: 'center' }}>CATEGORY</div>
              <div style={{ textAlign: 'right' }}>AMOUNT</div>
            </div>

            {filteredTrx.map((trx) => (
              <div className="table-data-row transaction-cols" key={trx.id}>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>{trx.tanggal}</div>
                <div>{trx.catatan}</div>
                <div style={{ textAlign: 'center' }}>
                  <span className={`badge ${getBadgeClass(trx.kategori)}`}>{trx.kategori}</span>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 600 }} className={trx.jumlah > 0 ? 'text-green' : 'text-red'}>
                  {trx.jumlah > 0 ? '+' : '-'}{fmt(trx.jumlah)}
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-btn">View All Transactions</div>
        </div>
      </section>

      {/* Add Account Modal */}
      <Modal isOpen={showAddAccount} onClose={() => setShowAddAccount(false)}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-title-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </span>
            Tambah Akun Baru
          </div>
          <button className="modal-close" onClick={() => setShowAddAccount(false)}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Account Name</label>
            <input
              className="form-control"
              placeholder="Contoh: Tabungan Utama"
              value={newAccount.name}
              onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select
                className="form-control"
                value={newAccount.type}
                onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
              >
                <option>Bank Account</option>
                <option>Credit Card</option>
                <option>E-Wallet</option>
                <option>Savings</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <input
                className="form-control"
                placeholder="BCA, Mandiri, GoPay..."
                value={newAccount.institution}
                onChange={(e) => setNewAccount({ ...newAccount, institution: e.target.value })}
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
                value={newAccount.balance}
                onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowAddAccount(false)}>
            Batal
          </button>
          <button className="btn btn-primary" onClick={handleSaveAccount}>
            Simpan Akun
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default Dashboard;
