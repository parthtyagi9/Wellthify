import React, { useState } from 'react';
import { API_BASE_URL } from './config';

function Dietitian() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    weightUnit: 'kg',
    heightUnit: 'm',
    wakeUpTime: '',
    workStartTime: '',
    workEndTime: '',
    schedule: '',
    vegetarian: false,
    nonVegetarian: false,
    restrictions: ''
  });

  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/dietplan/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setPlan(data.nutritionPlan || 'No plan returned');
    } catch (err) {
      console.error('Error:', err);
      setPlan('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>🧠 Personalized Diet Plan Generator</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} required />
        <input name="height" placeholder="Height" value={formData.height} onChange={handleChange} required />

        <select name="weightUnit" value={formData.weightUnit} onChange={handleChange}>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>

        <select name="heightUnit" value={formData.heightUnit} onChange={handleChange}>
          <option value="m">meters</option>
          <option value="in">inches</option>
        </select>

        <input name="wakeUpTime" placeholder="Wake Up Time (e.g. 7:00 AM)" value={formData.wakeUpTime} onChange={handleChange} required />
        <input name="workStartTime" placeholder="Work Start Time" value={formData.workStartTime} onChange={handleChange} required />
        <input name="workEndTime" placeholder="Work End Time" value={formData.workEndTime} onChange={handleChange} required />
        <textarea name="schedule" placeholder="Daily Schedule" value={formData.schedule} onChange={handleChange} />

        <label>
          <input type="checkbox" name="vegetarian" checked={formData.vegetarian} onChange={handleChange} />
          Vegetarian
        </label>

        <label>
          <input type="checkbox" name="nonVegetarian" checked={formData.nonVegetarian} onChange={handleChange} />
          Non-Vegetarian
        </label>

        <input name="restrictions" placeholder="Dietary Restrictions (comma-separated)" value={formData.restrictions} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>

      {plan && (
        <div style={styles.result}>
          <h3>Your Plan:</h3>
          <pre>{plan}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '600px',
    margin: 'auto',
    fontFamily: 'Arial'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  result: {
    background: '#f4f4f4',
    padding: '20px',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap'
  }
};

export default Dietitian;
