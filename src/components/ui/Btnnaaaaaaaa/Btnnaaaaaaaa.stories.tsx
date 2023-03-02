import React from "react"
import { Btnnaaaaaaaa } from "./Btnnaaaaaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaaaaaProps as Props } from "./Btnnaaaaaaaa"

export default {
  title: "Btnnaaaaaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaaaaaa {...args} />
Default.args = {
  laoding: 28,
  some: 7,
  more: "unknown",
  lol: "unknown",
  asdf: "unknown",
} satisfies Props

Default.argTypes = {}
