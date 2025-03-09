import { court, newCourt } from "./index.perf";

const NUMBER_OF_TESTS = 10;
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

console.log("Running old implementation...");

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

const oldResults = performance.getEntriesByType("measure");

const oldAverages = {
  mean: Number(
    (
      oldResults.reduce((total, result) => total + result.duration, 0) /
      oldResults.length
    ).toFixed(5)
  ),
  median: Number(
    oldResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(oldResults.length / 2)].duration.toFixed(5)
  ),
  mode: Number(
    Object.entries(
      oldResults.reduce((acc: Record<string, number>, result) => {
        const roundedDuration = result.duration.toFixed(5);
        acc[roundedDuration] = (acc[roundedDuration] || 0) + 1;
        return acc;
      }, {})
    )
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

// console.clear();
console.log("\n-[PERFORMANCE]-------------------\n");
console.log(`    Mean: ${oldAverages.mean}ms`);
console.log(`    Median: ${oldAverages.median}ms`);
console.log(`    Mode: ${oldAverages.mode}ms`);
console.log("\n-[Configuration]-----------------\n");
console.log(`    ${NUMBER_OF_TESTS} iterations`);
console.log(`    Average participants: ${oldAverages.names}`);
console.log(`    Average judges: ${oldAverages.judges}`);
console.log("\n---------------------------------\n");

console.log("Running new implementation...");

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

  performance.mark(`NEW iteration ${i} start`);
  newCourt(name, numberOfJudges, names);
  performance.mark(`NEW iteration ${i} end`);
  performance.measure(`NEW iteration ${i}`, {
    detail: {
      numberOfNames,
      numberOfJudges,
      iteration: i,
    },
    start: `NEW iteration ${i} start`,
    end: `NEW iteration ${i} end`,
  });
}

const newResults = performance.getEntriesByType("measure");

const newAverages = {
  mean: Number(
    (
      newResults.reduce((total, result) => total + result.duration, 0) /
      newResults.length
    ).toFixed(5)
  ),
  median: Number(
    newResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(newResults.length / 2)].duration.toFixed(5)
  ),
  mode: Number(
    Object.entries(
      newResults.reduce((acc: Record<string, number>, result) => {
        const roundedDuration = result.duration.toFixed(5);
        acc[roundedDuration] = (acc[roundedDuration] || 0) + 1;
        return acc;
      }, {})
    )
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

// console.clear();
console.log("\n-[PERFORMANCE]-------------------\n");
console.log(`    Mean: ${newAverages.mean}ms`);
console.log(`    Median: ${newAverages.median}ms`);
console.log(`    Mode: ${newAverages.mode}ms`);
console.log("\n-[Configuration]-----------------\n");
console.log(`    ${NUMBER_OF_TESTS} iterations`);
console.log(`    Average participants: ${newAverages.names}`);
console.log(`    Average judges: ${newAverages.judges}`);
console.log("\n---------------------------------\n");

console.log("\n-[SUMMARY]-----------------------\n");
console.log(`    Old implementation: ${oldAverages.mean}ms`);
console.log(`    New implementation: ${newAverages.mean}ms\n`);
console.log(
  `    ${
    oldAverages.mean > newAverages.mean
      ? `New implementation is faster\n    by ${Math.abs(
          newAverages.mean - oldAverages.mean
        ).toFixed(5)}ms on average`
      : `Old implementation is faster\n    by ${Math.abs(
          oldAverages.mean - newAverages.mean
        ).toFixed(5)}ms on average`
  }`
);
console.log("\n---------------------------------\n");
