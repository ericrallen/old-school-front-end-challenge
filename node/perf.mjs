import { writeFile } from "node:fs/promises";

import { court } from "./index.mjs";

const NUMBER_OF_TESTS = 1000;
const MIN_NUMBER_OF_NAMES = 100000;
const MAX_NUMBER_OF_NAMES = 500000;
const MIN_NUMBER_OF_JUDGES = 1;
const MAX_NUMBER_OF_JUDGES = 12;

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

const numberOfNamesInIteration = [];
const numberOfJudgesInIteration = [];

console.clear();
console.log("Gathering performance data...\n");

for (let i = 0; i < NUMBER_OF_TESTS; i++) {
  const numberOfNames =
    Math.floor(Math.random() * (MAX_NUMBER_OF_NAMES - MIN_NUMBER_OF_NAMES)) +
    MIN_NUMBER_OF_NAMES;
  // MAX_NUMBER_OF_NAMES;
  numberOfNamesInIteration.push(numberOfNames);

  const numberOfJudges =
    Math.floor(Math.random() * (MAX_NUMBER_OF_JUDGES - MIN_NUMBER_OF_JUDGES)) +
    MIN_NUMBER_OF_JUDGES;
  // MAX_NUMBER_OF_JUDGES / 2;
  numberOfJudgesInIteration.push(numberOfJudges);

  const names = Array.from(
    { length: numberOfNames },
    () =>
      PHONETIC_ALPHABET[Math.floor(Math.random() * PHONETIC_ALPHABET.length)]
  ).join(" ");

  const name =
    PHONETIC_ALPHABET[Math.floor(Math.random() * PHONETIC_ALPHABET.length)];

  performance.mark(`iteration ${i} start`);
  court(name, numberOfJudges, names);
  performance.mark(`iteration ${i} end`);
  performance.measure(`iteration ${i}`, {
    detail: {
      numberOfNames,
      numberOfJudges,
      iteration: i,
    },
    start: `iteration ${i} start`,
    end: `iteration ${i} end`,
  });
}

const results = performance.getEntriesByType("measure");

const averages = {
  mean: Number(
    (
      results.reduce((total, result) => total + result.duration, 0) /
      results.length
    ).toFixed(5)
  ),
  median: Number(
    results
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(results.length / 2)].duration.toFixed(5)
  ),
  mode: Number(
    Object.entries(
      results.reduce((acc, result) => {
        const roundedDuration = result.duration.toFixed(2);
        acc[roundedDuration] = (acc[roundedDuration] || 0) + 1;
        return acc;
      }, {})
    )
      .filter(([, val]) => val > 1)
      .sort(([, valA], [, valB]) => valB - valA)
      .map(([name]) => name)[0]
  ),
  names: Math.floor(
    numberOfNamesInIteration.reduce((total, count) => total + count, 0) /
      numberOfNamesInIteration.length
  ),
  judges: Math.floor(
    numberOfJudgesInIteration.reduce((total, count) => total + count, 0) /
      numberOfJudgesInIteration.length
  ),
};

const output = `\n-[PERFORMANCE]-------------------\n
    Mean: ${averages.mean}ms
    Median: ${averages.median}ms${
  !Number.isNaN(averages.mode) ? `\n    Mode: ${averages.mode}ms` : ""
}
\n-[Configuration]-----------------\n
    ${NUMBER_OF_TESTS} iterations
    Average participants: ${averages.names}
    Average judges: ${averages.judges}
\n---------------------------------\n`;

await writeFile("perf.txt", output);

console.clear();
console.log(output);
