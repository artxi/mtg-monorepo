// src/api/collection.ts
// Handles collection API requests

const API_BASE = process.env.REACT_APP_API_URL;

export async function getCollection(token: string) {
  const res = await fetch(`${API_BASE}/collection`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch collection');
  return res.json();
}

export async function addCollectionCard(token: string, card: any) {
  const res = await fetch(`${API_BASE}/collection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to add card');
  return res.json();
}

export async function updateCollectionCard(token: string, id: string, updates: any) {
  const res = await fetch(`${API_BASE}/collection/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update card');
  return res.json();
}

export async function deleteCollectionCard(token: string, id: string) {
  const res = await fetch(`${API_BASE}/collection/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete card');
  return res.json();
}
