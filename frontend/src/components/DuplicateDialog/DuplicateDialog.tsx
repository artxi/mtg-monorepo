import React from 'react';

interface DuplicateDialogProps {
  open: boolean;
  existingCard: any;
  newCard: any;
  onUpdate: () => void;
  onAddSeparate: () => void;
  onCancel: () => void;
}

const DuplicateDialog: React.FC<DuplicateDialogProps> = ({ open, existingCard, newCard, onUpdate, onAddSeparate, onCancel }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 32px #0003', padding: 32, minWidth: 340, maxWidth: 480 }}>
        <h3>Duplicate Detected</h3>
        <p>This card already exists in your collection with the same finish, language, and condition.</p>
        <div style={{ margin: '16px 0' }}>
          <strong>Existing:</strong> Quantity {existingCard.quantity}
          <br />
          <strong>New:</strong> Quantity {newCard.quantity}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onUpdate} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Update Quantity</button>
          <button onClick={onAddSeparate} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Add Separate</button>
          <button onClick={onCancel} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateDialog;
