import React, { useState } from 'react';
import { requestStatusChange } from '../../services/api';
import './StatusSelector.css';

const StatusSelector = ({ space, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState(space.status);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 21);
    return minDate.toISOString().split('T')[0];
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!effectiveDate) {
      setError('Please select an effective date');
      return;
    }
    if (selectedStatus === space.status) {
      setError('Please select a different status');
      return;
    }
    try {
      await requestStatusChange(space.id, selectedStatus, effectiveDate);
      setSuccess(true);
      setTimeout(() => { onClose(); }, 2000);
    } catch (err) {
      setError('Failed to request status change');
      console.error(err);
    }
  };

  return (
    <div className="status-selector-overlay" onClick={onClose}>
      <div className="status-selector" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="success-message">
            <h3>Change Requested</h3>
            <p>Your status change request has been submitted.</p>
            <p>An email notification has been sent to locations@repark.at</p>
          </div>
        ) : (
          <>
            <h3>Change Status for P-{space.number}</h3>
            <p className="current-status">
              Current Status: <span className={space.status.toLowerCase()}>{space.status}</span>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Status:</label>
                <div className="status-options">
                  <label className={`status-option repark ${selectedStatus === 'REPARK' ? 'selected' : ''}`}>
                    <input type="radio" name="status" value="REPARK" checked={selectedStatus === 'REPARK'} onChange={() => setSelectedStatus('REPARK')} />
                    <span>REPARK</span>
                  </label>
                  <label className={`status-option rented ${selectedStatus === 'RENTED' ? 'selected' : ''}`}>
                    <input type="radio" name="status" value="RENTED" checked={selectedStatus === 'RENTED'} onChange={() => setSelectedStatus('RENTED')} />
                    <span>RENTED</span>
                  </label>
                  <label className={`status-option free ${selectedStatus === 'FREE' ? 'selected' : ''}`}>
                    <input type="radio" name="status" value="FREE" checked={selectedStatus === 'FREE'} onChange={() => setSelectedStatus('FREE')} />
                    <span>FREE</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="effectiveDate">Effective Date:</label>
                <input type="date" id="effectiveDate" value={effectiveDate} min={getMinDate()} onChange={(e) => setEffectiveDate(e.target.value)} required />
                <p className="date-notice">Note: Changes must be scheduled at least 3 weeks in advance</p>
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                <button type="submit" className="submit-button">Request Change</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusSelector;