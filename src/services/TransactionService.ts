import { IMonthGroup, IYearGroup } from "$/stores/transactionStore";

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
