import React from "react"
import { Btnn } from "./Btnn"

import type { Story } from "@ladle/react"
import type { BtnnProps as Props } from "./Btnn"

export default {
  title: "Btnn/Default",
}

export const Default: Story<Props> = args => <Btnn {...args} />
Default.args = { laoding: 74, some: 64, more: "unknown", lol: "unknown" } satisfies Props

Default.argTypes = {}
