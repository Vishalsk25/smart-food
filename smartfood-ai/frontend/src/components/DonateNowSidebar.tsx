import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface DonateNowSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  donorId?: string;
  donorName?: string;
}

export default function DonateNowSidebar({ isOpen, onClose, donorId = 'anonymous', donorName = 'Anonymous Donor' }: DonateNowSidebarProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    pickupLocation: '',
    notes: ''
  });
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create payload
    const dId = 'DON-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const token = {
      donationId: dId,
      donorId,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hour expiry
      signature: btoa(dId + donorId + 'secret-salt') // Mock encrypted signature
    };
    
    setDonationId(dId);
    setQrPayload(JSON.stringify(token));
    
    // Save to LocalStorage mock DB
    const allIntents = JSON.parse(localStorage.getItem('donationIntents') || '[]');
    allIntents.push({
      id: dId,
      backendDonationId: dId,
      donorName: donorName,
      foodType: formData.foodName,
      quantityChoice: formData.quantity,
      toLocation: formData.pickupLocation,
      notes: formData.notes,
      status: 'Waiting for Delivery Partner',
      createdAt: new Date().toISOString(),
      qrToken: JSON.stringify(token),
      expiresAt: token.expiresAt
    });
    localStorage.setItem('donationIntents', JSON.stringify(allIntents));
    
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setFormData({ foodName: '', quantity: '', pickupLocation: '', notes: '' });
    setQrPayload(null);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(2px)'
    }}>
      <div className="fade-in" style={{
        width: '100%', maxWidth: '400px', backgroundColor: '#0f172a', borderLeft: '1px solid #1e293b', height: '100%', display: 'flex', flexDirection: 'column', color: '#f8fafc', boxShadow: '-5px 0 25px rgba(0,0,0,0.5)', overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#38bdf8' }}>Donate Food</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        <div style={{ padding: '1.5rem', flex: 1 }}>
          {step === 1 ? (
            <form onSubmit={handleGenerateQR} style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Food Name / Type</label>
                <input 
                  required
                  type="text" 
                  value={formData.foodName}
                  onChange={e => setFormData({...formData, foodName: e.target.value})}
                  placeholder="e.g. Rice and Lentils"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Quantity (Plates / KG)</label>
                <input 
                  required
                  type="text" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  placeholder="e.g. 50 Plates"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Pickup Location</label>
                <input 
                  required
                  type="text" 
                  value={formData.pickupLocation}
                  onChange={e => setFormData({...formData, pickupLocation: e.target.value})}
                  placeholder="Enter address"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Additional Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Optional notes for delivery partner"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', minHeight: '80px' }}
                />
              </div>

              <button 
                type="submit"
                style={{ marginTop: '1rem', width: '100%', padding: '1rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Generate QR Code
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
                Donation Created Successfully!
              </div>

              <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', display: 'inline-block' }}>
                {qrPayload && (
                  <QRCodeSVG 
                    value={qrPayload} 
                    size={200}
                    level="H"
                  />
                )}
              </div>
              
              <div style={{ marginTop: '2rem', textAlign: 'left', width: '100%', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Donation ID</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#38bdf8' }}>{donationId}</div>
                
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem', marginBottom: '0.25rem' }}>Status</div>
                <div style={{ color: '#fbbf24', fontWeight: 500 }}>Waiting for Delivery Partner</div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '2rem', lineHeight: 1.5 }}>
                Please show this QR code to the delivery partner when they arrive. This code will expire in 24 hours.
              </p>

              <button 
                onClick={handleReset}
                style={{ marginTop: '2rem', width: '100%', padding: '1rem', backgroundColor: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Make Another Donation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
