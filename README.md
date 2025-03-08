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

```sh
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

**Note**: I wrapped calls to built-in functions like `String.prototype.split()`, `Array.prototype.push()`, and `Array.prototype.sort()` just in case there were any outliers where we'd need to do something clever - the likelihood of them being the bottlenock instead of my code was very, very low

##### Step two

Let's try a different approach using `performance.mark()` and `performance.measure()`. We don't want to prematurely optimize, so let's start with just looking at the overall function.

I added a script that wraps our function in `performance.mark()` calls, calls the function a bunch of times, and then returns the average response time:

```sh
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

With a minimum of `1000` participants, we can see things are not looking as good:

```sh
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

Let's dig deeper. What about a minimum of `100000`?

```sh
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

That's not looking so great. And now we've validated our assumption that this can definitely be better.

I think we have enough information to move on to the `Make it right` part of our iterative cycle.

#### Make it right

_Coming Soon..._

#### Make it fast(er)

_Coming Soon..._
