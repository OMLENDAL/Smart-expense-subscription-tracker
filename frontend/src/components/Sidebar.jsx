// This component shows the main left navigation for the app.
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen = false, onNavigate = () => {} }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/expenses', label: 'Expenses' },
    { to: '/subscriptions', label: 'Subscriptions' },
    { to: '/budgets', label: 'Budgets' },
    { to: '/reports', label: 'Reports' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <aside id="main-navigation" className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
      <div className="brand"><span className="brand-mark">₹</span><span>pennywise<span className="brand-period">.</span></span></div>
      <p className="sidebar-label">WORKSPACE</p>
      <nav>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <span className={`nav-mark nav-mark-${item.label.toLowerCase()}`} aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
