const ITERATIONS = 100;
const MIN_LENGTH = 100000;
const MAX_LENGTH = 500000;

const PHONETIC_ALPHABET =
  "Alpha Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliet Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu Alpha  Bravo  Charlie  Delta  Echo  Foxtrot  Golf  Hotel  India  Juliet  Kilo  Lima  Mike  November  Oscar  Papa  Quebec  Romeo  Sierra  Tango  Uniform  Victor  Whiskey  X-ray  Yankee  Zulu";

const generateRandomString = (length: number) => {
  return Array.from({ length }, () => {
    const arrayOfString = PHONETIC_ALPHABET.split(" ");
    return arrayOfString[Math.floor(Math.random() * arrayOfString.length)];
  }).join(" ");
};

console.clear();
console.log("Gathering performance data...\n");

const tests = [
  {
    name: ".sort()",
    preprocess: (str: string) => str.split(" "),
    test: (array: string[]) => {
      // console.time("sort()");
      const sorted = array.sort();
      // console.timeEnd("sort()");
      return sorted;
    },
  },
  {
    name: ".toLowerCase()",
    preprocess: (str: string) => str.toLowerCase().split(" "),
    test: (array: string[]) => {
      // console.time("toLowerCase()");
      const sorted = array.sort();
      // console.timeEnd("toLowerCase()");
      return sorted;
    },
  },
  {
    name: ".toSorted()",
    preprocess: (str: string) => str.split(" "),
    test: (array: string[]) => {
      // console.time("toSorted()");
      const sorted = array.toSorted();
      // console.timeEnd("toSorted()");
      return sorted;
    },
  },
  {
    name: ".localeCompare()",
    preprocess: (str: string) => str.split(" "),
    test: (array: string[]) => {
      // console.time("localeCompare()");
      const sorted = array.sort((a, b) => a.localeCompare(b));
      // console.timeEnd("localeCompare()");
      return sorted;
    },
  },
  {
    name: "collator.compare()",
    preprocess: (str: string) => str.split(" "),
    test: (array: string[]) => {
      // console.time("collator.compare()");
      const collator = new Intl.Collator();
      const sorted = array.sort(collator.compare);
      // console.timeEnd("collator.compare()");
      return sorted;
    },
  },
  {
    name: "compareFn",
    preprocess: (str: string) => str.split(" "),
    test: (array: string[]) => {
      const sorted = array.sort((a, b) => +(a > b) || -(a < b));

      return sorted;
    },
  },
];

for (let i = 0; i < ITERATIONS; i++) {
  const length = Math.floor(
    Math.random() * (MAX_LENGTH - MIN_LENGTH) + MIN_LENGTH
  );

  const string = generateRandomString(length);

  for (let j = 0; j < tests.length; j++) {
    const array = tests[j].preprocess(string);

    performance.mark(`iteration ${i} ${tests[j].name} start`);
    tests[j].test(array);
    performance.mark(`iteration ${i} ${tests[j].name} end`);

    performance.measure(`iteration ${i} ${tests[j].name}`, {
      detail: {
        iteration: i,
      },
      start: `iteration ${i} ${tests[j].name} start`,
      end: `iteration ${i} ${tests[j].name} end`,
    });
  }
}

const results = performance.getEntriesByType("measure");

const sortResults = [];
const toLowerCaseSortResults = [];
const toSortedSortResults = [];
const localeCompareSortResults = [];
const collatorCompareSortResults = [];
const customComparatorSortResults = [];

for (const result of results) {
  switch (true) {
    case result.name.endsWith(".sort()"):
      sortResults.push(result);
      break;
    case result.name.endsWith(".toLowerCase()"):
      toLowerCaseSortResults.push(result);
      break;
    case result.name.endsWith(".toSorted()"):
      toSortedSortResults.push(result);
      break;
    case result.name.endsWith(".localeCompare()"):
      localeCompareSortResults.push(result);
      break;
    case result.name.endsWith("collator.compare()"):
      collatorCompareSortResults.push(result);
      break;
    case result.name.endsWith("compareFn"):
      customComparatorSortResults.push(result);
      break;
    default:
      break;
  }
}

const sortResultsAverages = {
  name: "sort()",
  mean: Number(
    (
      sortResults.reduce((acc, result) => acc + result.duration, 0) /
      sortResults.length
    ).toFixed(5)
  ),
  median: Number(
    sortResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(sortResults.length / 2)].duration.toFixed(5)
  ),
};

const toLowerCaseSortResultsAverages = {
  name: "toLowerCase()",
  mean: Number(
    (
      toLowerCaseSortResults.reduce((acc, result) => acc + result.duration, 0) /
      toLowerCaseSortResults.length
    ).toFixed(5)
  ),
  median: Number(
    toLowerCaseSortResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(toLowerCaseSortResults.length / 2)].duration.toFixed(5)
  ),
};

const toSortedSortResultsAverages = {
  name: "toSorted()",
  mean: Number(
    (
      toSortedSortResults.reduce((acc, result) => acc + result.duration, 0) /
      toSortedSortResults.length
    ).toFixed(5)
  ),
  median: Number(
    toSortedSortResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(toSortedSortResults.length / 2)].duration.toFixed(5)
  ),
};

const localeCompareSortResultsAverages = {
  name: "localeCompare()",
  mean: Number(
    (
      localeCompareSortResults.reduce(
        (acc, result) => acc + result.duration,
        0
      ) / localeCompareSortResults.length
    ).toFixed(5)
  ),
  median: Number(
    localeCompareSortResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(localeCompareSortResults.length / 2)].duration.toFixed(5)
  ),
};

const collatorCompareSortResultsAverages = {
  name: "collator.compare()",
  mean: Number(
    (
      collatorCompareSortResults.reduce(
        (acc, result) => acc + result.duration,
        0
      ) / collatorCompareSortResults.length
    ).toFixed(5)
  ),
  median: Number(
    collatorCompareSortResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(collatorCompareSortResults.length / 2)].duration.toFixed(5)
  ),
};

const customComparatorSortResultsAverages = {
  name: "compareFn",
  mean: Number(
    (
      customComparatorSortResults.reduce(
        (acc, result) => acc + result.duration,
        0
      ) / customComparatorSortResults.length
    ).toFixed(5)
  ),
  median: Number(
    customComparatorSortResults
      .sort((a, b) => a.duration - b.duration)
      [Math.floor(customComparatorSortResults.length / 2)]?.duration.toFixed(5)
  ),
};

function getSortedSortingMethods(...results: Record<string, any>[]) {
  return results.sort((a, b) => a.mean - b.mean);
}

const sortedSortingMethods = getSortedSortingMethods(
  sortResultsAverages,
  toLowerCaseSortResultsAverages,
  toSortedSortResultsAverages,
  localeCompareSortResultsAverages,
  collatorCompareSortResultsAverages,
  customComparatorSortResultsAverages
);

console.log("\n-[PERFORMANCE]-------------------\n");
sortedSortingMethods.forEach((method) => {
  console.log(`    ${method.name}: ${method.mean}ms`);
});
console.log("\n-[Configuration]-------------------\n");
console.log(`    ${ITERATIONS} iterations`);
console.log("\n---------------------------------\n");
