import React from 'react';
import { useAuth } from '../auth/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  return (
    <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eee', marginBottom: 24 }}>
      <button onClick={() => onNavigate('home')} disabled={currentPage === 'home'}>Home</button>
      {user && <button onClick={() => onNavigate('collection')} disabled={currentPage === 'collection'}>Collection</button>}
      {!user && <button onClick={() => onNavigate('login')} disabled={currentPage === 'login'}>Login</button>}
      {user && <button onClick={() => onNavigate('profile')} disabled={currentPage === 'profile'}>Profile</button>}
      {user && <button onClick={logout}>Logout</button>}
    </nav>
  );
};

export default Navbar;
