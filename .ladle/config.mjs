/**
 * This file is optional.
 *
 * To setup config for specific stories to be included
 *
 * stories: [
 *    "src/a11y.stories.tsx",
 *    "src/control.stories.tsx",
 *    "src/controls.stories.tsx",
 * ],
 *
 *  */

// import type { StoryDecorator } from "@ladle/react";

export default {
  stories: 'src/**/*.stories.{ts,tsx}',
  appendToHead: `<style>.append {}</style>`,
  port: 9000,
}
