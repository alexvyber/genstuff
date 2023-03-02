import React from "react"
import { Btnnaaaaaaaaa } from "./Btnnaaaaaaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaaaaaaProps as Props } from "./Btnnaaaaaaaaa"

export default {
  title: "Btnnaaaaaaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaaaaaaa {...args} />
Default.args = {
  laoding: 86,
  some: 86,
  more: "unknown",
  lol: "unknown",
  asdf: "unknown",
} satisfies Props

Default.argTypes = {}
