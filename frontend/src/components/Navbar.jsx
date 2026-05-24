import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/transaksi', label: 'Transactions' },
    { to: '/kategori', label: 'Categories' },
    { to: '/akun', label: 'Accounts' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="navbar">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="navbar-brand-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <span>Money Expense Tracker</span>
        </div>

        {/* Desktop links */}
        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="action-icon" aria-label="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <button className="action-icon" aria-label="Profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
            <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
          </button>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`mobile-nav-link ${isActive(item.to) ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
