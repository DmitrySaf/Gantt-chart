import { memo } from "react";

import './ExportButton.scss';

function ExportButton() {
  return (
    <div className="export-button">
      <div className="export-button__icon"></div>
      <div className="export-button__text">Export</div>
    </div>
  );
}

export default memo(ExportButton);