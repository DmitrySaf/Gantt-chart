import { useState } from 'react';
import TableTasks from './subcomponents/TableTasks';
import TableTimeline from './subcomponents/TableTimeline';

import './Table.scss';

function Table() {
  const [openedTasks, setOpenedTasks] = useState<number[]>([]);

  const handleStateChange = (tasks: number[]) => {
    setOpenedTasks(tasks);
  };

  return (
    <div className="table">
      <div className="table__timeline-shadow table__timeline-shadow_position_left" />
      <div className="table__timeline-shadow table__timeline-shadow_position_right table__timeline-shadow_visible" />
      <div className="table__content">
        <TableTasks handleStateChange={handleStateChange} />
        <TableTimeline openedTasks={openedTasks} />
      </div>
    </div>
  );
}

export default Table;
