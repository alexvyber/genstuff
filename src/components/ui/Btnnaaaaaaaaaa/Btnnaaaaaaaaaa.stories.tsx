import React from "react"
import { Btnnaaaaaaaaaa } from "./Btnnaaaaaaaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaaaaaaaProps as Props } from "./Btnnaaaaaaaaaa"

export default {
  title: "Btnnaaaaaaaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaaaaaaaa {...args} />
Default.args = {
  laoding: 64,
  some: 9,
  more: "unknown",
  lol: "unknown",
  asdf: "unknown",
} satisfies Props

Default.argTypes = {}
