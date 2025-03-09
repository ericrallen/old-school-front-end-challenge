export const APPOINTMENT_LENGTH = 30;

export function getWaitTime(nameIndex = 0, judges = 1) {
  return nameIndex < judges
    ? APPOINTMENT_LENGTH
    : (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;
}

export function court(name = "", judges = 0, waitingList = ""): number {
  // there are some escape hatches for edge cases where we
  // won't need to compute anything

  // ESCAPE: If there are no judges, the wait is infinite
  if (judges < 1) {
    return Infinity;
  }

  // ESCAPE: If we are the only person in line, we'll be seen immediately
  if (waitingList.length === 0) {
    return APPOINTMENT_LENGTH;
  }

  const waitingNames = waitingList.split(" ");

  waitingNames.push(name);

  waitingNames.sort();

  const nameIndex = waitingNames.indexOf(name);

  const waitTime = getWaitTime(nameIndex, judges);

  return waitTime;
}
