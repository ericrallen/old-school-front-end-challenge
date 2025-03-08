console.time("runtime");

export const APPOINTMENT_LENGTH = 30;

export function getWaitTime(judges = 0, nameIndex = 0) {
  console.time("waitTime");
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

  console.time("waitTime - loop");

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

  console.timeEnd("waitTime - loop");
  console.timeEnd("waitTime");

  return waitTime;
}

export function court(name = "", judges = 0, waitingList = "") {
  console.time("court");

  // there are some escape hatches for edge cases where we
  // won't need to compute anything

  // ESCAPE: If there are no judges, the wait is infinite
  if (judges < 1) {
    console.timeEnd("court");
    return Infinity;
  }

  // ESCAPE: If we are the only person in line, we'll be seen immediately
  if (waitingList.length === 0) {
    console.timeEnd("court");
    return APPOINTMENT_LENGTH;
  }

  console.time("combine names");

  // TODO: we probably don't need to measure these built-ins
  // because performance bottlenocks are far more likely to exist
  // in our own code than the underlying standard library, but
  // we might need to add some hacky/clever optimization later
  console.time("split");
  const waitingNames = waitingList.split(" ");
  console.timeEnd("split");

  console.time("push");
  waitingNames.push(name);
  console.timeEnd("push");
  console.timeEnd("combine names");

  console.time("sort");
  const sortedNames = waitingNames.sort();
  console.timeEnd("sort");

  console.time("index of");
  const nameIndex = sortedNames.indexOf(name);
  console.timeEnd("index of");

  console.time("getWaitTime");
  const waitTime = getWaitTime(judges, nameIndex);
  console.timeEnd("getWaitTime");

  console.timeEnd("court");

  return waitTime;
}

console.timeEnd("runtime");
