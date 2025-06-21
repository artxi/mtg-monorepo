import React, { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import { Navbar } from './components';
import { ProfilePage } from './pages';

function App() {
  const { user } = useAuth();
  const [page, setPage] = useState('home');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  let content;
  if (!user) {
    if (page === 'login') content = (
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: 24 }}>
          <button
            style={{ flex: 1, padding: 12, border: 'none', borderBottom: authTab === 'login' ? '2px solid #1976d2' : 'none', background: 'none', fontWeight: authTab === 'login' ? 'bold' : 'normal', cursor: 'pointer' }}
            onClick={() => setAuthTab('login')}
            disabled={authTab === 'login'}
          >
            Login
          </button>
          <button
            style={{ flex: 1, padding: 12, border: 'none', borderBottom: authTab === 'register' ? '2px solid #1976d2' : 'none', background: 'none', fontWeight: authTab === 'register' ? 'bold' : 'normal', cursor: 'pointer' }}
            onClick={() => setAuthTab('register')}
            disabled={authTab === 'register'}
          >
            Register
          </button>
        </div>
        {authTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    );
    else content = null; // No login/register on homepage
  } else {
    if (page === 'profile') content = <ProfilePage />;
    else content = <div style={{ textAlign: 'center', marginTop: 40 }}><h2>Welcome, {user.displayName || user.email}!</h2></div>;
  }

  return (
    <>
      <Navbar onNavigate={setPage} currentPage={page} />
      <div style={{ maxWidth: 500, margin: '2rem auto' }}>{content}</div>
    </>
  );
}

const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
