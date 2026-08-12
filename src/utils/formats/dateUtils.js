import dayjs from 'dayjs';

export const toDayjs = (value) => {
  if (!value) return null;
  const [h, m] = String(value).split(':').map(Number);
  return dayjs().hour(h).minute(m).second(0).millisecond(0);
};

export const fromDayjs = (value) =>
  value?.isValid?.() ? value.format('HH:mm') : '';

export const toMinutes = (hhmm) => {
  if (!hhmm) return NaN;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
