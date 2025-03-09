import { assertEquals } from "@std/assert";

import { court, APPOINTMENT_LENGTH } from "./main.js";

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

// These were the examples we were given
Deno.test("Validation Tests", () => {
  const calibrationTestOne = court("Jules", 3, "Adam Betty Frank Mike");
  const calibrationTestTwo = court("Zane", 1, "Mark Hank Ana Vivian");

  assertEquals(calibrationTestOne, 60);
  assertEquals(calibrationTestTwo, 150);
});

// So we don't have to rewrite the same logic over and over
// we abstracted it into utility functions in this test file
// and now we'll use the Validation Tests we already know
// to verify that our utility functions are working as expected
Deno.test("Utility Calibration Tests", () => {
  const tests = [
    {
      name: "Jules",
      judges: 3,
      names: ["Adam", "Betty", "Frank", "Mike"],
      nameIndex: 3,
      expected: 60,
    },
    {
      name: "Zane",
      judges: 1,
      nameIndex: 4,
      names: ["Mark", "Hank", "Ana", "Vivian"],
      expected: 150,
    },
  ];

  tests.forEach((test) => {
    assertEquals(getNameIndex(test.name, test.names), test.nameIndex);
    assertEquals(
      calculateExpectedWaitTime(test.nameIndex, test.judges),
      test.expected
    );
  });
});

// These are some tests we'll use to verify edge cases
// and more complex scenarios
Deno.test("should calculate the correct time for a single person", () => {
  const result = court(PHONETIC_ALPHABET[0], 1, "");

  assertEquals(result, APPOINTMENT_LENGTH);
});

Deno.test(
  "should calculate the correct time for a large number of people",
  () => {
    const name = "John";
    const judges = 2;
    const names = PHONETIC_ALPHABET;

    const result = court(name, judges, names.join(" "));

    // John should be in the 5th group of 2 judgements based on the
    // alphabetical order of the names
    assertEquals(result, APPOINTMENT_LENGTH * 5);
  }
);

Deno.test(
  "should calculate the correct time for a large number of people",
  () => {
    const name = "Zombie";
    const judges = 2;
    const names = PHONETIC_ALPHABET;

    const result = court(name, judges, names.join(" "));

    // Zombie should be near the end of the alphabet, just before Zulu
    assertEquals(result, APPOINTMENT_LENGTH * 13);
  }
);

Deno.test(
  "should calculate the correct time for a large number of people",
  () => {
    const name = "Zombie";
    const judges = 1;
    const names = PHONETIC_ALPHABET;

    const result = court(name, judges, names.join(" "));

    // Zombie should be near the end of the alphabet, just before Zulu
    assertEquals(result, APPOINTMENT_LENGTH * 26);
  }
);

Deno.test(
  "should calculate the correct time for two people with one judge",
  () => {
    const name = getRandomNames(1)[0];
    const judges = 1;

    const names = getRandomNames(1, [name]);

    console.log(name, judges, names.join(" "));

    const result = court(name, judges, names.join(" "));

    const nameIndex = getNameIndex(name, names);

    const expectedWaitTime = calculateExpectedWaitTime(nameIndex, judges);

    assertEquals(result, expectedWaitTime);
  }
);

Deno.test(
  "should calculate the correct time for multiple people with one judge",
  () => {
    const name = getRandomNames(1)[0];
    const judges = 1;

    const names = getRandomNames(4, [name]);

    console.log(name, judges, names.join(" "));

    const result = court(name, judges, names.join(" "));

    const nameIndex = getNameIndex(name, names);

    const expectedWaitTime = calculateExpectedWaitTime(nameIndex, judges);

    assertEquals(result, expectedWaitTime);
  }
);

Deno.test(
  "should calculate the correct time for multiple people with two judges",
  () => {
    const name = getRandomNames(1)[0];
    const judges = 2;

    const names = getRandomNames(4, [name]);

    console.log(name, judges, names.join(" "));

    const result = court(name, judges, names.join(" "));

    const nameIndex = getNameIndex(name, names);

    console.log(nameIndex, judges);

    const expectedWaitTime = calculateExpectedWaitTime(nameIndex, judges);

    assertEquals(result, expectedWaitTime);
  }
);

Deno.test(
  "should calculate the correct time for multiple people with three judges",
  () => {
    const name = getRandomNames(1)[0];
    const judges = 3;

    const names = getRandomNames(4, [name]);

    console.log(name, judges, names.join(" "));

    const result = court(name, judges, names.join(" "));

    const nameIndex = getNameIndex(name, names);

    const expectedWaitTime = calculateExpectedWaitTime(nameIndex, judges);

    assertEquals(result, expectedWaitTime);
  }
);

// How many times we want to iterate on random cases
const NUMBER_OF_TESTS = 10000;
const MAX_JUDGES = 13;
const MAX_NAMES = 200;

for (let i = 0; i < NUMBER_OF_TESTS; i++) {
  Deno.test("should calculate the correct time for any random case", () => {
    const name = getRandomNames(1)[0];

    const judges = Math.floor(Math.random() * MAX_JUDGES) + 1;

    const names = getRandomNames(Math.floor(Math.random() * MAX_NAMES) + 1, [
      name,
    ]);

    const result = court(name, judges, names.join(" "));

    const nameIndex = getNameIndex(name, names);

    const expectedWaitTime = calculateExpectedWaitTime(nameIndex, judges);

    assertEquals(result, expectedWaitTime);
  });
}
