export function parseHHMM(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return { hour, minute };
}

export function toMinutes(time: { hour: number; minute: number }) {
  return time.hour * 60 + time.minute;
}

export function isWithinOpeningHours(
  startAt: Date,
  endAt: Date,
  openTime: string,
  closeTime: string,
) {
  const open = toMinutes(parseHHMM(openTime));
  const close = toMinutes(parseHHMM(closeTime));

  const startMins = startAt.getHours() * 60 + startAt.getMinutes();
  const endMins = endAt.getHours() * 60 + endAt.getMinutes();

  return startMins >= open && endMins <= close;
}
