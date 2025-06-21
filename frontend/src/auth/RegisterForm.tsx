import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

// DEV-ONLY: random email/password generation for fast testing
// Remove before production release
function getRandomEmail() {
  const user = Math.random().toString(36).substring(2, 10);
  return `${user}@example.com`;
}

// DEV-ONLY: random email/password generation for fast testing
// Remove before production release
function getRandomPassword() {
  // At least 8 chars, upper, lower, number, special
  const specials = '!@#$%^&*';
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return (
    lowers[Math.floor(Math.random() * lowers.length)] +
    uppers[Math.floor(Math.random() * uppers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    specials[Math.floor(Math.random() * specials.length)] +
    Math.random().toString(36).substring(2, 8)
  );
}

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // DEV-ONLY: populate with random credentials for fast testing
    // Remove before production release
    setEmail(getRandomEmail());
    setPassword(getRandomPassword());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>Register</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default RegisterForm;
