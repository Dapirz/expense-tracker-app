import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, tanggal: 'Oct 24, 2023', catatan: 'Starbucks Coffee', kategori: 'FOOD & DRINK', jumlah: -54000 },
    { id: 2, tanggal: 'Oct 23, 2023', catatan: 'Monthly Salary', kategori: 'INCOME', jumlah: 28000000 },
    { id: 3, tanggal: 'Oct 21, 2023', catatan: 'Netflix Subscription', kategori: 'ENTERTAINMENT', jumlah: -159900 },
  ]);

  // If you want to fetch from backend in the future:
  /*
  useEffect(() => {
    axios.get('http://localhost:5000/api/transaksi')
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);
  */

  return (
    <main className="dashboard-container">
      {/* SUMMARY CARDS */}
      <section className="summary-cards">
        <div className="card summary-card">
          <div className="summary-label">Total Balance</div>
          <div className="summary-value text-blue">Rp 12.450.000</div>
        </div>
        <div className="card summary-card">
          <div className="summary-label">Total Expense</div>
          <div className="summary-value text-red">Rp 3.240.500</div>
        </div>
        <div className="card summary-card">
          <div className="summary-label">Total Income</div>
          <div className="summary-value text-green">Rp 5.800.000</div>
        </div>
      </section>

      <section className="dashboard-main">
        {/* ACCOUNTS LIST */}
        <div className="left-column">
          <div className="card accounts-card">
            <h2 className="card-title">Accounts</h2>
            
            <div className="account-item">
              <div className="account-info">
                <div className="account-icon">🏦</div>
                <div>
                  <div className="account-name">BCA Primary</div>
                  <div className="account-type">Checking</div>
                </div>
              </div>
              <div className="account-balance text-blue">Rp 8.200.000</div>
            </div>

            <div className="account-item">
              <div className="account-info">
                <div className="account-icon">💳</div>
                <div>
                  <div className="account-name">Mandiri Credit</div>
                  <div className="account-type">Credit Card</div>
                </div>
              </div>
              <div className="account-balance text-red">-Rp 450.000</div>
            </div>

            <div className="account-item">
              <div className="account-info">
                <div className="account-icon">💰</div>
                <div>
                  <div className="account-name">BNI Savings</div>
                  <div className="account-type">Savings</div>
                </div>
              </div>
              <div className="account-balance text-blue">Rp 4.700.000</div>
            </div>

            <button className="btn-add-account">+ Add Account</button>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="right-column">
          <div className="card h-full">
            <div className="transactions-header">
              <h2 className="transactions-title">Recent Transactions</h2>
              <div className="search-bar">
                <span>🔍</span>
                <input type="text" placeholder="Search transactions..." />
              </div>
            </div>

            <div className="table-header">
              <div>DATE</div>
              <div>DESCRIPTION</div>
              <div style={{textAlign: 'center'}}>CATEGORY</div>
              <div className="amount-right">AMOUNT</div>
            </div>

            <div className="transactions-list">
              {transactions.map((trx) => (
                <div className="transaction-row" key={trx.id}>
                  <div>{trx.tanggal}</div>
                  <div style={{color: 'var(--text-main)'}}>{trx.catatan}</div>
                  <div style={{textAlign: 'center'}}>
                    <span className={`badge ${trx.jumlah > 0 ? 'badge-green' : trx.kategori === 'ENTERTAINMENT' ? 'badge-blue' : 'badge-red'}`}>
                      {trx.kategori}
                    </span>
                  </div>
                  <div className={`amount-right ${trx.jumlah > 0 ? 'text-green' : 'text-main'}`}>
                    {trx.jumlah > 0 ? '+' : '-'}Rp {Math.abs(trx.jumlah).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all">
              View All Transactions
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
