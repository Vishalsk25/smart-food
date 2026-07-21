import { FormEvent, useState } from 'react';
import AuthShell from '../components/AuthShell';
import LiveMapTracker, { MapLocation } from '../components/LiveMapTracker';

type DonateMeFormState = {
  ashramaName: string;
  peopleCount: string;
  foodPlates: string;
  preferredDate: string;
  preferredTime: string;
  deliveryLocation?: MapLocation;
};

export default function DonateMePage() {
  const [formData, setFormData] = useState<DonateMeFormState>({
    ashramaName: '',
    peopleCount: '',
    foodPlates: '',
    preferredDate: '',
    preferredTime: '',
    deliveryLocation: undefined,
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const storedRequests = JSON.parse(localStorage.getItem('ashramaRequests') || '[]') as DonateMeFormState[];
    localStorage.setItem('ashramaRequests', JSON.stringify([...storedRequests, formData]));
    setStatusMessage('Request submitted successfully. The ashrama request has been saved locally for review.');
  };

  return (
    <AuthShell
      title="Donate Me"
      subtitle="Registered ashramas can request food support by sharing their capacity, plate count, and preferred timing."
      panelTitle="Ashrama request form"
      panelDescription="Enter the ashrama details and the preferred donation schedule."
      switchText="Want to contribute instead?"
      switchLinkText="Donate Now"
      switchTo="/donate-now"
      hideFooter={true}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {statusMessage && <div className="auth-help">{statusMessage}</div>}

        <div className="auth-field">
          <label htmlFor="ashramaName">Ashrama Name</label>
          <input
            id="ashramaName"
            value={formData.ashramaName}
            onChange={(event) => setFormData({ ...formData, ashramaName: event.target.value })}
            placeholder="Enter ashrama name"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="peopleCount">Number of People in the Ashrama</label>
          <input
            id="peopleCount"
            type="number"
            min="1"
            value={formData.peopleCount}
            onChange={(event) => setFormData({ ...formData, peopleCount: event.target.value })}
            placeholder="Enter people count"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="foodPlates">Number of Food Plates to Donate</label>
          <input
            id="foodPlates"
            type="number"
            min="1"
            value={formData.foodPlates}
            onChange={(event) => setFormData({ ...formData, foodPlates: event.target.value })}
            placeholder="Enter food plate count"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="preferredDate">Preferred Donation Date</label>
          <input
            id="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(event) => setFormData({ ...formData, preferredDate: event.target.value })}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="preferredTime">Preferred Donation Time</label>
          <input
            id="preferredTime"
            type="time"
            value={formData.preferredTime}
            onChange={(event) => setFormData({ ...formData, preferredTime: event.target.value })}
            required
          />
        </div>

        <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
          <label>Delivery Location</label>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Click on the map to pin your exact delivery location.</p>
          <LiveMapTracker 
            mode="picker" 
            onLocationSelect={(loc) => setFormData({ ...formData, deliveryLocation: loc })} 
            initialLocation={formData.deliveryLocation} 
            style={{ height: '300px', width: '100%', borderRadius: '12px', border: '1px solid #1e293b' }} 
          />
          {formData.deliveryLocation && (
            <div style={{ marginTop: '0.5rem', color: '#38bdf8', fontSize: '0.9rem' }}>
              Selected: Lat {formData.deliveryLocation.lat.toFixed(4)}, Lng {formData.deliveryLocation.lng.toFixed(4)}
            </div>
          )}
        </div>

        <button className="auth-button" type="submit">
          Submit request
        </button>
      </form>
    </AuthShell>
  );
}