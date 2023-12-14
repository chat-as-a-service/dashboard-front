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
}
