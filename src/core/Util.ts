import dayjs from 'dayjs';

export abstract class Utils {
  static unixTsToDateTimeString(unixTs: number) {
    return dayjs.unix(unixTs).format('MMM D, YYYY [at] h:mm A');
  }

  static unixMsTsToDateTimeString(unixTs: number) {
    return dayjs(unixTs).format('MMM D, YYYY [at] h:mm A');
  }

  static unixTsToDateString(unixTs: number) {
    return dayjs.unix(unixTs).format('MMM D, YYYY');
  }

  static groupBy<T>(arr: T[], keys: (keyof T)[]): { [key: string]: T[] } {
    return arr.reduce(
      (storage, item) => {
        const objKey = keys.map((key) => `${item[key]}`).join(':');
        if (storage[objKey]) {
          storage[objKey].push(item);
        } else {
          storage[objKey] = [item];
        }
        return storage;
      },
      {} as { [key: string]: T[] },
    );
  }
}
