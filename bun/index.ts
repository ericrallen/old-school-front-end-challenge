export const APPOINTMENT_LENGTH = 30;

export function getWaitTime(judges = 0, nameIndex = 0) {
  let waitTime = 0;

  // if the person will be in the first group of judgements
  // we can just return from here and the appointment time
  // that we add in the `court` function will be correct
  if (nameIndex < judges) {
    return APPOINTMENT_LENGTH;
  }

  // TODO: there's some math we can do with the consective appointments
  // and the known index for the person whose wait time we're calculating
  // const consecutiveAppointments = Math.floor(waiting.length / judges);

  let occupiedJudges = 0;

  // TODO: there's certainly some better approach that doesn't involve looping
  for (let i = 0; i <= nameIndex; i++) {
    // we're occupying a judge
    occupiedJudges++;

    // TODO: loops within loops are bad, we'll want to optimize this
    while (occupiedJudges < judges && i <= nameIndex) {
      i++;
      occupiedJudges++;
    }

    // now we've gone through one group of appointments
    // and APPOINTMENT_LENGTH minutes have passed
    waitTime += APPOINTMENT_LENGTH;

    // our judges are free to see the next group
    occupiedJudges = 0;
  }

  return waitTime;
}

export function court(name = "", judges = 0, waitingList = "") {
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

  const sortedNames = waitingNames.sort();

  const nameIndex = sortedNames.indexOf(name);

  const waitTime = getWaitTime(judges, nameIndex);

  return waitTime;
}
