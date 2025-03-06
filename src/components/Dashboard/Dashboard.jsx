import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GarageList from './GarageList';
import { fetchGarages } from '../../services/api';
import { logout } from '../../services/auth';
import './Dashboard.css';

const Dashboard = ({ history, userRole }) => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalGarages: 0,
    totalSpaces: 0,
    reparkSpaces: 0,
    rentedSpaces: 0,
    freeSpaces: 0,
  });

  useEffect(() => {
    const loadGarages = async () => {
      try {
        const data = await fetchGarages();
        setGarages(data);
        
        const totalGarages = data.length;
        let totalSpaces = 0, reparkSpaces = 0, rentedSpaces = 0, freeSpaces = 0;
        data.forEach(garage => {
          totalSpaces += garage.totalSpaces;
          reparkSpaces += garage.reparkSpaces;
          rentedSpaces += garage.rentedSpaces;
          freeSpaces += garage.freeSpaces;
        });
        setStats({ totalGarages, totalSpaces, reparkSpaces, rentedSpaces, freeSpaces });
        setLoading(false);
      } catch (err) {
        setError('Failed to load garage data');
        setLoading(false);
        console.error(err);
      }
    };
    loadGarages();
  }, []);
  
  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Garage Management System</h1>
        <div className="user-controls">
          <span className="user-role">Logged in as: {userRole}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        {loading ? (
          <div className="loading">Loading garages...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="dashboard-summary">
              <div className="summary-card">
                <h2>Total Garages</h2>
                <p className="summary-value">{stats.totalGarages}</p>
              </div>
              <div className="summary-card">
                <h2>Total Spaces</h2>
                <p className="summary-value">{stats.totalSpaces}</p>
              </div>
              <div className="summary-card repark">
                <h2>REPARK</h2>
                <p className="summary-value">{stats.reparkSpaces}</p>
                <p className="summary-percentage">{Math.round((stats.reparkSpaces / stats.totalSpaces) * 100)}%</p>
              </div>
              <div className="summary-card rented">
                <h2>RENTED</h2>
                <p className="summary-value">{stats.rentedSpaces}</p>
                <p className="summary-percentage">{Math.round((stats.rentedSpaces / stats.totalSpaces) * 100)}%</p>
              </div>
              <div className="summary-card free">
                <h2>FREE</h2>
                <p className="summary-value">{stats.freeSpaces}</p>
                <p className="summary-percentage">{Math.round((stats.freeSpaces / stats.totalSpaces) * 100)}%</p>
              </div>
            </div>
            <div className="action-buttons">
              <Link to="/changes" className="button primary">Manage Changes</Link>
              {userRole === 'admin' && (
                <button className="button secondary">Add New Garage</button>
              )}
            </div>
            <GarageList garages={garages} />
          </>
        )}
      </main>
      <footer className="dashboard-footer">
        <p>Last synchronized: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default Dashboard;