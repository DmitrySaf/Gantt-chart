import { useMemo } from "react";

import { useAppSelector } from "../../hooks/typedHooks";
import { ProjectChart } from "../../store/slices/ProjectSlice";

import levelStyles from "./levelStyles";
import './Table.scss';

function Table() {
  const { period, chart } = useAppSelector((state) => state);

  const getNumberOfDays = useMemo(() => {
    const startDate = +new Date(period.split('-')[0]?.replace(/(^[0-9]{2}\.)([0-9]{2}\.)/g, '$2$1'));
    const endDate = +new Date(period.split('-')[1]?.replace(/(^[0-9]{2}\.)([0-9]{2}\.)/g, '$2$1'));

    return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24))
  }, []);
  const createTaskTree = (target: ProjectChart, level: number) => {
    if (!target.sub || target.sub.length === 0) {
      return (
        <li className="table__task" key={target.id} >
          <div className="table__task-info" style={{paddingLeft: level * 20}}>
            <div className={`table__task-icon ${levelStyles[level].className}`}></div>
            <div className="table__task-children-quantity">0</div>
            <div className="table__task-title">{target.title}</div>
          </div>
        </li>
      )
    };
    const onTaskOpen = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      console.log(target)
      target.classList.toggle('table__task-info_opened');
    };
    return (
      <li className="table__task" key={target.id}>
        <div className="table__task-info" style={{paddingLeft: level * 20}} onClick={(e) => onTaskOpen(e)}>
          { target.sub &&  (target.sub.length > 0) && <div className="table__task-arrow"></div> }
          <div className={`table__task-icon ${levelStyles[level].className}`}></div>
          <div className="table__task-children-quantity">{target.sub && target.sub.length}</div>
          <div className="table__task-title">{target.title}</div>
        </div>
        <ul className="table__task-children">
          {
            [...target.sub].map(sub => (
              createTaskTree(sub, level + 1)
            ))
          }
        </ul>
      </li>
    )
  };

  return (
    <div className="table">
      <div className="table__content">
        <div className="table__tasks">
          <div className="table__task-header">Work item</div>
          <ul className="table__task-list">
            { createTaskTree(chart, 1) }
          </ul>
        </div>
        {/* <div className="table__header">
          <div className="table__row">
            <div className="table__cell table__cell_theme_main">Work item</div>
            {
              [...Array(getNumberOfDays | 30)].map((day, i) => ( <div className="table__cell">{i}</div> ))
            }
          </div>
          <div className="table__row">
            {
              [...Array(getNumberOfDays | 30)].map((day, i) => ( <div className="table__cell">{i}</div> ))
            }
          </div>
        </div>
        <div className="table__body">
          <tr></tr>

        </div> */}
      </div>
    </div>
  );
}

export default Table;