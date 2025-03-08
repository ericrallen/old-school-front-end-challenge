const PRINT_METRICS = true;

if (PRINT_METRICS) {
  console.time("runtime");
}

export const APPOINTMENT_LENGTH = 30;

export function getWaitTime(nameIndex = 0, judges = 1) {
  if (PRINT_METRICS) {
    console.time("NEW waitTime");
  }

  if (nameIndex < judges) {
    if (PRINT_METRICS) {
      console.timeEnd("NEW waitTime");
    }
    return APPOINTMENT_LENGTH;
  }

  const waitTime = (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;

  if (PRINT_METRICS) {
    console.timeEnd("NEW waitTime");
  }
  return waitTime;
}

export function court(name = "", judges = 0, waitingList = "") {
  if (PRINT_METRICS) {
    console.time("court");
  }

  // there are some escape hatches for edge cases where we
  // won't need to compute anything

  // ESCAPE: If there are no judges, the wait is infinite
  if (judges < 1) {
    if (PRINT_METRICS) {
      console.timeEnd("court");
    }
    return Infinity;
  }

  // ESCAPE: If we are the only person in line, we'll be seen immediately
  if (waitingList.length === 0) {
    if (PRINT_METRICS) {
      console.timeEnd("court");
    }
    return APPOINTMENT_LENGTH;
  }

  if (PRINT_METRICS) {
    console.time("combine names");
  }

  if (PRINT_METRICS) {
    console.time("split");
  }
  const waitingNames = waitingList.split(" ");
  if (PRINT_METRICS) {
    console.timeEnd("split");
  }

  if (PRINT_METRICS) {
    console.time("push");
  }
  waitingNames.push(name);
  if (PRINT_METRICS) {
    console.timeEnd("push");
  }
  if (PRINT_METRICS) {
    console.timeEnd("combine names");
  }

  if (PRINT_METRICS) {
    console.time("sort");
  }
  const sortedNames = waitingNames.sort();
  if (PRINT_METRICS) {
    console.timeEnd("sort");
  }

  if (PRINT_METRICS) {
    console.time("index of");
  }
  const nameIndex = sortedNames.indexOf(name);
  if (PRINT_METRICS) {
    console.timeEnd("index of");
  }

  if (PRINT_METRICS) {
    console.time("NEW getWaitTime");
  }
  const waitTime = getWaitTime(nameIndex, judges);
  if (PRINT_METRICS) {
    console.timeEnd("NEW getWaitTime");
  }

  if (PRINT_METRICS) {
    console.timeEnd("court");
  }

  if (PRINT_METRICS) {
    console.timeEnd("runtime");
  }
  return waitTime;
}

export function newCourt(name = "", judges = 0, waitingList = "") {
  if (PRINT_METRICS) {
    console.time("NEW court");
  }

  // there are some escape hatches for edge cases where we
  // won't need to compute anything
  if (judges > 0) {
    // ESCAPE: If we are the only person in line, we'll be seen immediately
    if (waitingList.length > 0) {
      if (PRINT_METRICS) {
        console.time("NEW combine names");
      }

      if (PRINT_METRICS) {
        console.time("combine names");
      }

      if (PRINT_METRICS) {
        console.time("split");
      }
      const waitingNames = waitingList.split(" ");
      if (PRINT_METRICS) {
        console.timeEnd("split");
      }

      if (PRINT_METRICS) {
        console.time("push");
      }
      waitingNames.push(name);
      if (PRINT_METRICS) {
        console.timeEnd("push");
      }
      if (PRINT_METRICS) {
        console.timeEnd("combine names");
      }

      if (PRINT_METRICS) {
        console.time("sort");
      }
      const sortedNames = waitingNames.sort();
      if (PRINT_METRICS) {
        console.timeEnd("sort");
      }

      if (PRINT_METRICS) {
        console.time("index of");
      }
      const nameIndex = sortedNames.indexOf(name);
      if (PRINT_METRICS) {
        console.timeEnd("index of");
      }

      if (PRINT_METRICS) {
        console.time("NEWER waitTime");
      }

      if (nameIndex < judges) {
        if (PRINT_METRICS) {
          console.timeEnd("NEWER waitTime");
        }
        return APPOINTMENT_LENGTH;
      }

      const waitTime =
        (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;

      if (PRINT_METRICS) {
        console.timeEnd("NEWER waitTime");
      }

      if (PRINT_METRICS) {
        console.timeEnd("NEW court");
      }

      if (PRINT_METRICS) {
        console.timeEnd("runtime");
      }
      return waitTime;
    }

    if (PRINT_METRICS) {
      console.timeEnd("NEW court");
    }
    return APPOINTMENT_LENGTH;
  }

  if (PRINT_METRICS) {
    console.timeEnd("NEW court");
  }
  return Infinity;
}
