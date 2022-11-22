/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Fragment } from 'react';
import classNames from 'classnames';

import { useAppSelector } from '../../../hooks/typedHooks';
import { ProjectChart } from '../../../store/slices/ProjectSlice';

type HeaderProps = {
  days: number,
  startDate: number,
  endDate: number
};

type GridProps = {
  days: number,
  chart: ProjectChart,
  startDate: number,
  openedTasks: number[]
};

function TableTimeline({ openedTasks }: { openedTasks: number[] }) {
  const { period, chart } = useAppSelector((state) => state);
  const DAY = (1000 * 60 * 60 * 24);

  const getMinDate = () => {
    const { period_start, sub } = chart;
    const startDate = new Date(period_start);

    if (!sub) return startDate.getTime();
    let minDate = startDate;
    const queue = [...sub];

    while (queue.length > 0) {
      const subs = queue.shift()!;
      const date = new Date(subs.period_start);

      if (subs.sub) queue.push(...subs.sub);
      if (date < minDate) minDate = date;
    }
    return minDate.getTime() - DAY;
  };
  const startDate = getMinDate();
  const endDate = new Date(period.split('-')[1]?.replace(/(^[0-9]{2}\.)([0-9]{2}\.)/g, '$2$1')).getTime();

  const onTableScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLElement;
    const {
      scrollLeft, scrollWidth, clientWidth, offsetParent,
    } = target;
    const rightShadow = offsetParent!.querySelector('.table__timeline-shadow_position_right')!;
    const leftShadow = offsetParent!.querySelector('.table__timeline-shadow_position_left')!;
    if (scrollLeft + clientWidth === scrollWidth) {
      rightShadow.classList.remove('table__timeline-shadow_visible');
      return;
    }
    rightShadow.classList.add('table__timeline-shadow_visible');
    if (scrollLeft > 0) {
      leftShadow.classList.add('table__timeline-shadow_visible');
      return;
    }
    leftShadow.classList.remove('table__timeline-shadow_visible');
  };

  const getNumberOfDays = () => {
    const ceiledEndDate = Math.ceil(endDate / (7 * DAY)) * 7 * DAY - DAY;
    return Math.ceil((ceiledEndDate - startDate) / DAY) + 1;
  };

  return (
    <div className="table__timeline" onScroll={onTableScroll}>
      <TableTimelineHeader
        days={getNumberOfDays()}
        startDate={startDate}
        endDate={endDate}
      />
      <TableTimelineGrid
        days={getNumberOfDays()}
        chart={chart}
        startDate={startDate}
        openedTasks={openedTasks}
      />
    </div>
  );
}

function TableTimelineHeader({ days, startDate, endDate }: HeaderProps) {
  const DAY = (1000 * 60 * 60 * 24);

  const createDaysChain = () => {
    const array = [...Array(days)].map((item, i) => new Date(startDate + DAY * i));
    return array.map((day, i) => {
      const timelineDayClassnames = classNames({
        'table__timeline-day': true,
        'table__timeline-day_weekend': (day.getDay() === 0 || day.getDay() === 6),
      });
      return (<div key={i} className={timelineDayClassnames}>{day.getDate()}</div>);
    });
  };

  const formatDatetoWeeks = () => {
    const options: { month: 'short', day: '2-digit' } = { month: 'short', day: '2-digit' };
    const weeksArray = [];
    let lastDate = startDate;

    const formatDate = (date: number) => (
      `${
        new Date(date).toLocaleDateString('en-US', options)
      } - ${
        new Date(date + 6 * DAY).toLocaleDateString('en-US', options)
      }`
    );

    weeksArray.push(formatDate(lastDate));
    lastDate += 6 * DAY;
    while (lastDate < endDate) {
      lastDate += DAY;
      weeksArray.push(formatDate(lastDate));
      lastDate += 6 * DAY;
    }
    return weeksArray;
  };

  return (
    <div className="table__timeline-header">
      <div
        className="table__timeline-header table__timeline-header_position_top"
        style={{ gridTemplateColumns: `repeat(${days}, 22px)` }}
      >
        {
          formatDatetoWeeks().map((date) => (
            <div key={date} className="table__timeline-week">{date}</div>
          ))
        }
      </div>
      <div
        className="table__timeline-header table__timeline-header_position_bottom"
        style={{ gridTemplateColumns: `repeat(${days}, 22px)` }}
      >
        {createDaysChain()}
      </div>
    </div>
  );
}

function TableTimelineGrid({
  days,
  chart,
  startDate,
  openedTasks,
}: GridProps) {
  const DAY = (1000 * 60 * 60 * 24);

  const getDuration = (periodStart: string, periodEnd: string) => {
    const startTime = new Date(periodStart).getTime();
    const endTime = new Date(periodEnd).getTime();

    return Math.ceil((endTime - startTime) / DAY) + 1;
  };

  const getStartDay = (periodStart: string) => {
    const startTime = new Date(periodStart).getTime();

    return Math.ceil((startTime - startDate) / DAY);
  };

  const createTaskTimelines = (target: ProjectChart, level: number): JSX.Element => {
    const {
      sub, period_start, period_end, title, id,
    } = target;
    const checkedSub = (!sub || sub.length === 0) ? [] : sub;
    const markerClassnames = classNames({
      'table__timeline-task-marker': true,
      'table__timeline-task-marker_theme_blue': level === 1,
      'table__timeline-task-marker_theme_yellow': level === 2 || level === 5,
      'table__timeline-task-marker_theme_green': level === 3 || level === 4,
    });
    const taskClassnames = classNames({
      'table__timeline-task': true,
      'table__timeline-task_opened': openedTasks.includes(id),
    });

    return (
      <Fragment key={id}>
        <div
          className={taskClassnames}
          style={{
            gridTemplateColumns: `${getDuration(period_start, period_end) * 22}px max-content`,
            marginLeft: `${getStartDay(period_start) * 22}px`,
          }}
        >
          <div className={markerClassnames} />
          <div className="table__timeline-task-title">{title}</div>
        </div>
        {
          checkedSub.map((subElem) => createTaskTimelines(subElem, level + 1))
        }
      </Fragment>
    );
  };

  return (
    <div className="table__timeline-grid-wrapper">
      <div className="table__timeline-grid" style={{ gridTemplateColumns: `repeat(${days}, 22px)` }}>
        {
          [...Array(days)].map((item, i) => (
            <div className="table__timeline-column" key={i} />
          ))
        }
      </div>
      <div className="table__timeline-tasks">
        {createTaskTimelines(chart, 1)}
      </div>
    </div>
  );
}

export default TableTimeline;
