/* eslint-disable @typescript-eslint/naming-convention */

import { useAppSelector } from '../../../hooks/typedHooks';
import TableTimelineHeader from './TableTimelineHeader';
import TableTimelineGrid from './TableTimelineGrid';

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

export default TableTimeline;
