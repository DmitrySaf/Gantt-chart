/* eslint-disable @typescript-eslint/naming-convention */
import { Fragment } from 'react';
import classNames from 'classnames';

import { ProjectChart } from '../../../store/slices/ProjectSlice';

type ISessionState = {
  [index: number]: {
    period_start: string,
    period_end: string,
    parentId: number | undefined,
    childrenId: number[]
  }
};

type GridProps = {
  days: number,
  chart: ProjectChart,
  startDate: number,
  openedTasks: number[]
};

const sessionState: ISessionState = {};

function TableTimelineGrid({
  days,
  chart,
  startDate,
  openedTasks,
}: GridProps) {
  const DAY = (1000 * 60 * 60 * 24);

  const calcDatesDifference = (periodStart: string | number, periodEnd: string | number) => {
    const startTime = new Date(periodStart).getTime();
    const endTime = new Date(periodEnd).getTime();

    return Math.ceil((endTime - startTime) / DAY) * 22;
  };

  const millisecondsToFormatDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

  const setSessionState = (id: number, daysMoved: number) => {
    sessionState[id] = {
      ...sessionState[id],
      period_start: millisecondsToFormatDate(
        new Date(sessionState[id].period_start).getTime() + daysMoved * DAY,
      ),
      period_end: millisecondsToFormatDate(
        new Date(sessionState[id].period_end).getTime() + daysMoved * DAY,
      ),
    };
  };

  const getAllChildrenId = (target: ProjectChart) => {
    if (!target.sub || target.sub.length === 0) return [];
    const childrenIds = [];
    const queue = [...target.sub];

    while (queue.length > 0) {
      const sub = queue.shift()!;

      childrenIds.push(sub.id);
      if (sub.sub) queue.push(...sub.sub);
    }
    return childrenIds;
  };

  const createTaskTimelines = (
    target: ProjectChart,
    level: number,
    prevStartDate: string | number,
    parentId?: number,
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
      const startPoint = e.pageX;
      const parId = sessionState[id].parentId;
      const parentElement = parId && sessionState[parId];

      marker.style.cursor = 'grabbing';

      const calcLeftValue = (event: { pageX: number }) => (
        Math.round((event.pageX - tasksOffsetLeft - markerGrabLeft - taskOffsetLeft) / 22) * 22
      );

      const onPointerMove = (event: PointerEvent) => {
        const left = calcLeftValue(event);

        if (left < 0) return;
        if (
          parentElement
          && (left
          > (calcDatesDifference(parentElement.period_start, parentElement.period_end)
          - calcDatesDifference(period_start, period_end)))
        ) return;

        task.style.marginLeft = `${left}px`;
      };

      const onPointerUp = (event: { pageX: number }) => {
        const endPoint = event.pageX;
        const daysMoved = Math.round((endPoint - startPoint) / 22);

        marker.style.cursor = 'grab';

        setSessionState(id, daysMoved);
        sessionState[id].childrenId.forEach((child) => {
          setSessionState(child, daysMoved);
        });

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };

    const onResize = (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const resizeElem = e.target as HTMLElement;
      const marker = resizeElem.parentElement!;
      const markerWidth = marker.offsetWidth;
      const markerOffsetLeft = marker.getBoundingClientRect().left;
      const parId = sessionState[id].parentId;
      const parentElement = parId && sessionState[parId];

      let overallWidth = 0;

      const onPointerMove = (event: { pageX: number }) => {
        const width = Math.round((event.pageX - markerOffsetLeft) / 22) * 22;

        if (width < 22) return;

        if (
          parentElement
          && ((new Date(sessionState[id].period_start).getTime() + (width / 22) * DAY - DAY)
            > new Date(parentElement.period_end).getTime())
        ) return;

        overallWidth = width;
        marker.style.width = `${width}px`;
      };

      const onPointerUp = () => {
        const daysMoved = (overallWidth - markerWidth) / 22;

        sessionState[id] = {
          ...sessionState[id],
          period_end: millisecondsToFormatDate(
            new Date(sessionState[id].period_end).getTime() + daysMoved * DAY,
          ),
        };

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };

    if (!sessionState[id]) {
      sessionState[id] = {
        period_start,
        period_end,
        parentId,
        childrenId: getAllChildrenId(target),
      };
    }

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
            >
              <div className="table__timeline-marker-resize" onPointerDown={onResize} />
            </div>
            <div className="table__timeline-task-title">{title}</div>
          </div>
          <div className="table__timeline-task-children">
            {
              checkedSub.map((subElem) => (
                createTaskTimelines(subElem, level + 1, period_start, id)
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

export default TableTimelineGrid;
