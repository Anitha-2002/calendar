export const PageLayoutTypes = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const PageLayoutTypesData = [
  { key: PageLayoutTypes.DAY, value: 'Day' },
  { key: PageLayoutTypes.WEEK, value: 'Week' },
  { key: PageLayoutTypes.MONTH, value: 'Month' },
  { key: PageLayoutTypes.YEAR, value: 'Year' },
];

export type pageType = (typeof PageLayoutTypes)[keyof typeof PageLayoutTypes];
