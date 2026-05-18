import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">E</div>
        <span>Money Expense Tracker</span>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="#" className="nav-link">
          Transactions
        </Link>
        <Link to="#" className="nav-link">
          Categories
        </Link>
        <Link to="#" className="nav-link">
          Accounts
        </Link>
        <Link to="/profil" className={`nav-link ${location.pathname === '/profil' ? 'active' : ''}`}>
          Team Profile
        </Link>
      </div>

      <div className="navbar-actions">
        <span className="action-icon">🔔</span>
        <span className="action-icon">👤</span>
      </div>
    </nav>
  );
};

export default Navbar;
