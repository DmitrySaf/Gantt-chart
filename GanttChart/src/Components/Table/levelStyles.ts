type ILevel = {
  className: string,
  chartStyle: {
    backgroundColor: string,
    border: string
  }
};

interface ILevels {
  [index: number]: ILevel,
}

export default {
  1: {
    className: 'table__task-icon_level_first',
    chartStyle: {
      backgroundColor: '#E2EBFF',
      border: '1px solid #497CF6',
    },
  },
  2: {
    className: 'table__task-icon_level_second',
    chartStyle: {
      backgroundColor: '#FFF2E0',
      border: '1px solid #FFA530',
    },
  },
  3: {
    className: 'table__task-icon_level_third',
    chartStyle: {
      backgroundColor: '#CFF0D6',
      border: '1px solid #2DB77B',
    },
  },
  4: {
    className: 'table__task-icon_level_fourth',
    chartStyle: {
      backgroundColor: '#CFF0D6',
      border: '1px solid #2DB77B',
    },
  },
  5: {
    className: 'table__task-icon_level_fifth',
    chartStyle: {
      backgroundColor: '#FFF2E0',
      border: '1px solid #FFA530',
    },
  },
} as ILevels;
