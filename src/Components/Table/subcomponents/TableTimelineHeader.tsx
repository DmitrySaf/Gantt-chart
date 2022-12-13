import classNames from 'classnames';

type HeaderProps = {
  days: number,
  startDate: number,
  endDate: number
};

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

export default TableTimelineHeader;
