import TableTasks from './subcomponents/TableTasks';
import TableTimeline from './subcomponents/TableTimeline';

import './Table.scss';

function Table() {
  return (
    <div className="table">
      <div className="table__timeline-shadow table__timeline-shadow_position_left" />
      <div className="table__timeline-shadow table__timeline-shadow_position_right table__timeline-shadow_visible" />
      <div className="table__content">
        <TableTasks />
        <TableTimeline />
      </div>
    </div>
  );
}

export default Table;
