import React, { useState } from 'react';
import { API_BASE_URL } from './config';
import './dietitian.css';

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
    <div className="dietitian-container">
      <div className="dietitian-header">
        <h2>Personalized Diet Plan Generator</h2>
        <p>Fill in your details below to receive a customized nutrition plan that fits your lifestyle and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="dietitian-form">
        <div className="form-group">
          <label htmlFor="weight">Weight</label>
          <div className="measurement-group">
            <input 
              id="weight"
              name="weight" 
              placeholder="Enter your weight" 
              value={formData.weight} 
              onChange={handleChange} 
              required 
            />
            <select name="weightUnit" value={formData.weightUnit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="height">Height</label>
          <div className="measurement-group">
            <input 
              id="height"
              name="height" 
              placeholder="Enter your height" 
              value={formData.height} 
              onChange={handleChange} 
              required 
            />
            <select name="heightUnit" value={formData.heightUnit} onChange={handleChange}>
              <option value="m">meters</option>
              <option value="in">inches</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="wakeUpTime">Wake Up Time</label>
          <input 
            id="wakeUpTime"
            name="wakeUpTime" 
            placeholder="e.g. 7:00 AM" 
            value={formData.wakeUpTime} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="workStartTime">Work Start Time</label>
          <input 
            id="workStartTime"
            name="workStartTime" 
            placeholder="e.g. 9:00 AM" 
            value={formData.workStartTime} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="workEndTime">Work End Time</label>
          <input 
            id="workEndTime"
            name="workEndTime" 
            placeholder="e.g. 5:00 PM" 
            value={formData.workEndTime} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Diet Preferences</label>
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="vegetarian"
              name="vegetarian" 
              checked={formData.vegetarian} 
              onChange={handleChange} 
            />
            <label htmlFor="vegetarian">Vegetarian</label>
          </div>
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="nonVegetarian"
              name="nonVegetarian" 
              checked={formData.nonVegetarian} 
              onChange={handleChange} 
            />
            <label htmlFor="nonVegetarian">Non-Vegetarian</label>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="schedule">Daily Schedule</label>
          <textarea 
            id="schedule"
            name="schedule" 
            placeholder="Briefly describe your typical daily activities" 
            value={formData.schedule} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="restrictions">Dietary Restrictions</label>
          <input 
            id="restrictions"
            name="restrictions" 
            placeholder="List any allergies or restrictions (comma-separated)" 
            value={formData.restrictions} 
            onChange={handleChange} 
          />
        </div>

        <button 
          className="submit-button" 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Generating Plan...
            </>
          ) : 'Generate Diet Plan'}
        </button>
      </form>

      {plan && (
        <div className="plan-result">
          <h3>Your Personalized Diet Plan</h3>
          <div className="plan-content">{plan}</div>
        </div>
      )}
    </div>
  );
}

export default Dietitian;