import { IMonthGroup, IYearGroup } from "$/types";

const getMonthwiseData = (data: IYearGroup[]) => {
  let result = [] as IMonthGroup[];

  for (let year of data) {
    for (let month of year.months) {
      result.push(month);
    }
  }

  return result;
};

export { getMonthwiseData };
