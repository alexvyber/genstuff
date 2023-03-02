import React from "react"
import { Btnnaa } from "./Btnnaa"

import type { Story } from "@ladle/react"
import type { BtnnaaProps as Props } from "./Btnnaa"

export default {
  title: "Btnnaa/Default",
}

export const Default: Story<Props> = args => <Btnnaa {...args} />
Default.args = { laoding: 87, some: 30, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
