import React from "react";

import { useAppSelector } from "../../hooks/typedHooks";
import { ProjectChart } from "../../store/slices/ProjectSlice";

import levelStyles from "./levelStyles";
import './Table.scss';

function Table() {
  const { period, chart } = useAppSelector((state) => state);

  const getMinDate = () => {
    const { period_start, sub } = chart;
    const startDate = new Date(period_start);

    if (!sub) return startDate;

    let minDate = startDate;
    const queue = [...sub];

    while (queue.length > 0) {
      const subs = queue.shift()!;
      const date = new Date(subs.period_start);

      if (subs.sub) queue.push(...subs.sub);
      if (date > minDate) continue;
      minDate = date;
    }
    return +minDate - (1000 * 60 * 60 * 24);
  };
  const startDate = +getMinDate();
  const endDate = +new Date(period.split('-')[1]?.replace(/(^[0-9]{2}\.)([0-9]{2}\.)/g, '$2$1'));

  const formatDatetoWeeks = () => {
    const options: { month: 'short', day: '2-digit' } = { month: 'short', day: '2-digit' };
    const weeksArray = [];
    let lastDate = startDate;
    weeksArray.push(`${new Date(lastDate).toLocaleDateString("en-US", options)} - ${new Date(lastDate + 6*(1000 * 60 * 60 * 24)).toLocaleDateString("en-US", options)}`)
    lastDate += 6*(1000 * 60 * 60 * 24);
    while (lastDate < endDate) {
      lastDate += (1000 * 60 * 60 * 24)
      weeksArray.push(`${new Date(lastDate).toLocaleDateString("en-US", options)} - ${new Date(lastDate + 6*(1000 * 60 * 60 * 24)).toLocaleDateString("en-US", options)}`);
      lastDate += 6*(1000 * 60 * 60 * 24);
    }
    return weeksArray;
  };
  
  const createDaysChain = () => {
    const ceiledEndDate = Math.ceil(endDate / (7 *1000 * 60 * 60 * 24)) * 7 * (1000 * 60 * 60 * 24) - (1000 * 60 * 60 * 24);
    const numberOfDays = Math.ceil((ceiledEndDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const array = [...Array(numberOfDays)].map((item, i) => new Date(startDate + (1000 * 60 * 60 * 24) * i));
    return array.map((day, i) => (
      <div
        key={i}
        className={"table__timeline-day " + ((day.getDay() === 0 || day.getDay() === 6) ? 'table__timeline-day_weekend' : '')}
      >{day.getDate()}</div>
    ));
  };

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

    const onTaskOpen = (e: React.MouseEvent<Element, MouseEvent>) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;

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
        <div className="table__timeline">
          <div className="table__timeline-header">
            {
              formatDatetoWeeks().map(date => (
                <div key={date} className="table__timeline-week">{date}</div>
              ))
            }
            {createDaysChain()}
          </div>
          <div className="table__timeline-grid">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;