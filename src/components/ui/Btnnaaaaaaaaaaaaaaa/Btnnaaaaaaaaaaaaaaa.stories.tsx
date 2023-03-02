import React from "react"
import { Btnnaaaaaaaaaaaaaaa } from "./Btnnaaaaaaaaaaaaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaaaaaaaaaaaaProps as Props } from "./Btnnaaaaaaaaaaaaaaa"

export default {
  title: "Btnnaaaaaaaaaaaaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaaaaaaaaaaaaa {...args} />
Default.args = {
  laoding: 84,
  some: 29,
  more: "unknown",
  lol: "unknown",
  asdf: "unknown",
} satisfies Props

Default.argTypes = {}
