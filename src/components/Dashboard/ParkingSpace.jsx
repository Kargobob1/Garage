import React, { useState } from 'react';
import StatusSelector from '../Management/StatusSelector';
import './ParkingSpace.css';

const ParkingSpace = ({ space, userRole }) => {
  const [showSelector, setShowSelector] = useState(false);
  
  const getStatusClass = (status) => {
    switch (status.toUpperCase()) {
      case 'REPARK': return 'repark';
      case 'RENTED': return 'rented';
      case 'FREE': return 'free';
      default: return '';
    }
  };
  
  const handleSpaceClick = () => {
    if (userRole === 'admin' || userRole === 'manager') {
      setShowSelector(true);
    }
  };
  
  const handleClose = () => {
    setShowSelector(false);
  };

  return (
    <div className={`parking-space ${getStatusClass(space.status)}`} onClick={handleSpaceClick}>
      <div className="space-number">P-{space.number}</div>
      <div className="space-status">{space.status}</div>
      {showSelector && <StatusSelector space={space} onClose={handleClose} />}
    </div>
  );
};

export default ParkingSpace;