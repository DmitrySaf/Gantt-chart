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
    const formatDate = (date: number) => (
      `${new Date(date).toLocaleDateString('en-US', options)}
       - 
      ${new Date(date + 6 * DAY).toLocaleDateString('en-US', options)}`
    );
    let lastDate = startDate;

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

type ISessionState = {
  [index: number]: {
    period_start: string,
    period_end: string
  }
};

function TableTimelineGrid({
  days,
  chart,
  startDate,
  openedTasks,
}: GridProps) {
  const sessionState: ISessionState = {};
  const DAY = (1000 * 60 * 60 * 24);

  const calcDatesDifference = (periodStart: string | number, periodEnd: string | number) => {
    const startTime = new Date(periodStart).getTime();
    const endTime = new Date(periodEnd).getTime();

    return Math.ceil((endTime - startTime) / DAY) * 22;
  };

  const pixelsToDate = (pixels: number) => Math.round(pixels / 22);

  const millisecondsToFormatDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

  const createTaskTimelines = (
    target: ProjectChart,
    level: number,
    prevStartDate: string | number,
    prevEndDate?: string | number,
  ) => {
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

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

      const marker = e.target as HTMLElement;
      const task = marker.parentElement!.parentElement as HTMLElement;
      const taskOffsetLeft = task.parentElement!.parentElement!.offsetLeft;
      const tasksOffsetLeft = marker.offsetParent!.getBoundingClientRect().left;
      const markerGrabLeft = e.pageX - marker.getBoundingClientRect().left;

      marker.style.cursor = 'grabbing';

      const calcLeftValue = (event: { pageX: number }) => (
        Math.round((event.pageX - tasksOffsetLeft - markerGrabLeft - taskOffsetLeft) / 22) * 22
      );

      const onPointerMove = (event: PointerEvent) => {
        const left = calcLeftValue(event);

        if (left < 0) return;
        if (
          prevEndDate
          && (left
          > (calcDatesDifference(prevStartDate, prevEndDate)
          - calcDatesDifference(period_start, period_end)))
        ) return;

        task.style.marginLeft = `${left}px`;
      };

      const onPointerUp = (event: { pageX: number }) => {
        const left = calcLeftValue(event);
        const period_start_date = startDate + left * DAY;
        const period_end_date = period_start_date + pixelsToDate(marker.offsetWidth) * DAY - DAY;

        marker.style.cursor = 'grab';
        Object.keys(sessionState).forEach((objId) => {
          sessionState[+objId] = {
            period_start: millisecondsToFormatDate(period_start_date),
            period_end: millisecondsToFormatDate(period_end_date),
          };
        });

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };

    sessionState[id] = { period_start, period_end };

    return (
      <Fragment key={id}>
        <div
          className={taskClassnames}
          style={{ marginLeft: `${calcDatesDifference(prevStartDate, period_start)}px` }}
        >
          <div className="table__timeline-task-wrapper">
            <div
              className={markerClassnames}
              onPointerDown={onPointerDown}
              style={{ width: `${calcDatesDifference(period_start, period_end) + 22}px` }}
            />
            <div className="table__timeline-task-title">{title}</div>
          </div>
          <div className="table__timeline-task-children">
            {
              checkedSub.map((subElem) => (
                createTaskTimelines(subElem, level + 1, period_start, period_end)
              ))
            }
          </div>
        </div>
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
        {createTaskTimelines(chart, 1, startDate)}
      </div>
    </div>
  );
}

export default TableTimeline;
