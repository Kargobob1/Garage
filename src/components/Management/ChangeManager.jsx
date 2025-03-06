import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllPendingChanges, approveChange, rejectChange } from '../../services/api';
import './ChangeManager.css';

const ChangeManager = ({ userRole }) => {
  const [pendingChanges, setPendingChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadChanges = async () => {
      try {
        const changes = await fetchAllPendingChanges();
        setPendingChanges(changes);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pending changes');
        setLoading(false);
        console.error(err);
      }
    };
    loadChanges();
  }, []);
  
  const handleApprove = async (changeId) => {
    try {
      await approveChange(changeId);
      setPendingChanges(pendingChanges.filter(change => change.id !== changeId));
    } catch (err) {
      setError('Failed to approve change');
      console.error(err);
    }
  };
  
  const handleReject = async (changeId) => {
    try {
      await rejectChange(changeId);
      setPendingChanges(pendingChanges.filter(change => change.id !== changeId));
    } catch (err) {
      setError('Failed to reject change');
      console.error(err);
    }
  };
  
  const filteredChanges = pendingChanges.filter(change => filter === 'all' ? true : change.newStatus.toLowerCase() === filter);
  
  const changesByGarage = {};
  filteredChanges.forEach(change => {
    if (!changesByGarage[change.garageName]) {
      changesByGarage[change.garageName] = [];
    }
    changesByGarage[change.garageName].push(change);
  });

  return (
    <div className="change-manager-container">
      <header className="change-manager-header">
        <div className="header-left">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          <h1>Manage Changes</h1>
        </div>
      </header>
      <main className="change-manager-content">
        {loading ? (
          <div className="loading">Loading pending changes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="filters">
              <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Changes</button>
              <button className={`filter-button repark ${filter === 'repark' ? 'active' : ''}`} onClick={() => setFilter('repark')}>REPARK</button>
              <button className={`filter-button rented ${filter === 'rented' ? 'active' : ''}`} onClick={() => setFilter('rented')}>RENTED</button>
              <button className={`filter-button free ${filter === 'free' ? 'active' : ''}`} onClick={() => setFilter('free')}>FREE</button>
            </div>
            {Object.keys(changesByGarage).length === 0 ? (
              <div className="no-changes"><p>No pending changes found.</p></div>
            ) : (
              <div className="changes-by-garage">
                {Object.entries(changesByGarage).map(([garageName, changes]) => (
                  <div key={garageName} className="garage-changes">
                    <h2>{garageName}</h2>
                    <table className="changes-table">
                      <thead>
                        <tr>
                          <th>Space</th>
                          <th>Current Status</th>
                          <th>New Status</th>
                          <th>Effective Date</th>
                          <th>Requested By</th>
                          <th>Requested On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {changes.map(change => (
                          <tr key={change.id}>
                            <td>P-{change.spaceNumber}</td>
                            <td className={`status ${change.currentStatus.toLowerCase()}`}>{change.currentStatus}</td>
                            <td className={`status ${change.newStatus.toLowerCase()}`}>{change.newStatus}</td>
                            <td>{new Date(change.effectiveDate).toLocaleDateString()}</td>
                            <td>{change.requestedBy}</td>
                            <td>{new Date(change.requestedOn).toLocaleDateString()}</td>
                            <td className="actions">
                              {(userRole === 'admin' || userRole === 'manager') && (
                                <>
                                  <button className="approve-button" onClick={() => handleApprove(change.id)}>Approve</button>
                                  <button className="reject-button" onClick={() => handleReject(change.id)}>Reject</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ChangeManager;