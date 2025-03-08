# Demos

This repo contains some demos created for a challenge.

## No JavaScript Challenge

The first part of the challenge was to render a specific UI design (variable length cards that have a show/hide) without any JavaScript.

### My Approach

I decided to take things a few steps further to provide a better user experience:

- Responsive, mobile-first design:
  - **Small Screens**: single columnn with vertical scroll
  - **Medium Screens**: single row with horizontal scroll and 1/2 screen width items
  - **Large Screens**: single row with horizontal scroll and 1/3 screen width items
  - **Note**: Horizontal scrolling is usually best avoided, but the expand/collapse effect with variable length items like a recipe make the UI jump around too much as cards are collapsed/expanded. The jumping and reflowing UI when using vertical scrolling and expanding/collapsing items could probably be resolved with a Masonry-type layout, but that didn't feel like the right choice for the user given the example was to use a recipe and you generally want to be able to focus on a recipe.
- Highligher effect on important bits - using an inline `<code>` block and CSS linear-gradient to apply a highlighter effect for key details
- Checked items receive a strikethrough, and a marker-like crossing off the list effect, to help the user keep track of where they're at in the recipe or ingredients list
- Dynamic reset button for a recipe to uncheck any checked ingredients or steps
- Animated expand/collapse
- Show More/Less toggle only visible\* when container has enough content to expand
  - \* _The trick that this uses relies on scroll animations, which are only supported in Blink right now, so Firefox and Safari will still see the toggle on small items until support for scroll animations is implemented in those browser's engines._
- Includes the Recipe structured data schema
- Accessibility:
  - full keyboard navigation support
  - full screen reader support
  - support for `prefers-reduced-motion` system preference
  - support for `prefers-color-scheme: dark` system preference
    - **Note**: There are some hacks that allow you to implement a dark/light mode toggle button (technically a checkbox like the show/hide functionality we're using to expand our cards), but that seemed out of the scope of this particular challenge.
  - Fluid layout when resizing text with browser zoom controls
- Native HTML `popover`s for extra notes about a recipe

## JavaScript Wait Time Challenge

The second part of the challenge was to calculate the time it would take for a person to be seen for a court appointment when there are a limited number of judges available and all of the waiting attendees are in some ordered queue (in this case alphabetically by name).

The goal was to write the fasted JavaScript function you could come up with to solve this problem.

### My Approach

I'm a firm believer in the `Make it work. Make it right. Make it fast.` approach to iterative software development, so that's how I approached this.

### Make it work

In order to make this work, I broke it down into it's constituent parts:

1. We are expecting a string of space-delimited names as the current waiting list
2. We need to sort the user's name into that list
3. Due to the limited number of judges, we'll be looking at grouping the waiting list
4. Once we know which group the user is in, we can calculate the time it will take for them to be seen
5. The total elapsed time until they are done is that time to be seen plus the time an appointment takes

I knew there was an algorithmic way to solve this, but that's more of a `Make it right.` or `Make it fast.` situation, so I started with a brute force solution:

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
    console.timeEnd("court");
    return Infinity;
  }

  // If we are the only person in line, we'll be seen immediately
  if (waitingList.length === 0) {
    console.timeEnd("court");
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
2. As is the case with a lot of programming, for small numbers of people, this is already pretty fast, but this is a situation where we specifically want to push performance, so we're going to dig deeper and do better
3. I was using `bun` by default and wondered what things would look like in `Node` and `Deno`

#### Performance

Now that we had a basic function and could validate that it worked, it was time to do some performance profiling.

##### Step one

I created a new version of the file with `console.time()` and `console.timeEnd()` calls around each logical operation to see where it would be worth investing time.

It looked generally like this, which wasn't super helpful:

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

**Note**: I wrapped calls to the built-in prototype functions like `String.prototype.split()`, `Array.prototype.push()`, and `Array.prototype.sort()` just in case there were any outliers where we'd need to do something clever. In general, the likelihood of one of them being the bottlenock instead of our own code is low, but there are situations where you might need to adapt something to optimize your specific use case. Also, the engine will sometimes optimize things under the hood in ways that you don't anticipate, so we don't want to assume someting will or won't be performant without measuring it.

##### Step two

Let's try a different approach using `performance.mark()` and `performance.measure()`. We don't want to prematurely optimize, so let's start with just looking at the overall function.

I added a script that wraps our function in `performance.mark()` calls, calls the function a bunch of times, and then returns the average response time:

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

With a minimum of `1000` participants, we can see things are taking a bit longer:

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

Let's dig deeper. What about if we use a list of people waiting that's somewhere between `100,000` and `500,000`?

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

Okay, so our time to execute is growing quite a bit with the number of names we're dealing with in the queue.

I think we have enough information to move on to the `Make it right` part of our iterative cycle.

### Make it right

Now that we know there's some code that could be faster, let's try to see if we can get some useful info from the `console.time()` and `console.timeEnd()` methods we tried to use earlier. By combining our performance monitoring scripts, we can get the output for each stage of the process:

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

Interestingly, it looks like the `sort` is taking the most time - we're sorting between `100,000` and `500,000` items per iteration, so that makes sense - but there are some other spots we can try to optimize, too. Let's save the sorting for `Make it fast.`.

Remember, we're still in the `Make it Right.` stage.

#### Step one

The first thing I want to do is fix the way we're calculating the wait time. In the previuos code, we were iterating with a `for()` loop and then using a `while()` loop inside of that to segment our list of names with appointments into groups and increment the wait time per group.

While writing some tests to validate my calcuations, I ended up finding a more efficient way to solve for the wait time:

```math
\text{WaitTime}(p, j) = (\lfloor \frac{p}{j} \rfloor + 1) \cdot A
```

**Where**:

- `p` is the 0-indexed position of the user in the queue
- `j` is the number of judges available for appointments
- `A` is the duration of an appointment

In our codebase, it looks like this:

```ts
// Note: we check for judges < 1 before we call `getWaitTime`,
// so we can safely default to `1` here
function getWaitTime(nameIndex = 0, judges = 1) {
  // We'll check to see if the user will be in the first group
  // before we do any math
  return nameIndex < judges
    ? APPOINTMENT_LENGTH
    : (Math.floor(nameIndex / judges) + 1) * APPOINTMENT_LENGTH;
}
```

Now, let's update our implementation and run both of the `getWaitTime()` implementations to compare how they are impacting our results:

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

It looks like our new wait time calculation is a bit better, too. So let's swich over to that one and remove the old logic from our benchmarking:

```logs
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

**Note**: I'll leave the `NEW` label in there so it's easy to tell which things we've tweaked as we keep going.

#### Step two

Now, let's look at some other things we could do to the `court()` function to `Make it right.`.

One thing I noticed after looking at the code more thoroughly is that we're providing an early escape hatch for the edge cases, to keep the Cyclomatic Complexity of our function low, but I wonder if we should optimize for the most likely conditions rather than edge cases?

```ts
function newCourt(name = "", judges = 0, waitingList = ""): number {
  if (judges > 0) {
    if (waitingList.length > 0) {
      const waitingNames = [name, ...waitingList.split(" ")];

      waitingNames.push(name);

      const waitingNamesNew = [name, ...waitingList.split(" ")];

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

```logs
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

For illustrative purposes, we'll revisit this idea later when we test Node, Deno, and the browser. Things like this can be runtime-dependent, we may need to optimize for a known environment where we expect the code to execute or focus on more general performance across disparate runtime environments.

So let's revert that change for now.

Everything else is about as good as it could be for this simple of a function.

### Make it fast(er)

Let's dig into the reason you all came here, the `Make it fast.` part of our process.

_Coming Soon..._
