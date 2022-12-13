import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { useAppSelector } from '../../../hooks/typedHooks';
import { ProjectChart } from '../../../store/slices/ProjectSlice';

function TableTasks({ handleStateChange }: { handleStateChange: (tasks: number[]) => void }) {
  const { chart } = useAppSelector((state) => state);
  const [openedTasks, setOpenedTasks] = useState<number[]>([]);

  useEffect(() => {
    handleStateChange(openedTasks);
  }, [openedTasks]);

  const createTaskTree = (target: ProjectChart, level: number) => {
    const { id, sub, title } = target;
    const iconClassnames = classNames({
      'table__task-icon': true,
      'table__task-icon_level_first': level === 1,
      'table__task-icon_level_second': level === 2,
      'table__task-icon_level_third': level === 3,
      'table__task-icon_level_fourth': level === 4,
      'table__task-icon_level_fifth': level === 5,
    });
    const taskClassnames = classNames({
      'table__task-info': true,
      'table__task-info_opened': openedTasks.includes(id),
    });

    if (!sub || sub.length === 0) {
      return (
        <li className="table__task" key={id}>
          <div className={taskClassnames} style={{ paddingLeft: level * 20 }}>
            <div className={iconClassnames} />
            <div className="table__task-children-quantity">0</div>
            <div className="table__task-title">{title}</div>
          </div>
        </li>
      );
    }
    const onTaskOpen = () => {
      if (openedTasks.includes(id)) {
        setOpenedTasks([...openedTasks.splice(0, openedTasks.indexOf(id))]);
        return;
      }
      setOpenedTasks([...openedTasks, id]);
    };

    return (
      <li className="table__task" key={id}>
        <div
          className={taskClassnames}
          style={{ paddingLeft: level * 20 }}
          onClick={onTaskOpen}
        >
          {(sub.length > 0) && <div className="table__task-arrow" />}
          <div className={iconClassnames} />
          <div className="table__task-children-quantity">{sub.length}</div>
          <div className="table__task-title">{title}</div>
        </div>
        <ul className="table__task-children">
          {
            sub.map((subElem) => createTaskTree(subElem, level + 1))
          }
        </ul>
      </li>
    );
  };

  return (
    <div className="table__tasks">
      <div className="table__task-header">Work item</div>
      <ul className="table__task-list">
        {createTaskTree(chart, 1)}
      </ul>
    </div>
  );
}

export default TableTasks;
