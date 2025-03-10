export const APPOINTMENT_LENGTH = 30;

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

  if (nameIndex < judges) {
    return APPOINTMENT_LENGTH;
  }

  return (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;
}
