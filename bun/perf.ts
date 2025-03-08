import { court } from "./index";

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

console.log("Gathering performance data...");

for (let i = 0; i < NUMBER_OF_TESTS; i++) {
  const numberOfNames =
    Math.floor(Math.random() * (MAX_NUMBER_OF_NAMES - MIN_NUMBER_OF_NAMES)) +
    MIN_NUMBER_OF_NAMES;
  numberOfNamesInIteration.push(numberOfNames);

  const numberOfJudges =
    Math.floor(Math.random() * (MAX_NUMBER_OF_JUDGES - MIN_NUMBER_OF_JUDGES)) +
    MIN_NUMBER_OF_JUDGES;
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
  mean: (
    results.reduce((total, result) => total + result.duration, 0) /
    results.length
  ).toFixed(5),
  median: results
    .sort((a, b) => a.duration - b.duration)
    [Math.floor(results.length / 2)].duration.toFixed(5),
  mode: Object.entries(
    results.reduce((acc: Record<string, number>, result) => {
      const roundedDuration = result.duration.toFixed(5);
      acc[roundedDuration] = (acc[roundedDuration] || 0) + 1;
      return acc;
    }, {})
  )
    .sort(([, valA], [, valB]) => valB - valA)
    .map(([name]) => name)[0],
  names: Math.floor(
    numberOfNamesInIteration.reduce((total, count) => total + count, 0) /
      numberOfNamesInIteration.length
  ),
  judges: Math.floor(
    numberOfJudgesInIteration.reduce((total, count) => total + count, 0) /
      numberOfJudgesInIteration.length
  ),
};

console.clear();
console.log("\n-[PERFORMANCE]-------------------\n");
console.log(`    Mean: ${averages.mean}ms`);
console.log(`    Median: ${averages.median}ms`);
console.log(`    Mode: ${averages.mode}ms\n`);
console.log("-[Configuration]-----------------\n");
console.log(`    ${NUMBER_OF_TESTS} iterations`);
console.log(`    Average participants: ${averages.names}`);
console.log(`    Average judges: ${averages.judges}\n`);
console.log("---------------------------------\n\n");
