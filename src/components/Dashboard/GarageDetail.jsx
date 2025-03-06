import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParkingSpace from './ParkingSpace';
import { fetchGarageDetails, fetchPendingChanges } from '../../services/api';
import './GarageDetail.css';

const GarageDetail = ({ match, userRole }) => {
  const garageId = match.params.id;
  const [garage, setGarage] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGarageData = async () => {
      try {
        const garageData = await fetchGarageDetails(garageId);
        setGarage(garageData);
        setSpaces(garageData.spaces);
        const changes = await fetchPendingChanges(garageId);
        setPendingChanges(changes);
        setLoading(false);
      } catch (err) {
        setError('Failed to load garage details');
        setLoading(false);
        console.error(err);
      }
    };
    loadGarageData();
  }, [garageId]);

  const groupedSpaces = [];
  if (spaces.length > 0) {
    const spacesPerRow = 8;
    for (let i = 0; i < spaces.length; i += spacesPerRow) {
      groupedSpaces.push(spaces.slice(i, i + spacesPerRow));
    }
  }

  return (
    <div className="garage-detail-container">
      <header className="garage-detail-header">
        <div className="header-left">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          {garage && <h1>{garage.name}</h1>}
        </div>
        <div className="header-right">
          <Link to="/changes" className="button primary">Manage Changes</Link>
        </div>
      </header>
      <main className="garage-detail-content">
        {loading ? (
          <div className="loading">Loading garage details...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : garage ? (
          <>
            <div className="garage-info">
              <div className="garage-address">
                <h2>Address</h2>
                <p>{garage.address}</p>
              </div>
              <div className="garage-stats">
                <div className="stat-card total">
                  <h3>Total Spaces</h3>
                  <p>{garage.totalSpaces}</p>
                </div>
                <div className="stat-card repark">
                  <h3>REPARK</h3>
                  <p>{garage.reparkSpaces}</p>
                </div>
                <div className="stat-card rented">
                  <h3>RENTED</h3>
                  <p>{garage.rentedSpaces}</p>
                </div>
                <div className="stat-card free">
                  <h3>FREE</h3>
                  <p>{garage.freeSpaces}</p>
                </div>
              </div>
            </div>
            <div className="spaces-container">
              <h2>Parking Spaces</h2>
              {groupedSpaces.map((row, rowIndex) => (
                <div key={rowIndex} className="space-row">
                  {row.map(space => (
                    <ParkingSpace key={space.id} space={space} userRole={userRole} />
                  ))}
                </div>
              ))}
            </div>
            {pendingChanges.length > 0 && (
              <div className="pending-changes">
                <h2>Upcoming Changes</h2>
                <table className="changes-table">
                  <thead>
                    <tr>
                      <th>Space</th>
                      <th>Current Status</th>
                      <th>New Status</th>
                      <th>Effective Date</th>
                      <th>Requested By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingChanges.map(change => (
                      <tr key={change.id}>
                        <td>P-{change.spaceNumber}</td>
                        <td className={`status ${change.currentStatus.toLowerCase()}`}>{change.currentStatus}</td>
                        <td className={`status ${change.newStatus.toLowerCase()}`}>{change.newStatus}</td>
                        <td>{new Date(change.effectiveDate).toLocaleDateString()}</td>
                        <td>{change.requestedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="not-found">Garage not found</div>
        )}
      </main>
      <footer className="garage-detail-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default GarageDetail;