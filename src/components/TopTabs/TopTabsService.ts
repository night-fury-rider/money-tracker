import { getMonthKey, getMonthTitle } from "$/services/DateService";

const generateRoutesForPastYears = (
  yearCount: number,
  futureMonths = 1
): { key: string; title: string }[] => {
  const now = new Date();
  const start = new Date(now.getFullYear() - yearCount, now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + futureMonths, 1);
  const routes: { key: string; title: string }[] = [];
  const todayDate = new Date(start);

  while (todayDate <= end) {
    routes.push({
      key: getMonthKey(todayDate),
      title: getMonthTitle(todayDate),
    });
    todayDate.setMonth(todayDate.getMonth() + 1);
  }

  return routes;
};

export { generateRoutesForPastYears };
