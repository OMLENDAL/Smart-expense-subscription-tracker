// This component renders the top application bar.
import { useAuth } from '../context/AuthContext';

function Navbar({ mobileMenuOpen = false, onMenuClick }) {
  const { user, setUser, setToken } = useAuth();

  const handleLogout = () => {
    setUser(null);
    setToken('');
    window.location.href = '/login';
  };

  return (
    <header className="navbar">
      <button
        type="button"
        className="mobile-menu-button"
        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="main-navigation"
        aria-expanded={mobileMenuOpen}
        onClick={onMenuClick}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="navbar-title"><span className="navbar-title-desktop">Personal Finance Dashboard</span><span className="navbar-title-mobile">Overview</span></div>
      <div className="navbar-user">
        <span className="user-avatar">{(user?.name || 'G').slice(0, 1).toUpperCase()}</span>
        <span className="navbar-user-name">{user?.name || 'Guest'}</span>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </header>
  );
}

export default Navbar;
