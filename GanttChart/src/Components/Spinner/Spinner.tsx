import React from 'react';

import './Spinner.scss';

function Spinner() {
  return (
    <div id="container">
      <svg viewBox="0 0 100 100">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" 
              flood-color="#262842"/>
          </filter>
        </defs>
        <circle id="spinner" cx="50" cy="50" r="45"/>
      </svg>
    </div>
  );
}

export default Spinner;