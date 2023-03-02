import React from "react"
import { Btnnaaaaa } from "./Btnnaaaaa"

import type { Story } from "@ladle/react"
import type { BtnnaaaaaProps as Props } from "./Btnnaaaaa"

export default {
  title: "Btnnaaaaa/Default",
}

export const Default: Story<Props> = args => <Btnnaaaaa {...args} />
Default.args = { laoding: 98, some: 49, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
