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

## JavaScript Sorting Challenge

_Coming Soon..._
