export const postedDate = (date) => {
  const createdDate = new Date(date).getTime();
  const now = Date.now();
  const gap = now - createdDate;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  //calculation

  const Day = Math.floor(gap / day);
  const Hour = Math.floor((gap % day) / hour);
  const Min = Math.floor((gap % hour) / minute);
  const Sec = Math.floor((gap % minute) / second);

  if (Math.floor(Day / 30) > 12) {
    const no = Math.floor(Day / 30 / 12);
    return no > 1 ? `${no} years ago` : `${no} year ago`;
  }

  if (Day > 30) {
    const no = Math.floor(Day / 30);
    return no > 1 ? `${no} months ago` : `${no} month ago`;
  }

  if (Day >= 7) {
    const no = Math.floor(Day / 7);
    return no > 1 ? `${no} weeks ago` : `${no} week ago`;
  }

  if (Day > 0) {
    return Day > 1 ? `${Day} days ago` : `${Day} day ago`;
  }
  if (Hour > 0) {
    return Hour > 1 ? `${Hour} hours ago` : `${Hour} hour ago`;
  }

  if (Min > 0) {
    return `${Min} min ago`;
  }

  return `${Sec} sec ago`;
};
