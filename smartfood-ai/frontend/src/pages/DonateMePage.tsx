import { FormEvent, useState } from 'react';
import AuthShell from '../components/AuthShell';

type DonateMeFormState = {
  ashramaName: string;
  peopleCount: string;
  foodPlates: string;
  preferredDate: string;
  preferredTime: string;
};

export default function DonateMePage() {
  const [formData, setFormData] = useState<DonateMeFormState>({
    ashramaName: '',
    peopleCount: '',
    foodPlates: '',
    preferredDate: '',
    preferredTime: '',
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

        <button className="auth-button" type="submit">
          Submit request
        </button>
      </form>
    </AuthShell>
  );
}