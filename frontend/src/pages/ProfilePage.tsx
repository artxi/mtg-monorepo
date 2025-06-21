import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

function splitDisplayName(displayName: string) {
  const match = displayName.match(/^(.*)#(\d{4})$/);
  if (match) return { name: match[1], number: match[2] };
  return { name: displayName, number: '' };
}

const initialFormState = (user: any) => {
  const { name, number } = splitDisplayName(user?.displayName || '');
  return {
    email: user?.email || '',
    name,
    number,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
};

const ProfilePage: React.FC = () => {
  const { user, updateProfile, getRandomDisplayName } = useAuth();
  const [form, setForm] = useState(initialFormState(user));
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    const updateData: any = { email: form.email, displayName: form.name };
    if (form.newPassword) {
      updateData.password = form.newPassword;
      updateData.currentPassword = form.currentPassword;
    }
    const result = await updateProfile(updateData);
    setMessage(result?.message || 'Profile updated!');
    setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleRandomName = async () => {
    const random = await getRandomDisplayName();
    const { name: randName, number: randNumber } = splitDisplayName(random);
    setForm(f => ({ ...f, name: randName, number: randNumber }));
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>Email:<br />
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
        </label>
        <label>Display Name:<br />
          <div style={{ display: 'flex', gap: 8 }}>
            <input name="name" value={form.name} onChange={handleChange} style={{ flex: 2 }} />
            <span style={{ alignSelf: 'center' }}>#</span>
            <input name="number" value={form.number} disabled style={{ width: 60, textAlign: 'center', background: '#eee' }} />
            <button type="button" onClick={handleRandomName} style={{ marginLeft: 8 }}>Random MTG Name</button>
          </div>
        </label>
        <label>Current Password:<br />
          <input name="currentPassword" value={form.currentPassword} onChange={handleChange} type="password" minLength={8} />
        </label>
        <label>New Password:<br />
          <input name="newPassword" value={form.newPassword} onChange={handleChange} type="password" minLength={8} />
        </label>
        <label>Confirm New Password:<br />
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" minLength={8} />
        </label>
        <button type="submit">Update Profile</button>
      </form>
      {message && <div style={{ marginTop: 12, color: 'green' }}>{message}</div>}
    </div>
  );
};

export default ProfilePage;
