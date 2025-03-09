import { assertEquals } from "@std/assert";

import { court, APPOINTMENT_LENGTH } from "./main.js";

// How many times we want to iterate on random cases
const MAX_JUDGES = 13;
const MIN_NAMES = 1000000;
const MAX_NAMES = 2000000;

const PHONETIC_ALPHABET = [
  "Alpha",
  "Bravo",
  "Charlie",
  "Delta",
  "Echo",
  "Foxtrot",
  "Golf",
  "Hotel",
  "India",
  "Juliet",
  "Kilo",
  "Lima",
  "Mike",
  "November",
  "Oscar",
  "Papa",
  "Quebec",
  "Romeo",
  "Sierra",
  "Tango",
  "Uniform",
  "Victor",
  "Whiskey",
  "X-ray",
  "Yankee",
  "Zulu",
];

function getRandomNames(count, exclude = []) {
  const names = PHONETIC_ALPHABET;

  let usedNames = [...names];

  // in case we need to expand our list size, we'll just grab a bunch of random names from the list
  if (count > names.length) {
    const newNames = Array.from(
      { length: count - names.length },
      () =>
        PHONETIC_ALPHABET[Math.floor(Math.random() * PHONETIC_ALPHABET.length)]
    );

    usedNames = [...usedNames, ...newNames];
  }

  return usedNames
    .filter((name) => !exclude.includes(name))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function getNameIndex(name, names) {
  const sortedNames = [name, ...names].sort();

  return sortedNames.indexOf(name);
}

function calculateExpectedWaitTime(nameIndex, judges) {
  return nameIndex < judges
    ? APPOINTMENT_LENGTH
    : (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;
}

Deno.test("BIG NUMBERS", () => {
  const name = getRandomNames(1)[0];

  const judges = Math.floor(Math.random() * MAX_JUDGES) + 1;

  const names = getRandomNames(
    Math.floor(Math.random() * MAX_NAMES) + MIN_NAMES,
    [name]
  );

  const result = court(name, judges, names.join(" "));

  const nameIndex = getNameIndex(name, names);

  const expectedWaitTime = calculateExpectedWaitTime(nameIndex, judges);

  assertEquals(result, expectedWaitTime);
});
