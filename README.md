# Demos

This repo contains some demos created for a challenge.

## No JavaScript Challenge

The first part of the challenge was to render a specific UI design, variable length cards that have a show/hide toggle, without any JavaScript.

### My Approach

I decided to take things a few steps further to provide a better user experience:

- Responsive, mobile-first design:
  - **Small Screens**: single columnn with vertical scroll
  - **Medium Screens**: single row with horizontal scroll and 1/2 screen width items
  - **Large Screens**: single row with horizontal scroll and 1/3 screen width items
  - **Note**: Horizontal scrolling is usually best avoided, but the expand/collapse effect with variable length items like a recipe can lead to the UI jumping around too much as cards are collapsed/expanded. That jumping and reflowing UI could probably be resolved with a Masonry-like layout, but that didn't feel like the right choice for the user experience given the example was to use a recipe and you generally want to be able to focus on a recipe.
- Highligher effect on important bits - using an inline `<code>` block and CSS linear-gradient to apply a highlighter effect for key details
- Checked items receive a strikethrough, and a marker-like crossing off the list effect, to help the user keep track of where they're at in the recipe or ingredients list
- Dynamic reset button for a recipe to uncheck any checked ingredients or steps (Firefox likes to save the state of these checkboxes, so it's a nice way to start a recipe over)
- Animated expand/collapse
- Show More/Less toggle only visible\* when container has enough content to expand
  - \* _The trick that this uses relies on scroll animations, which are only supported in Blink right now, so Firefox and Safari will still see the toggle on small items until support for scroll animations is implemented in those browser's engines._
- Includes the Recipe structured data schema
- Accessibility:
  - full keyboard navigation support
  - screen reader support
  - support for `prefers-reduced-motion` system preference
  - Fluid layout when resizing text with browser zoom controls
- Native HTML `popover`s for extra notes about a recipe

## JavaScript Wait Time Challenge

The second part of the challenge was to calculate the time it would take for a person to be seen for a court appointment when there are a limited number of judges available and all of the waiting attendees are in some ordered queue (in this case alphabetically by name).

The goal was to write the fastest JavaScript function you could come up with to solve this problem.

### My Approach

I'm a firm believer in the [`Make it work. Make it right. Make it fast.`](https://wiki.c2.com/?MakeItWorkMakeItRightMakeItFast) approach to iterative software development, so that's how I approached this.

### Make it work

In order to make this work, I broke it down into it's constituent parts:

1. We are expecting a string of space-delimited names as the current waiting list
2. We need to sort the user's name into that list
3. Due to the limited number of judges, we'll be looking at grouping the waiting list
4. Once we know which group the user is in, we can calculate the time it will take for them to be seen
5. The total elapsed time until they are done is that time to be seen plus the time an appointment takes

I knew there was most likley an algorithmic way to solve this, but that's more of a `Make it right.` or `Make it fast.` situation, so I started with a brute force solution:

```ts
export const APPOINTMENT_LENGTH = 30;

export function getWaitTime(judges = 0, nameIndex = 0) {
  let waitTime = 0;

  // if we're in the first group, we'll be seen immediately
  if (nameIndex < judges) {
    return APPOINTMENT_LENGTH;
  }

  let occupiedJudges = 0;

  // TODO: there's certainly some better approach that doesn't involve looping
  for (let i = 0; i <= nameIndex; i++) {
    // we're occupying a judge
    occupiedJudges++;

    // TODO: loops within loops are bad, we'll want to optimize this
    // if we still have judges to occupy, let's see more folks from this group
    while (occupiedJudges < judges && i <= nameIndex) {
      i++;
      occupiedJudges++;
    }

    // APPOINTMENT_LENGTH minutes have passed
    waitTime += APPOINTMENT_LENGTH;

    // judges are free to see the next group
    occupiedJudges = 0;
  }

  return waitTime;
}

export function court(name = "", judges = 0, waitingList = "") {
  // If there are no judges, the wait is infinite
  if (judges < 1) {
    return Infinity;
  }

  // If we are the only person in line, we'll be seen immediately
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
```

#### Testing

In testing this, I learned a few things that will inform the `Make it right.` and `Make it fast.` stages:

1. In order to test this and verify that your approach works for arbitrary configurations of judges and names, you have to solve it algorithmically
2. As is the case with a lot of programming, for small numbers of people, this is already pretty fast, but this is a situation where we specifically want to push performance, so we're going to want to test with numbers that are greater by orders of magnitude than the examples
3. I was using `Bun`, but things might look like in `Node`, `Deno`, and different browser engines

#### Performance

Now that we had a basic function and could validate that it worked, it was time to do some performance profiling.

##### Step one

I wrapped each logical operation with [`console.time()`](https://developer.mozilla.org/en-US/docs/Web/API/console/time_static) and [`console.timeEnd()`](https://developer.mozilla.org/en-US/docs/Web/API/console/timeEnd_static) calls to see where it would be worth investing time improving performance.

The output wasn't really granular enough to be that helpful:

```log
[0.00ms] split
[0.00ms] push
[0.01ms] combine names
[0.01ms] sort
[0.00ms] index of
[0.00ms] waitTime - loop
[0.00ms] waitTime
[0.00ms] getWaitTime
[0.02ms] court
```

**Note**: I wrapped calls to the built-in prototype functions like `String.prototype.split()`, `Array.prototype.push()`, and `Array.prototype.sort()` just in case there were any outliers where we'd need to do something clever. In general, the likelihood of one of them being the bottlenock instead of our own code is low, but there are situations where you might need to adapt something to optimize your specific use case. Also, the engine will sometimes optimize things under the hood in ways that you don't anticipate, so we don't want to assume someting will or won't be performant without measuring it first. Measure twice. Optimize once.

##### Step two

Let's try a different approach using [`performance.mark()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) and [`performance.measure()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure). We don't want to prematurely optimize, so let's start with just looking at the overall function.

I added a script that wraps our function in `performance.mark()` calls, calls the function a configurable number of times, and then returns the average execution time:

```log
-[PERFORMANCE]-------------------

    Mean: 0.05035ms
    Median: 0.04154ms
    Mode: 0.01604ms

-[Configuration]-----------------

    1000 iterations
    Average participants: 558
    Average judges: 5

---------------------------------
```

That's okay, but those are rookie numbers. We need to increase that participant count to really see what's going on.

With a minimum of `1000` participants, we can see the numbers start to go up:

```log
-[PERFORMANCE]-------------------

    Mean: 0.42935ms
    Median: 0.40863ms
    Mode: 0.08158ms

-[Configuration]-----------------

    1000 iterations
    Average participants: 5525
    Average judges: 5

---------------------------------
```

Let's dig deeper. What about if we use a random number of people between `100,000` and `500,000` for each iteration?

```log
-[PERFORMANCE]-------------------

    Mean: 36.96402ms
    Median: 36.21108ms
    Mode: 10.77529ms

-[Configuration]-----------------

    1000 iterations
    Average participants: 296107
    Average judges: 6

---------------------------------
```

Okay, so our time to execute is growing quite a bit with the number of names we're dealing with in the queue. Things are still reasonably fast, but there's almost always room to try to improve our numbers.

I think we have enough information to move on to the `Make it right` part of our iterative cycle.

### Make it right

Now that we know there's some code that could be faster, let's try to see if we can get some useful info from the `console.time()` and `console.timeEnd()` methods we tried to use earlier. By combining our performance monitoring scripts, and sticking with lists of hundreds of thousands of names, we can see some actual values for each stage of the process:

```log
[6.99ms] split
[0.16ms] push
[7.18ms] combine names
[39.57ms] sort
[1.00ms] index of
[0.30ms] waitTime - loop
[0.30ms] waitTime
[0.38ms] getWaitTime
[48.15ms] court
[65.64ms] runtime

-[PERFORMANCE]-------------------

    Mean: 48.32021ms
    Median: 48.32021ms
    Mode: 48.32021ms

-[Configuration]-----------------

    1 iterations
    Average participants: 291631
    Average judges: 6

---------------------------------
```

It looks like the `sort` is taking the most time - we're sorting between `100,000` and `500,000` items per iteration, so that makes sense - but there are some other spots we can try to optimize, too. We're using the built-in `.sort()` method, so let's save the sorting for `Make it fast`.

Anything we do to improve the native sorting likely doesn't fall into the best practices and maintainability focused `Make it right` stage.

#### Step one

The first thing I want to do is fix the way we're calculating the wait time. In the previuos code, we were iterating with a `for()` loop and then using a `while()` loop inside of that to segment our list of names with appointments into groups and increment the wait time per group. Nested loops are bad.

While writing some tests to validate my calcuations, I came up with a more efficient way to solve for the wait time:

```math
\text{WaitTime}(p, j) = (\lfloor \frac{p}{j} \rfloor + 1) \cdot A
```

**Where**:

- `p` is the 0-indexed position of the user in the queue
- `j` is the number of judges available for appointments
- `A` is the duration of an appointment

**Note**: The `+1` is to account for the length of the appointment itself.

In our codebase, it looks like this:

```ts
// Note: we check for judges < 1 before we call `getWaitTime`,
// so we can safely default to `1` here
function getWaitTime(nameIndex = 0, judges = 1) {
  // We'll check to see if the user will be in the first group
  // before we do any math
  return nameIndex < judges ? APPOINTMENT_LENGTH : (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;
}
```

Now, let's update our implementation, but we'll want to run both the old and new `getWaitTime()` implementations so we can compare how they are impacting our results:

```log
[7.03ms] split
[0.13ms] push
[7.19ms] combine names
[43.05ms] sort
[1.18ms] index of
[0.25ms] waitTime - loop
[0.26ms] waitTime
[0.34ms] getWaitTime
[0.01ms] NEW waitTime
[0.03ms] NEW getWaitTime
[51.82ms] court
[70.20ms] runtime

-[PERFORMANCE]-------------------

    Mean: 51.98950ms
    Median: 51.98950ms
    Mode: 51.98950ms

-[Configuration]-----------------

    1 iterations
    Average participants: 330182
    Average judges: 2

---------------------------------
```

**Note**: The `waitTime` performance timer wraps the execution of the code inside of the `getWaitTime` function and the `getWaitTime` performance timer wraps the call to the `getWaitTime()` funcion in our `court()` function.

It looks like our new wait time calculation is significantly faster. So let's swich over to that one and remove the old logic from our benchmarking:

```log
[6.19ms] split
[0.16ms] push
[6.38ms] combine names
[36.57ms] sort
[2.02ms] index of
[0.01ms] NEW waitTime
[0.07ms] NEW getWaitTime
[45.04ms] court
[60.78ms] runtime

-[PERFORMANCE]-------------------

    Mean: 45.18375ms
    Median: 45.18375ms
    Mode: 45.18375ms

-[Configuration]-----------------

    1 iterations
    Average participants: 274298
    Average judges: 5

---------------------------------
```

**Note**: I'll leave the `NEW` label in there so it's easy to tell which things we've tweaked as we iterate.

#### Step two

Now, let's look at some other things we could do to the `court()` function to `Make it right.`.

One thing I noticed after looking at the code more thoroughly is that we're providing an early escape hatch for the edge cases, to keep the [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) of our function low, but I wonder if we should optimize for the most likely conditions rather than edge cases?

```ts
function court(name = "", judges = 0, waitingList = ""): number {
  if (judges > 0) {
    if (waitingList.length > 0) {
      const waitingNames = waitingList.split(" ");

      waitingNames.push(name);

      const sortedNames = waitingNames.sort();

      const nameIndex = sortedNames.indexOf(name);

      const waitTime = getWaitTime(nameIndex, judges);

      return waitTime;
    }
    return APPOINTMENT_LENGTH;
  }

  return Infinity;
}
```

This represents a new execution path for our code, so we'll need to update our benchmark script to run both implementations and let us compare them:

```log
Gathering performance data...

Running old implementation...

-[PERFORMANCE]-------------------

    Mean: 68.10211ms
    Median: 67.43637ms
    Mode: 63.01508ms

-[Configuration]-----------------

    1000 iterations
    Average participants: 500000
    Average judges: 6

---------------------------------

Running new implementation...

-[PERFORMANCE]-------------------

    Mean: 68.96045ms
    Median: 68.26633ms
    Mode: 66.13996ms

-[Configuration]-----------------

    1000 iterations
    Average participants: 500000
    Average judges: 6

---------------------------------

-[SUMMARY]-----------------------

    Old implementation: 68.10211ms
    New implementation: 68.96045ms

    Old implementation is faster
    by -0.85834ms on average

---------------------------------
```

I ran this quite a few times with `500,000` participants, 6 judges, and `1,000` iterations, and it was pretty close every time, but it looks like our previous early escape hatch approach might be just a little faster?

Things like this can sometimes be environment-dependent, and the underlying engine might optimize differently between Node and the browser, or Bun and Deno. If we were trying to squeeze out every millisecond from this, we may need to optimize for a known environment where we expect the code to execute and accept performance tradeoffs in other runtimes, or we might decide to focus on more general performance across the disparate runtime environments. It really depends on the context of what we're building, if/how we're distributing it, and where we expect it to live.

So let's revert this change for now.

Everything else is about as good as it could be for this simple of a function.

### Make it fast(er)

There can be significant differences in how certain built-in methods function across engines, so JavaScript performance isn't always a science - sometimes it's more of an art.

#### Step one

Our `getWaitTime()` method is pretty small, I wonder if we gain any performance by removing the call to the second function and moving all of the logic into the `court()` function?

```ts
export function court(name = "", judges = 0, waitingList = "") {
  if (judges > 0) {
    if (waitingList.length > 0) {
      const waitingNames = waitingList.split(" ");

      waitingNames.push(name);

      const sortedNames = waitingNames.sort();

      const nameIndex = sortedNames.indexOf(name);

      if (nameIndex < judges) {
        return APPOINTMENT_LENGTH;
      }

      const waitTime = (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;

      return waitTime;
    }

    return APPOINTMENT_LENGTH;
  }

  return Infinity;
}
```

I'll label this one `NEWER watTime` so we can see the difference:

```log
[8.84ms] split
[0.23ms] push
[9.10ms] combine names
[65.12ms] sort
[5.58ms] index of
[0.00ms] NEWER waitTime
[0.00ms] NEW waitTime
[0.08ms] NEW getWaitTime
[79.92ms] court
[100.23ms] runtime
```

Hard to tell with our `console.time()` metrics, let's run a benchmark:

```log
Gathering performance data...

Running old implementation...
[8.75ms] split
[0.23ms] push
[9.01ms] combine names
[63.78ms] sort
[4.02ms] index of
[0.00ms] NEW waitTime
[0.07ms] NEW getWaitTime
[76.90ms] court
[97.37ms] runtime

-[PERFORMANCE]-------------------

    Mean: 77.01633ms
    Median: 77.01633ms
    Mode: 77.01633ms

-[Configuration]-----------------

    1 iterations
    Average participants: 500000
    Average judges: 6

---------------------------------

Running new implementation...
[8.89ms] split
[0.14ms] push
[9.03ms] combine names
[55.25ms] sort
[2.35ms] index of
[0.01ms] NEWER waitTime
[66.65ms] NEW court

-[PERFORMANCE]-------------------

    Mean: 71.86713ms
    Median: 77.01633ms
    Mode: 66.71792ms

-[Configuration]-----------------

    1 iterations
    Average participants: 500000
    Average judges: 6

---------------------------------

-[SUMMARY]-----------------------

    Old implementation: 77.01633ms
    New implementation: 71.86713ms

    New implementation is faster
    by 5.14920ms on average

---------------------------------
```

It looks like it might be a little faster, but it isn't a huge change. Let's up those iterations and add back in some randomization to the number of names in the queue and the number of judges to reflect more real-world scenarios:

```log
Gathering performance data...

Running old implementation...

-[PERFORMANCE]-------------------

    Mean: 40.27686ms
    Median: 39.58979ms
    Mode: 11.9805ms

-[Configuration]-----------------

    1000 iterations
    Average participants: 301643
    Average judges: 6

---------------------------------

Running new implementation...

-[PERFORMANCE]-------------------

    Mean: 39.98556ms
    Median: 39.24696ms
    Mode: 18.25363ms

-[Configuration]-----------------

    1000 iterations
    Average participants: 299494
    Average judges: 6

---------------------------------

-[SUMMARY]-----------------------

    Old implementation: 40.27686ms
    New implementation: 39.98556ms

    New implementation is faster
    by 0.29130ms on average

---------------------------------
```

It's not much on average, but let's keep it for now.

#### Step two

Okay, let's tackle what seems to be eating up the most execution time:

```log
...
[39.57ms] sort
...
[43.05ms] sort
...
[36.57ms] sort
...
[65.12ms] sort
...
[63.78ms] sort
...
[55.25ms] sort
```

Over and over again, our sort takes orders of magnitude longer than the rest of our code.

> The time and space complexity of the sort cannot be guaranteed as it depends on the implementation.
>
> - [`MDN Array.prototype.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

There are lots of different sorting algorithms out there. In general, the `Array.prototype.sort()` method is pretty good, [especially in Node's V8 engine](https://v8.dev/blog/array-sort), but there are cases where the underlying engine developers have optimized for the most common scenarios and what we're sorting might not fall into those execution paths.

> Sorting in JavaScript is hard.
>
> - [Simon Zünd - V8 Dev Blog](https://v8.dev/blog/array-sort)

To help understand what's causing our bottleneck we're going to take a few different approaches to tweak our sorting.

##### Sorting Methods

Sorting in JavaScript is an area of [some complexity](https://www.gregorygaines.com/blog/the-only-javascript-sorting-guide-youll-ever-need/)and a lot of [opinions](https://stackoverflow.com/a/26295229/656011). It's also fraught with outdated information that no longer applies to the current browser/runtime environments we're using today and the hard work that engine maintainers have put into improving performance.

So, we should probably test a bunch of these approaches.

Because this is a simple exercise and the spririt of the challenge was to not use external tools, I won't be pulling in any 3rd party sorting libraries, and because I don't think it's a valuable use of my time, I won't be reproducing any of the other sorting algorithms here either.

We're only going to use the sorting methods that JavaScript provides.

I wired up another performance benchmark that lets us test different ways of sorting an Array:

- [`Array.prototype.sort()`](): Just the native sort with a split string on spaces (`" "`)
- `Array.prototype.sort()` w/ `String.prototype.toLowerCase()`: Just like `Array.prototype.sort()`, except we use `String.prototype.toLowerCase()` on the string first to see if normalizing the strings gives us a performance boost
- [`Array.prototype.toSorted()`](): Instead of sorting the array in place, let's use the `Array.prototype.toSorted()` method to store the sorted array in a new variable
- [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare): an older, locale-aware natural sort for Strings in JavaScript
- [`IntlCollator.prototype.compare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/compare): the modern locale-aware natural sort for Strings in JavaScript
- [`Array.prototype.sort(compareFn`)](https://stackoverflow.com/a/40355107/656011): a compare function that many different versions of showed up across all of the various discussions about sorting strings in JavaScript

```log
-[PERFORMANCE]-------------------

    sort(): 23.28121ms
    toLowerCase(): 23.33817ms
    toSorted(): 24.52657ms
    localeCompare(): 58.67902ms
    compareFn: 67.54217ms
    collator.compare(): 98.18516ms

-[Configuration]-------------------

    1000 iterations

---------------------------------
```

So, it looks like the way that the engine optimizes `Array.prototype.sort()` is the fastest approach for us without pulling in a 3rd party library or writing our own implemetation of another, more complicated sorting algorithm.

**Note**: You can also see how different the results are for a bunch of different algorithms depending on your browser. [Here's one from my browser](https://www.measurethat.net/Benchmarks/ShowResult/591284), but you can look at the [other results](https://www.measurethat.net/Benchmarks/ListResults/3549) showing differences. It's mostly in Chrome - but I think there's one Edge in there and a handful of Firefox and Safari profiles.

Integrating a different sorting algorithm seems out of scope for this challenge, so we'll just leave it here for now.

If things truly ended up at an actual perceivable bottleneck for users, we could investigate some strategies like:

- converting the strings to a numeric representation and using `TypedArray`s for sorting at a lower level
  - Converting the first 2-4 characters to bytes and storing them in something like a [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) would allow us to leverage the much faster sorting of numerical values, but we might negate any performance improvement by adding too much overhead from converting the strings; there could be some issues with similar names not getting sorted perfectly, too, but there are tradeoffs to every approach
- chunking the data, sorting the chunks, and then merging the sorted chunks
  - We could also investigate parallelizing the chunk sorting with [Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- implementing a more robust sorting algorithm
  - This will likely have impacts in various runtimes, so it would depend on the expect environment and usecase
  - There are 3rd party libraries like [`fast-sort`](https://www.npmjs.com/package/fast-sort) could be worth investigating
- Counting duplicates and converting the `Array` to a `Set` to remove duplicates before sorting and then using the duplicate count to calculate the offset for the index of the user's name in the sorted Array could save some time during the sort if there are repeated names, but might introduce more complexity and overhead
- We could also explore things like testing `if/else` statements vs ternary operators, but differnet engines might optimize these code paths differently, so the results may be inconclusive, but we could see an environment-specific increase

### Conclusion

There are still many ways we could approach optimizing this, but without more detailed analysis of the runtime we're expecting the code to execute in most often, and real world data on measurable user impact or server costs any further optimization is probably premature and could prevent us from benefiting from future engine improvements and optimizations.

| Runtime | Mean     | Median   | Mode\*  | Iterations | Avg. Items |
| ------- | -------- | -------- | ------- | ---------- | ---------- |
| Bun     | 37.976ms | 37.284ms | 17.2ms  | 1000       | 301025     |
| Node    | 38.640ms | 36.899ms | 26.74ms | 1000       | 302644     |
| Deno    | 35.168ms | 34.359ms | 11.31ms | 1000       | 299598     |

_\* These tests rarely had a frequently repeated value, so the mode only represents a handful of repeated values after rounding to 2 decimals of precision._

You can see the browser version at [ericrallen.github.io/old-school-front-end-challenge/how-long.html](https://ericrallen.github.io/old-school-front-end-challenge/how-long.html) and test it in your preferred browser. With 1,000,000 participants it executes in ~130-160ms and with 10,000 participants it has nearly sub-submillisecond response time.
