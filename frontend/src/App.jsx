import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import TransaksiPage from './views/TransaksiPage';
import KategoriPage from './views/KategoriPage';
import AkunPage from './views/AkunPage';
import TeamProfile from './views/TeamProfile';
import './App.css';

const Footer = () => (
  <footer className="site-footer">
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
      <span className="footer-brand">Money Expense Tracker</span>
      <span className="footer-copy">© 2024 Money Expense Tracker. Designed for financial clarity.</span>
    </div>
    <nav className="footer-links">
      <a href="#" className="footer-link">Privacy Policy</a>
      <a href="#" className="footer-link">Terms of Service</a>
      <a href="#" className="footer-link">Help Center</a>
      <a href="#" className="footer-link">Feedback</a>
    </nav>
  </footer>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transaksi" element={<TransaksiPage />} />
          <Route path="/kategori" element={<KategoriPage />} />
          <Route path="/akun" element={<AkunPage />} />
          <Route path="/profil" element={<TeamProfile />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
