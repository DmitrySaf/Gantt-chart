import React from 'react';

import { useAppSelector } from '../../hooks/typedHooks';
import { ProjectChart } from '../../store/slices/ProjectSlice';

import levelStyles from './levelStyles';
import './Table.scss';

function Table() {
  const { period, chart } = useAppSelector((state) => state);
  const DAY = (1000 * 60 * 60 * 24);

  const getMinDate = () => {
    const { periodStart, sub } = chart;
    const startDate = new Date(periodStart);

    if (!sub) return startDate;

    let minDate = startDate;
    const queue = [...sub];

    while (queue.length > 0) {
      const subs = queue.shift()!;
      const date = new Date(subs.periodStart);

      if (subs.sub) queue.push(...subs.sub);
      // eslint-disable-next-line no-continue
      if (date > minDate) continue;
      minDate = date;
    }
    return +minDate - DAY;
  };
  const startDate = +getMinDate();
  const endDate = +new Date(period.split('-')[1]?.replace(/(^[0-9]{2}\.)([0-9]{2}\.)/g, '$2$1'));

  const formatDatetoWeeks = () => {
    const options: { month: 'short', day: '2-digit' } = { month: 'short', day: '2-digit' };
    const weeksArray = [];
    let lastDate = startDate;
    weeksArray.push(`${new Date(lastDate).toLocaleDateString('en-US', options)} - ${new Date(lastDate + 6 * DAY).toLocaleDateString('en-US', options)}`);
    lastDate += 6 * DAY;
    while (lastDate < endDate) {
      lastDate += DAY;
      weeksArray.push(`${new Date(lastDate).toLocaleDateString('en-US', options)} - ${new Date(lastDate + 6 * DAY).toLocaleDateString('en-US', options)}`);
      lastDate += 6 * DAY;
    }
    return weeksArray;
  };

  const getNumberOfDays = () => {
    const ceiledEndDate = Math.ceil(endDate / (7 * DAY)) * 7 * DAY - DAY;
    return Math.ceil((ceiledEndDate - startDate) / DAY) + 1;
  };

  const createDaysChain = () => {
    const array = [...Array(getNumberOfDays())].map((item, i) => new Date(startDate + DAY * i));
    return array.map((day, i) => (
      <div
        key={i}
        className={`table__timeline-day ${(day.getDay() === 0 || day.getDay() === 6) ? 'table__timeline-day_weekend' : ''}`}
      >
        {day.getDate()}
      </div>
    ));
  };

  const createTaskTree = (target: ProjectChart, level: number) => {
    if (!target.sub || target.sub.length === 0) {
      return (
        <li className="table__task" key={target.id}>
          <div className="table__task-info" style={{ paddingLeft: level * 20 }}>
            <div className={`table__task-icon ${levelStyles[level].className}`} />
            <div className="table__task-children-quantity">0</div>
            <div className="table__task-title">{target.title}</div>
          </div>
        </li>
      );
    }

    const onTaskOpen = (e: React.MouseEvent<Element, MouseEvent>) => {
      e.stopPropagation();
      const targetElem = e.currentTarget as HTMLElement;

      targetElem.classList.toggle('table__task-info_opened');
    };

    return (
      <li className="table__task" key={target.id}>
        <div className="table__task-info" style={{ paddingLeft: level * 20 }} onClick={onTaskOpen}>
          { target.sub && (target.sub.length > 0) && <div className="table__task-arrow" /> }
          <div className={`table__task-icon ${levelStyles[level].className}`} />
          <div className="table__task-children-quantity">{target.sub && target.sub.length}</div>
          <div className="table__task-title">{target.title}</div>
        </div>
        <ul className="table__task-children">
          {
            [...target.sub].map((sub) => (
              createTaskTree(sub, level + 1)
            ))
          }
        </ul>
      </li>
    );
  };

  const onTableScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLElement;
    const {
      scrollLeft, scrollWidth, clientWidth, offsetParent,
    } = target;
    const rightShadow = offsetParent!.querySelector('.table__timeline-shadow_position_right')!;
    const leftShadow = offsetParent!.querySelector('.table__timeline-shadow_position_left')!;
    if (scrollLeft + clientWidth === scrollWidth) {
      rightShadow.classList.remove('table__timeline-shadow_visible');
    } else {
      rightShadow.classList.add('table__timeline-shadow_visible');
    }
    if (scrollLeft > 0) {
      leftShadow.classList.add('table__timeline-shadow_visible');
    } else {
      leftShadow.classList.remove('table__timeline-shadow_visible');
    }
  };

  return (
    <div className="table">
      <div className="table__timeline-shadow table__timeline-shadow_position_right table__timeline-shadow_visible" />
      <div className="table__timeline-shadow table__timeline-shadow_position_left" />
      <div className="table__content">
        <div className="table__tasks">
          <div className="table__task-header">Work item</div>
          <ul className="table__task-list">
            { createTaskTree(chart, 1) }
          </ul>
        </div>
        <div className="table__timeline" onScroll={onTableScroll}>
          <div className="table__timeline-header">
            <div
              className="table__timeline-header table__timeline-header_position_top"
              style={{ gridTemplateColumns: `repeat(${getNumberOfDays()}, 22px)` }}
            >
              {
                formatDatetoWeeks().map((date) => (
                  <div key={date} className="table__timeline-week">{date}</div>
                ))
              }
            </div>
            <div
              className="table__timeline-header table__timeline-header_position_bottom"
              style={{ gridTemplateColumns: `repeat(${getNumberOfDays()}, 22px)` }}
            >
              { createDaysChain() }
            </div>
          </div>
          <div className="table__timeline-grid-wrapper">
            <div className="table__timeline-grid" style={{ gridTemplateColumns: `repeat(${getNumberOfDays()}, 22px)` }}>
              {
                [...Array(getNumberOfDays())].map((item, i) => (
                  <div className="table__timeline-column" key={i} />
                ))
              }
            </div>
            <div className="table__timeline-tasks">
              <div className="table__timeline-task table__timeline-task_opened">
                <div className="table__timeline-task-marker" />
                <div className="table__timeline-task-title">Marketing launch</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
