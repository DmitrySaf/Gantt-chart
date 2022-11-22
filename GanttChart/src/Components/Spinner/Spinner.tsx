import React from 'react';

import './Spinner.scss';

function Spinner() {
  return (
    <div className="spinner">
      <svg viewBox="0 0 100 100">
        <defs>
          <filter id="spinner__shadow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1.5"
              floodColor="#262842"
            />
          </filter>
        </defs>
        <circle className="spinner__circle" cx="50" cy="50" r="45" />
      </svg>
    </div>
  );
}

export default Spinner;
