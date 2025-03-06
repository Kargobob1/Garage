import React from 'react';
import { Link } from 'react-router-dom';
import './GarageList.css';

const GarageList = ({ garages }) => {
  return (
    <div className="garage-list">
      <h2>Garages Overview</h2>
      {garages.length === 0 ? (
        <p className="no-garages">No garages found.</p>
      ) : (
        <div className="garage-grid">
          {garages.map(garage => (
            <Link to={`/garage/${garage.id}`} key={garage.id} className="garage-card">
              <h3>{garage.name}</h3>
              <p className="garage-address">{garage.address}</p>
              <div className="garage-stats">
                <div className="stat-item">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{garage.totalSpaces}</span>
                </div>
                <div className="stat-item repark">
                  <span className="stat-label">REPARK</span>
                  <span className="stat-value">{garage.reparkSpaces}</span>
                </div>
                <div className="stat-item rented">
                  <span className="stat-label">RENTED</span>
                  <span className="stat-value">{garage.rentedSpaces}</span>
                </div>
                <div className="stat-item free">
                  <span className="stat-label">FREE</span>
                  <span className="stat-value">{garage.freeSpaces}</span>
                </div>
              </div>
              <div className="upcoming-changes">
                {garage.pendingChanges > 0 && (
                  <div className="pending-changes-badge">
                    {garage.pendingChanges} upcoming {garage.pendingChanges === 1 ? 'change' : 'changes'}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GarageList;