import React from "react"
import { Btnnaaaaaaaaaaaa } from "./Btnnaaaaaaaaaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaaaaaaaaaProps as Props } from "./Btnnaaaaaaaaaaaa"

export default {
  title: "Btnnaaaaaaaaaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaaaaaaaaaa {...args} />
Default.args = {
  laoding: 6,
  some: 96,
  more: "unknown",
  lol: "unknown",
  asdf: "unknown",
} satisfies Props

Default.argTypes = {}
